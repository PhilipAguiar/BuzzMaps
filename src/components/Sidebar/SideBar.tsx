import styled from "styled-components/macro";
import { useState } from "react";
import ListVenueCard from "./ListVenueCard";
import CategoryDropdown from "./CategoryDropdown";
import ListEventCard from "./ListEventCard";
import { Event } from "../../types";

import { primaryColorDark, primaryColorLight } from "../../UI/colors";
import CloseButton from "./CloseButton";
import CategorySelect from "./CategorySelect";
import { useEventContext } from "../../contexts/EventContext";

const Bin = styled.div<{ $active: boolean }>`
  height: ${({ $active }) => ($active ? "auto" : "3rem")};
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #b5d9ff;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 4;
  transition: height 0.35s ease-out, width 0.35s ease-out;
  position: relative;

  @media (min-width: 786px) {
    flex-direction: row;
    height: ${({ $active }) => ($active ? "auto" : "100%")};
    width: ${({ $active }) => ($active ? "50%" : "4rem")};
  }
`;

const Container = styled.div<{ $active: boolean }>`
  height: ${({ $active }) => ($active ? "auto" : "2rem")};
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  border-right: 1px solid black;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 4;
  transition: height 0.35s ease-out, width 0.35s ease-out;
  position: relative;
  background: linear-gradient(to bottom, #00509d, #ffffff 180%);

  @media (min-width: 786px) {
    height: ${({ $active }) => ($active ? "auto" : "100%")};
    width: ${({ $active }) => ($active ? "100%" : "0")};
  }
`;

const ExpandedLegend = styled.div`
  display: flex;
  border-top: 1px solid rgb(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${primaryColorLight};
  flex-direction: column;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 0 0.6rem 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
  border: white 2px solid;
`;

const Select = styled.select`
  width: 100%;
  text-align: center;
  background-color: #003f88;
  color: white;
  font-weight: 800;
  outline: none;
  border: none;
  @media (min-width: 786px) {
    padding-right: 40px;
  }
`;

type Props = {
  legendActive: boolean;
  setLegendActive: React.Dispatch<React.SetStateAction<boolean>>;
};

function SideBar({ legendActive, setLegendActive }: Props) {
  const { filteredVenueList, legendFields } = useEventContext();
  const [activeFilter, setActiveFilter] = useState<string>("Venue");
  return (
    <>
      <Bin $active={legendActive}>
        <Container $active={legendActive}>
          {legendActive && (
            <>
              <CategorySelect setActiveFilter={setActiveFilter} activeFilter={activeFilter} />

              {activeFilter === "Category" && (
                <ExpandedLegend>
                  {/* <p>Select All</p> */}
                  {legendFields
                    .sort((a, b) => {
                      return a.main.localeCompare(b.main);
                    })
                    .map((category, index) => {
                      if (category.main) {
                        return <CategoryDropdown key={index} category={category} />;
                      }
                    })}
                </ExpandedLegend>
              )}
            </>
          )}

          {legendActive &&
            activeFilter === "Venue" &&
            filteredVenueList
              .sort((a, b) => {
                return a.name.localeCompare(b.name);
              })
              .map((venue, index) => {
                return <ListVenueCard setLegendActive={setLegendActive} key={index} venue={venue} />;
              })}

          {legendActive &&
            activeFilter === "Category" &&
            filteredVenueList
              .reduce((accumulator: Event[], venue) => {
                const eventList: Event[] = venue.venueEvents.filter((event: Event) => event.category?.active);

                eventList.forEach((event: Event) => {
                  // Check if the eventName already exists in the accumulator
                  const eventNameExists = accumulator.some(
                    (existingEvent: Event) => existingEvent.eventName === event.eventName && event.location !== existingEvent.location
                  );

                  // If the eventName does not exist, add the event to the accumulator
                  if (!eventNameExists) {
                    accumulator.push(event);
                  }
                });

                return accumulator;
              }, [])
              .sort((a, b) => {
                return a.eventName.localeCompare(b.eventName);
              })
              .map((event, index) => {
                // console.log(event);
                return <ListEventCard setLegendActive={setLegendActive} key={index} event={event} />;
              })}
        </Container>

        <CloseButton setLegendActive={setLegendActive} legendActive={legendActive} />
      </Bin>
    </>
  );
}
export default SideBar;
