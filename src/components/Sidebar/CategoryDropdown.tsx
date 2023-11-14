import { styled } from "styled-components/macro";
import { Category } from "../../types";
import { useState, useRef } from "react"; // Add useState and useRef imports
import { useEventContext } from "../../contexts/EventContext";

type Props = {
  category: Category;
};

const Container = styled.div`
  cursor: pointer;
  width: 100%;
  color: black;
  font-weight: 600;
  text-align: center;
  color: white;
  font-family: Poppins;
  border-bottom: 1px solid white;

  &:last-of-type {
    border-bottom: none;
  }

  label {
    cursor: pointer;
    margin-right: 4px;
  }
  overflow-y: hidden;

  input {
    cursor: pointer;
  }
`;

const ArrowIcon = styled.p<{ $expanded: boolean }>`
  font-size: 0.8rem;
  transition: transform 0.3s ease-in-out;
  transform-origin: center;
  width: fit-content;
  transform: ${({ $expanded }) => ($expanded ? "rotate(180deg)" : "rotate(0deg)")};
  margin-left: 0.2rem;
  &:first-of-type {
    transform: ${({ $expanded }) => ($expanded ? "rotate(-180deg)" : "rotate(0deg)")};
    margin-right: 0.2rem;
  }
  z-index: 0;
`;

const CategoryDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  border-radius: 8px;
  background-color: #00509d;

  &:hover {
    background-color: #054690;
  }
  span {
    padding-right: 5px;
  }
`;

const SubCategories = styled.div<{ $expanded: boolean }>`
  max-height: ${(props) => (props.$expanded ? "1000px" : "0")};
  display: flex;
  flex-direction: column;
  transition: max-height 1s, box-shadow 1s;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.6);
    pointer-events: none; /* Prevent the pseudo-element from capturing mouse events */
  }
`;

const SubCategory = styled.div`
  padding: 0.7rem 0;
  background-color: #0264bf;
  border-top: 1px solid lightgray;

  &:hover {
    background-color: #0069cb;
  }
`;

function CategoryDropdown({ category }: Props) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { legendFields, setLegendFields } = useEventContext();

  const handleCategoryCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategories = [...category.subcategories];
    newCategories.forEach((subCategory) => (subCategory.active = e.target.checked));

    const newLegendFields = legendFields.map((searchedCategory) => {
      if (searchedCategory.main === category.main) {
        searchedCategory.active = e.target.checked;
        searchedCategory.subcategories = newCategories;
      }
      return searchedCategory;
    });
    setLegendFields(newLegendFields);
  };

  return (
    <Container>
      <CategoryDiv
        onClick={() => {
          setExpanded((prevValue) => !prevValue);
        }}
      >
        <ArrowIcon $expanded={expanded}>▼</ArrowIcon> <span>{category.main}</span>
        <input type="checkbox" checked={category.active} onChange={handleCategoryCheckboxChange} />
        <ArrowIcon $expanded={expanded}>▼</ArrowIcon>
      </CategoryDiv>

      <SubCategories $expanded={expanded} ref={contentRef}>
        {category.subcategories
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((subcategory, index) => {
            return (
              <SubCategory
                key={index}
                onClick={() => {
                  const newCategories = [...category.subcategories];
                  newCategories[index].active = !newCategories[index].active;

                  const newLegendFields = legendFields.map((searchedCategory) => {
                    if (searchedCategory.main === category.main) {
                      if (newCategories[index].active) {
                        searchedCategory.active = true;
                      } else {
                        const allSubCategoriesUnchecked = newCategories.every((subCategory) => !subCategory.active);
                        if (allSubCategoriesUnchecked) {
                          searchedCategory.active = false;
                        }
                      }
                      searchedCategory.subcategories = newCategories;
                    }
                    return searchedCategory;
                  });
                  setLegendFields(newLegendFields);
                }}
              >
                <label>{subcategory.name}</label>
                <input
                  type="checkbox"
                  checked={subcategory.active}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newCategories = [...category.subcategories];
                    newCategories[index].active = e.target.checked;

                    const newLegendFields = legendFields.map((searchedCategory) => {
                      if (searchedCategory.main === category.main) {
                        if (e.target.checked) {
                          searchedCategory.active = true;
                        } else {
                          const allSubCategoriesUnchecked = newCategories.every((subCategory) => !subCategory.active);
                          if (allSubCategoriesUnchecked) {
                            searchedCategory.active = false;
                          }
                        }
                        searchedCategory.subcategories = newCategories;
                      }
                      return searchedCategory;
                    });
                    setLegendFields(newLegendFields);
                  }}
                ></input>
              </SubCategory>
            );
          })}
      </SubCategories>
    </Container>
  );
}

export default CategoryDropdown;
