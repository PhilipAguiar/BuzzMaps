import { Category, Event, Venue } from "../types";

export const isMainCategoryInLegend = (category: Category, legendFields: Array<Category>) => {
  let output = false;
  legendFields.some((legendCategory) => {
    if (category.main === legendCategory.main) {
      output = true;
    }
  });
  return output;
};

export const isMainCategoryActive = (category: Category, legendFields: Array<Category>) => {
  let output = false;

  const test = legendFields.find((legendCategory) => {
    return category.main === legendCategory.main;
  });

  if (test && test.active === true) {
    output = true;
  }
  return output;
};

export const isSubcategoryInLegend = (subcategory: string, legendFields: Array<Category>) => {
  let output = false;

  legendFields.forEach((category) => {
    category.subcategories.some((legendSubcategory) => {
      if (legendSubcategory.name === subcategory) {
        output = true;
      }
    });
  });
  return output;
};

export const filterVenues = (venueList: Venue[], legendFields: Category[]): Venue[] => {
  const newVenueList: Venue[] = [];

  venueList.forEach((venue) => {
    console.log(venue);
    const newVenue = { ...venue };
    const shouldAddVenue = venue.categories?.some((category) => {
      if (isMainCategoryInLegend(category, legendFields) && isMainCategoryActive(category, legendFields)) {
        const newVenueEvents: Event[] = venue.venueEvents.filter((event) => {
          return event.category?.subcategories.some((subcategory) => {
            return isSubcategoryInLegend(subcategory.name, legendFields) && isMainCategoryActive(event.category!, legendFields);
          });
        });

        newVenue.venueEvents = newVenueEvents;
        return newVenueEvents.length > 0;
      }
      return false;
    });

    if (shouldAddVenue) {
      newVenueList.push(newVenue);
    }
  });

  return newVenueList;
};

// export const filterVenues = (venueList: Array<Venue>, legendFields: Array<Category>) => {
//   const newVenueList: Array<Venue> = [];

//   venueList.forEach((venue) => {
//     const newVenue = venue;

//     venue.categories!.forEach((category) => {

//       if (legendFields.includes(category)) {
//         const newVenueEvents: Array<Event> = [];

//         venue.venueEvents.forEach((event: Event) => {
//           if (legendFields.includes(event.category!.main)) {
//             newVenueEvents.push(event);
//           } else if (
//             event.category?.subcategories.some((category) => {
//               return legendFields.includes(category);
//             })
//           ) {
//             newVenueEvents.push(event);
//           }
//         });

//         if (
//           !newVenueList.some((venue) => {
//             return venue.id === newVenue.id;
//           })
//         ) {
//           newVenue.venueEvents = newVenueEvents;
//           newVenueList.push(newVenue);
//         }
//       }
//     });
//   });
//   return newVenueList;
// };
