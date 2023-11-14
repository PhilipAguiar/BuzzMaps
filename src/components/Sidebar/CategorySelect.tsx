import { styled } from "styled-components";
import { primaryColorDark, primaryColorLight } from "../../UI/colors";

import filter from '../../assets/icons/filter.svg'
import categoryicon from '../../assets/icons/category-tune.svg'

const FilterLegend = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  width: 100%;
  text-align: center;
  justify-content: space-evenly;
  align-items: center;
  background-color: #003f88;
  margin-bottom: 0.5rem;
  color: #f8f8f8;
  font-weight: 600;
  border-radius: 10px; /* Add the border-radius property here */
  z-index: 1;
  @media (min-width: 786px) {
  }
`;
interface FilterOptionProps {
  active?: boolean; // Make 'active' prop optional and of type boolean
}

const FilterOption = styled.div<{ $active: boolean }>`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border: ${({ $active }) => $active ? 'solid 1px white' : `solid 1px ${primaryColorLight}`};
  border-bottom: ${({ $active }) => $active ? 'solid 1px white' : `solid 1px white`};
  height: 2.5rem;
  background:  ${primaryColorLight};
`;
const FilterBin = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  width: 100%;
`
const Icon = styled.img`
  width: 30px;
  height: 30px;
  padding: 5px;
`

type Props = {
  activeFilter: string;
  setActiveFilter: Function;
};

function CategorySelect({ activeFilter, setActiveFilter }: Props) {
  return (
    <>
      <FilterLegend>
        <FilterBin>
         
          <FilterOption $active={activeFilter === "Venue"} onClick={(e: any) => setActiveFilter("Venue")}> <Icon src={filter} alt="filter icon" />
            Venue
          </FilterOption>
        </FilterBin>
        <FilterOption $active={activeFilter === "Category"} onClick={(e: any) => setActiveFilter("Category")}> <Icon src={categoryicon} alt="filter icon" />
          Category
        </FilterOption>
      </FilterLegend>
    </>
  );
}
export default CategorySelect;
