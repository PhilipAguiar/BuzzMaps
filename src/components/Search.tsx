import { useState } from "react";
import Location from "../assets/location.svg";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { styled } from "styled-components/macro";
import { primaryColorDark, primaryColorLight } from "../UI/colors";
import { device } from "../UI/MediaQueries";
import { useEventContext } from "../contexts/EventContext";
import Tooltip from "../UI/Tooltip";

type Props = {
  setCenter: Function;
  eventFormActive: boolean;
};

const Container = styled.div<{ $active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${primaryColorDark};
  opacity: ${({ $active }) => ($active ? 0 : 1)};
  width: 50%;
  transition: opacity 0.3s;
  @media ${device.tablet} {
    max-width: 300px;
  }

  @media ${device.desktop} {
    max-width: 500px;
  }
`;

const Options = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: white;
  width: 100%;
  justify-self: center;
  z-index: 5;
  input {
    outline: none;
    padding-left: 0.4rem;
    height: 2.5rem;
    background-color: #003f88;
    border: none;
    border: 1px solid rgb(255, 255, 255, 0.3);
    border-top: none;
    border-right: none;
    border-left: none;
    color: white;

    background-color: 00296b;

    &::placeholder {
      color: white;
    }
  }
`;

const SearchItems = styled.div`
  position: fixed;
  top: 0;
  margin-top: 2.8rem;
  width: 50%;

  z-index: 4;
  opacity: 0.95;

  @media ${device.tablet} {
    max-width: 300px;
  }

  @media ${device.desktop} {
    max-width: 500px;
  }

  p {
    cursor: pointer;
    border-bottom: 1px solid white;
    padding: 0.4rem 1rem;
    background-color: ${primaryColorLight};
    z-index: 4;
    opacity: 1;
    box-shadow: ${primaryColorDark} 0px 2px 5px -1px, ${primaryColorDark} 0px 1px 3px -1px;

    &:hover {
      opacity: 1;
      box-shadow: none;
    }

    &:last-child {
      border-bottom: none;
      box-shadow: ${primaryColorDark} 0px 5px 15px;
    }
  }
`;

const PinIcon = styled.img`
  cursor: pointer;
  width: 30px;
  height: 30px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  /* Add any other necessary styles for your navigation icon */

  &:hover {
    /* Random sophisticated hover effect */
    transform: rotate(360deg);
    transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
`;

function Search({ setCenter, eventFormActive }: Props) {
  const { center } = useEventContext();

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
    },
  });

  var ignoreClickOnMeElement = document.getElementById("test");

  document.addEventListener("click", function (event: any) {
    var isClickInsideElement = ignoreClickOnMeElement?.contains(event.target);
    if (!isClickInsideElement) {
      setSearchText("");
    }
  });

  return (
    <Container $active={eventFormActive}>
      <Options id="test">
        <input
          type="text"
          onChange={(e: any) => {
            setValue(e.target.value);
            setSearchText(e.target.value);
          }}
          autoComplete={"off"}
          id="search"
          placeholder="Search Location"
        />
        {data && searchText !== "" && (
          <SearchItems>
            {data.map((selection, i) => {
              return (
                <p
                  key={i}
                  onClick={async (e: any) => {
                    try {
                      const results = await getGeocode({ address: e.target.innerHTML });
                      const { lat, lng } = await getLatLng(results[0]);
                      setCenter({ lat, lng });
                      setValue("");
                      const input = document.getElementById("search") as HTMLInputElement | null;

                      input!.value = e.target.innerHTML;
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  {selection.description}
                </p>
              );
            })}
          </SearchItems>
        )}
      </Options>
      {/* <Autocomplete
        noOptionsText="Search a Location"
        disablePortal
        clearOnBlur
        onSelect={async (e: any) => {
          try {
            const results = await getGeocode({ address: e.target.value });
            const { lat, lng } = await getLatLng(results[0]);
            setCenter({ lat, lng });
          } catch (error) {
            console.log(error);
          }
        }}
        id="combo-box-demo"
        options={data.map((selection) => {
          return selection.description;
        })}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search location"
            onChange={(e: any) => {
              setValue(e.target.value);
            }}
          />
        )}
      /> */}
      <Tooltip text="Search near you!">
        <PinIcon
          src={Location}
          onClick={() => {
            navigator.geolocation.getCurrentPosition((position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              localStorage.setItem("lat", JSON.stringify(lat));
              localStorage.setItem("lng", JSON.stringify(lng));
              setCenter({ lat, lng });
            });
          }}
        />
      </Tooltip>
    </Container>
  );
}

export default Search;
