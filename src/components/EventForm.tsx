import React, { useRef } from "react";
import { Event } from "../types";
import { v4 as uuidv4 } from "uuid";
import { addUserEvent } from "../utils/EventApiUtils";
import Icons from "../icons/icons";
import { styled } from "styled-components/macro";
import { secondaryColorLight, tertiaryColorLight } from "../UI/colors";
import { device } from "../UI/MediaQueries";
import { ButtonStyling } from "../UI/Button";
import SearchPrompt from "./SearchPrompt";
import { useEventContext } from "../contexts/EventContext";

const Container = styled.div<{ $active: boolean }>`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  z-index: 1;
  border-left: 6px solid ${secondaryColorLight};
  border-top: 6px solid ${secondaryColorLight};
  border-right: 6px solid ${secondaryColorLight};
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  padding: 1rem;
  overflow-y: scroll;
  animation: menu-slide-mobile 1s;
  height: ${({ $active }) => ($active ? "100%" : "0")};

  @media ${device.tablet} {
    animation: menu-slide 0.5s;
    width: ${({ $active }) => ($active ? "40%" : "0")};
    padding: 0 1rem;
    border-top: 4px solid ${secondaryColorLight};
    border-bottom: 4px solid ${secondaryColorLight};
    border-right: none;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;

  p {
    padding-bottom: 4px;
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;

  label {
    padding-bottom: 4px;
  }

  input {
    height: 2rem;
    padding-left: 0.3rem;
    border: 2px solid ${tertiaryColorLight};
    border-radius: 4px;
    resize: none;
  }

  textarea {
    height: 4rem;
    padding-top: 0.3rem;
    padding-left: 0.3rem;
    border: 2px solid ${tertiaryColorLight};
    border-radius: 4px;
    resize: none;
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgb(233, 233, 233);
  border-radius: 20px;
  height: 20%;
  min-height: 4rem;
  overflow-y: scroll;
  border: 2px solid ${tertiaryColorLight};
`;

const Icon = styled.img<{ active: boolean }>`
  height: 3rem;
  margin: 0.25rem;
  padding: 0.25rem;
  cursor: pointer;
  ${({ active }) => active && "background-color: white;"}
`;

const Button = styled.button`
  ${ButtonStyling}
  height: 10%;
  margin: 2rem 0;
`;

type Props = {
  setNewEvent: Function;
  newEvent: Event | undefined;
  setEventFormActive: Function;
};

function EventForm({ setNewEvent, newEvent, setEventFormActive }: Props) {
  const eventNameRef = useRef<HTMLInputElement | null>(null);
  const eventDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const eventDateRef = useRef<HTMLInputElement | null>(null);
  const eventLocationRef = useRef<HTMLInputElement | null>(null);
  const eventSizeRef = useRef<HTMLInputElement | null>(null);

  const { setUserEventsList } = useEventContext();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const event: Event = {
      id: uuidv4(),
      location: newEvent!.location,
      icon: newEvent!.icon,
      eventName: eventNameRef.current!.value,
      eventDescription: eventDescriptionRef.current!.value,
      eventDate: new Date(eventDateRef.current!.value).toISOString().split("T")[0],
      eventLocation: eventLocationRef.current!.value,
      userSubmitted: "currentUser.displayName",
      userAvatar: "userPhoto",
      eventSize: Number(eventSizeRef.current!.value),
      usersInterested: [],
      comments: [],
    };

    await addUserEvent(event);
    setUserEventsList((prevList) => [...prevList, event]);
    setNewEvent(null);
    setEventFormActive(false);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "eventDate") {
      const date = new Date(eventDateRef.current!.value).toISOString().split("T")[0];

      setNewEvent((prevEvent: Event) => ({ ...prevEvent, eventDate: date }));
    } else {
      setNewEvent((prevEvent: Event) => ({ ...prevEvent, [name]: value }));
    }
  };

  const selectIcon = (icon: string) => {
    console.log(icon);
    if (newEvent?.location) {
      setNewEvent((prevEvent: Event) => ({ ...prevEvent, icon: icon }));
    }
  };

  if (newEvent?.location) {
    return (
      <Container $active={newEvent?.location ? true : false}>
        <Form
          onSubmit={(e: any) => {
            submitHandler(e);
          }}
        >
          <InputWrapper>
            <InputSection>
              <label>What's Happening</label>
              <input
                ref={eventNameRef}
                name="eventName"
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                autoComplete="off"
                required
              />
            </InputSection>

            <InputSection>
              <label>Event Location</label>
              <input
                ref={eventLocationRef}
                name="eventLocation"
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                autoComplete="off"
                value={newEvent.eventLocation}
                required
              />
            </InputSection>

            <InputSection>
              <label>When</label>
              <input
                ref={eventDateRef}
                type="date"
                name="eventDate"
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                autoComplete="off"
                required
              />
            </InputSection>

            <InputSection>
              <label>Description</label>
              <textarea
                ref={eventDescriptionRef}
                name="eventDescription"
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                autoComplete="off"
                required
              />
            </InputSection>

            <InputSection>
              <label>How many people?</label>
              <input
                ref={eventSizeRef}
                type="number"
                min="1"
                name="eventSize"
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                autoComplete="off"
                required
              />
            </InputSection>
          </InputWrapper>
          <p>Choose an icon</p>

          <IconContainer>
            {Icons.map((icon) => {
              return (
                <Icon
                  active={icon.image === newEvent.icon}
                  src={icon.image}
                  alt={icon.name}
                  onClick={() => {
                    selectIcon(icon.image);
                  }}
                />
              );
            })}
          </IconContainer>
          <Button>Upload Event</Button>
        </Form>
      </Container>
    );
  } else {
    return <SearchPrompt setNewEvent={setNewEvent} />;
  }
}

export default EventForm;
