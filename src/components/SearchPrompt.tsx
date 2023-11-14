import { useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { EventContext, useEventContext } from "../contexts/EventContext";
import { styled } from "styled-components/macro";
import { primaryColorDark, primaryColorLight, secondaryColorLight } from "../UI/colors";
import { device } from "../UI/MediaQueries";

type Props = {
  setNewEvent: Function;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  border: 3px solid ${primaryColorLight};
  padding: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  bottom: 17%;
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white;
  background-color: rgb(255, 255, 255, 0.6);
  font-size: 1.5rem;
  font-weight: 500;
  color: ${secondaryColorLight};

  @media ${device.tablet} {
    font-size: 2rem;
  }

  h2 {
    text-align: center;
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }
`;

const Option = styled.p`
  /* border: solid 1px ${primaryColorDark}; */
  padding: 0.3rem;
  cursor: pointer;
  &:hover {
    background-color: rgb(255, 255, 255, 0.6);
  }
`;

const Input = styled.input`
  width: 83%;
  padding: 1rem 1.5rem;
  border: 2px solid ${primaryColorDark};
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${primaryColorLight};
    box-shadow: 0 0 5px ${primaryColorLight};
  }

  &::placeholder {
    color: #aaa;
  }
`;

function SearchPrompt({ setNewEvent }: Props) {
  const { center, setCenter } = useEventContext();
  const [searchText, setSearchText] = useState<string>("");

  const position = new google.maps.LatLng(center!);
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: position,
      radius: 200 * 1000,
      // types: ["establishment"],
    },
  });

  return (
    <Container>
      <h2>Click a location on the map or search a location below to get started!</h2>
      <Input
        type="text"
        onChange={(e: any) => {
          setValue(e.target.value);
          setSearchText(e.target.value);
        }}
        id="SearchPrompt"
        placeholder="Search Location"
      />
      <div>
        {data &&
          searchText !== "" &&
          data.map((selection, i) => {
            return (
              <Option
                key={i}
                onClick={async (e: any) => {
                  try {
                    const results = await getGeocode({ address: e.target.innerHTML });
                    const { lat, lng } = await getLatLng(results[0]);
                    setCenter({ lat, lng });
                    setValue("");
                    const input = document.getElementById("SearchPrompt") as HTMLInputElement | null;
                    setNewEvent({
                      location: {
                        lat: lat,
                        lng: lng,
                      },
                      eventLocation: e.target.innerHTML,
                    });
                    input!.value = e.target.innerHTML;
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                {selection.description}
              </Option>
            );
          })}
      </div>
    </Container>
  );
}
export default SearchPrompt;
