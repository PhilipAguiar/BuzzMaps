import { useEffect, useState } from "react";
import { styled } from "styled-components";
import loadingGif from "../assets/loading.gif";

const Container = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: rgb(255, 255, 255, 0.25);
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    font-size: 2rem;
    font-weight: 700;
  }
`;

const Image = styled.img`
  height: 10rem;
`;
function Loading() {
  const [loadingIndex, setLoadingIndex] = useState(0);
  const loadingTexts = ["Loading.", "Loading..", "Loading..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex((prevState) => (prevState + 1) % loadingTexts.length);
    }, 750); // Change text every 0.5 seconds

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, []);

  return (
    <Container>
      <Image src={loadingGif} />
      <p>{loadingTexts[loadingIndex]}</p>
    </Container>
  );
}
export default Loading;
