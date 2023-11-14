import { Comment, Event } from "../types";
import { useAuth } from "../contexts/AuthContext";
import timestampConverter from "../utils/TimeStamp";
import { useEffect, useRef, useState } from "react";
import { editUserEvent } from "../utils/EventApiUtils";
import { editTicketMasterComments } from "../utils/TicketMasterApiUtils";
import { styled } from "styled-components/macro";
import { primaryColorLight, secondaryColorDark } from "../UI/colors";
import { ButtonStyling } from "../UI/Button";
import { getStorage } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { fetchUserAvatar } from "../utils/UserList";

const Container = styled.div`
  display: flex;
  align-items: center;
  min-height: 10rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 3px solid ${secondaryColorDark};
  background-color: white;
`;

const UserInfo = styled.div`
  display: flex;
  margin: 0 0.5rem;
  flex-direction: column;
  align-items: center;
  width: 20%;
`;

const Image = styled.img`
  height: 2.5rem;
  width: 2.5rem;
  width: 100%;
  border-radius: 50%;
`;

const Username = styled.p`
  padding: 0.25rem 0;
`;

const Date = styled.p`
  font-size: 0.7rem;
`;

const Divider = styled.div`
  min-height: 10rem;
  width: 100%;
  border-left: 2px solid ${secondaryColorDark};
`;

const TextWrapper = styled.div`
  min-height: 8rem;
  padding: 1rem 1rem;

  p {
    font-size: 1rem;
  }
`;

const TextArea = styled.textarea`
  min-height: 8rem;
  resize: none;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 6rem;
`;

const Button = styled.button`
  ${ButtonStyling}
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 2rem;
  margin-right: 0.75rem;
  color: white;
`;

type Props = {
  comment: Comment;
  i: number;
  event: Event;
  getEvent: Function;
  eventType: string;
};

const DeleteModal = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 10px solid ${primaryColorLight};
  height: 20%;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;

  div {
    display: flex;
    margin-top: 1rem;
  }
`;

function CommentCard({ comment, event, getEvent, eventType }: Props) {
  const { currentUser } = useAuth();
  const [editActive, setEditActive] = useState<boolean>(false);
  const [deleteActive, setDeleteActive] = useState<boolean>(false);
  const commentRef = useRef<HTMLTextAreaElement | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const editComment = () => {
    setEditActive(!editActive);
  };

  const submitEditedComment = async () => {
    const newEvent = event;
    const commentIndex = newEvent.comments.findIndex((searchedComment) => {
      return comment.id === searchedComment.id;
    });

    newEvent.comments[commentIndex].content = commentRef.current!.value;

    if (eventType === "user") {
      await editUserEvent(newEvent);
    }

    if (eventType === "ticketmaster") {
      const userInfo = { comments: newEvent.comments, usersInterested: newEvent.usersInterested };
      await editTicketMasterComments(userInfo, event.id);
    }
    await getEvent();
    setEditActive(false);
  };

  const deleteComment = async () => {
    const newEvent = event;
    const commentIndex = newEvent.comments.findIndex((searchedComment) => {
      return comment.id === searchedComment.id;
    });
    newEvent.comments.splice(commentIndex, 1);

    if (eventType === "user") {
      await editUserEvent(newEvent);
    }
    if (eventType === "ticketmaster") {
      const userInfo = { comments: newEvent.comments, usersInterested: newEvent.usersInterested };
      await editTicketMasterComments(userInfo, event.id);
    }
    await getEvent();

    setEditActive(false);
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      const avatarURL = await fetchUserAvatar(comment.user.id);
      setUserAvatar(avatarURL);
    };
    fetchAvatar();
  }, [comment.user.id]);

  return (
    <Container>
      <UserInfo>
        {userAvatar && <Image src={userAvatar} alt="User Avatar" />}
        <Username>{comment.user.displayName}</Username>
        <Date> {timestampConverter(comment.date)}</Date>
      </UserInfo>

      <Divider>
        <TextWrapper>{editActive ? <TextArea ref={commentRef} defaultValue={comment.content}></TextArea> : <p>{comment.content}</p>}</TextWrapper>
      </Divider>

      {currentUser && currentUser.uid === comment.user.id && !editActive && <Button onClick={editComment}>Edit</Button>}

      {editActive && (
        <ButtonWrapper>
          <Button onClick={submitEditedComment}>Save</Button>
          <Button
            onClick={() => {
              setDeleteActive(!deleteActive);
            }}
          >
            Delete
          </Button>
        </ButtonWrapper>
      )}

      {deleteActive && (
        <DeleteModal>
          <p>Are you sure?</p>
          <div>
            <Button onClick={deleteComment}>Yes</Button>
            <Button
              onClick={() => {
                setDeleteActive(false);
              }}
            >
              No
            </Button>
          </div>
        </DeleteModal>
      )}
    </Container>
  );
}

export default CommentCard;
