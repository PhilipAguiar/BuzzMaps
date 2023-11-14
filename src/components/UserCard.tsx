import { useEffect, useState } from "react";
import { User } from "../types";
import { styled } from "styled-components/macro";
import { fetchUserAvatar, fetchUsername } from "../utils/UserList";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;

  img {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 20px;
    margin-bottom: 0.3rem;
  }
`;

type Props = {
  userID: string;
};

function UserCard({ userID }: Props) {
  const [username, setUsername] = useState<string>();
  const [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    const fetchUserinfo = async () => {
      setUsername(await fetchUsername(userID));
      setAvatar(await fetchUserAvatar(userID));
    };

    fetchUserinfo();
  }, [userID]);

  return (
    <Container>
      <img src={avatar} alt="" />
      <p>{username}</p>
    </Container>
  );
}

export default UserCard;
