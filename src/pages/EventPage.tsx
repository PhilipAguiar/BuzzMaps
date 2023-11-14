import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Comment, Event, User } from "../types";
import { getUserEvent, editUserEvent } from "../utils/EventApiUtils";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";
import CommentCard from "../components/CommentCard";
import UserCard from "../components/UserCard";
import { getTicketMasterEvent, getTicketMasterComments, editTicketMasterComments } from "../utils/TicketMasterApiUtils";
import { styled } from "styled-components/macro";
import { primaryColorLight, secondaryColorDark } from "../UI/colors";
import { device } from "../UI/MediaQueries";
import { ButtonStyling } from "../UI/Button";

const Page = styled.div`
  display: flex;
  background-color: ${primaryColorLight};
  min-height: calc(100vh - 3.5rem);
`;

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 80%;
  width: 100%;
  background-color: #f5ffff;
  margin: 5% 0;
  border: 10px solid ${secondaryColorDark};
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  padding: 2rem 1rem 0;

  @media ${device.tablet} {
    width: 85%;
    margin: 1.5rem auto;
    border: 20px solid ${secondaryColorDark};
    max-width: 70rem;
  }

  h2 {
    font-size: 2em;
    text-decoration: underline;

    @media ${device.tablet} {
      font-size: 3em;
    }
  }

  img {
    width: 40%;
  }

  span {
    padding-top: 1rem;
    color: ${secondaryColorDark};
    font-weight: 600;
    font-size: 1.5rem;
  }
`;

const TextContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0.5rem 0.5rem 0;

  p {
    font-size: 1rem;

    @include tablet {
      font-size: 1.5rem;
    }
  }
`;

const DescriptionDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  word-wrap: break-word;
  margin-bottom: 1rem;
  p,
  a {
    font-size: 1rem;

    @include tablet {
      font-size: 1.5rem;
    }
  }
`;

const AttendanceDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 65%;
  padding: 1rem 0;
  border: 2px solid ${secondaryColorDark};
  background-color: white;
`;

const Button = styled.button`
  ${ButtonStyling}
  margin: 0.5rem auto;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 50%;

  @media ${device.tablet} {
    width: 65%;
  }
`;

const NewComment = styled.div`
  display: flex;
  flex-wrap: wrap;

  label {
    padding-bottom: 4px;
    color: ${secondaryColorDark};
    font-weight: 500;
  }

  div {
    display: flex;
    align-items: center;
    min-height: 2.5rem;
    padding: 0.25rem 1rem;
    width: 100%;
    border-radius: 10px;
    border: 3px solid ${secondaryColorDark};
    outline: none;
    background-color: white;
    text-align: left;

    &:focus {
      border: 4px solid ${secondaryColorDark};
    }

    &[contenteditable="true"] {
      display: flex;
      align-items: center;
      text-align: left;
    }
  }
`;

function EventPage() {
  const { id } = useParams();
  const [pageEvent, setPageEvent] = useState<Event | null>(null);
  const commentRef = useRef<HTMLDivElement | null>(null);
  const [commentText, setCommentText] = useState<string>("");
  const [userInEvent, setUserInEvent] = useState<boolean>();
  const [eventType, setEventType] = useState<string>();

  const { currentUser } = useAuth();
  const location = useLocation();

  const getEvent = async () => {
    let event: Event = eventType === "user" ? await getUserEvent(id!) : await getTicketMasterEvent(id!);

    setPageEvent(event);

    if (currentUser) {
      if (
        event!.usersInterested.find((userID) => {
          return userID === currentUser.uid;
        })
      ) {
        setUserInEvent(true);
      } else {
        setUserInEvent(false);
      }
    }
  };

  const addNewComment = async () => {
    const newEvent = pageEvent;
    const date = new Date();

    const comment: Comment = {
      id: uuidv4(),
      date: date.getTime(),
      content: commentText,
      user: { id: currentUser.uid, displayName: currentUser.displayName, avatar: currentUser.photoURL },
    };
    pageEvent?.comments.push(comment);
    commentRef.current!.innerText = "";

    if (eventType === "user") {
      await editUserEvent(newEvent!);
    }
    if (eventType === "ticketmaster") {
      const userInfo = { comments: pageEvent!.comments, usersInterested: pageEvent!.usersInterested };

      await editTicketMasterComments(userInfo, id!);
    }

    getEvent();
  };

  const joinEvent = async () => {
    const newEvent: Event = pageEvent!;
    console.log(newEvent);
    const { uid, displayName, photoURL } = currentUser;

    const userIndex = newEvent.usersInterested.findIndex((userID) => {
      return userID === uid;
    });

    if (userIndex === -1) {
      const newUser: User = {
        id: uid,
        displayName,
        avatar: photoURL,
      };
      newEvent.usersInterested.push(newUser.id);
    } else {
      newEvent.usersInterested.splice(userIndex, 1);
    }

    if (eventType === "user") {
      await editUserEvent(newEvent);
    }
    if (eventType === "ticketmaster") {
      await editTicketMasterComments({ comment: newEvent.comments, usersInterested: newEvent.usersInterested }, id!);
    }

    getEvent();
  };

  useEffect(() => {
    if (location.pathname.includes("/event")) {
      setEventType("user");
    } else {
      setEventType("ticketmaster");
    }
  }, []);

  useEffect(() => {
    if (eventType) {
      getEvent();
    }
  }, [eventType]);

  if (!pageEvent) {
    <p>No Event Exists</p>;
  }
  return (
    pageEvent && (
      <Page>
        <Container>
          <h2>{pageEvent.eventName}</h2>
          {pageEvent.images && <img src={pageEvent.images[0]} />}
          <TextContainer>
            <span>Location: </span>
            <p>{pageEvent.eventLocation}</p>
            <span>Date: </span>
            {pageEvent.eventDate && <p>{pageEvent.eventDate}</p>}

            {pageEvent.category && (
              <>
                <span>Genres: </span>
                <p>{pageEvent.category?.main}</p>
                {pageEvent.category?.subcategories.map((genre) => {
                  return <p>#{genre.name}</p>;
                })}
              </>
            )}

            <span>Description: </span>

            {eventType === "user" ? (
              <p> {pageEvent.eventDescription} </p>
            ) : (
              <DescriptionDiv>
                <p>{pageEvent.eventDescription}</p>
                <a href={pageEvent.link} target="_blank">
                  Click Here to go to the TicketMaster page
                </a>
              </DescriptionDiv>
            )}

            <p>
              <span>User's Attending: </span>
              {pageEvent.usersInterested.length}
              {pageEvent.eventSize && `/${pageEvent.eventSize}`}
            </p>
          </TextContainer>
          {pageEvent.usersInterested.length > 0 && (
            <AttendanceDiv>
              {pageEvent.usersInterested.map((userID, i) => {
                return <UserCard userID={userID} />;
              })}
            </AttendanceDiv>
          )}

          {currentUser && <Button onClick={joinEvent}>{userInEvent ? "Leave Event" : "Join Event"}</Button>}
          <span>Comments:</span>

          <CommentContainer>
            {pageEvent.comments.length > 0 ? (
              pageEvent.comments.map((comment, i) => {
                return <CommentCard i={i} comment={comment} event={pageEvent} getEvent={getEvent} eventType={eventType!} />;
              })
            ) : (
              <div style={{ paddingBottom: "1rem" }}>
                <p>No Comments Yet</p>
                {currentUser && <p>Add One Below!</p>}
              </div>
            )}

            {currentUser && (
              <NewComment>
                <label>Add New Comment:</label>
                <div
                  ref={commentRef}
                  contentEditable="true"
                  onInput={(e) => {
                    setCommentText(e.currentTarget.textContent!);
                  }}
                ></div>
                <Button onClick={addNewComment}>Add Comment</Button>
              </NewComment>
            )}
          </CommentContainer>
        </Container>
      </Page>
    )
  );
}

export default EventPage;
