export const OfferDtoMessages = {
  title: {
    minLength: "Title must be longer than or equal to $constraint1 characters",
    maxLength: "Title must be shorter than or equal to $constraint1 characters",
    invalidFormat: "Title is required",
  },
  description: {
    minLength: "Description must be longer than or equal to $constraint1 characters",
    maxLength: "Description must be shorter than or equal to $constraint1 characters",
    invalidFormat: "Description is required",
  },
  createdDate: {
    invalidFormat: "Created date must be a valid date",
  },
  city: {
    invalidFormat: "City must be a valid city",
  },
  previewImage: {
    invalidFormat: "Preview image must be a valid string",
  },
  images: {
    invalidFormat: "Images must be a valid array of strings",
  },
  isPremium: {
    invalidFormat: "Is premium must be a valid boolean",
  },
  propertyType: {
    invalidFormat: "Property type must be a valid property type",
  },
  roomsNumber: {
    min: "Rooms number must be at least 1",
    max: "Rooms number must be at most 8",
    invalidFormat: "Rooms number must be a valid number",
  },
  guestsNumber: {
    min: "Guests number must be at least 1",
    max: "Guests number must be at most 10",
    invalidFormat: "Guests number must be a valid number",
  },
  price: {
    min: "Price must be at least 100",
    max: "Price must be at most 100000",
    invalidFormat: "Price must be a valid number",
  },
  facilities: {
    invalidFormat: "Facilities must be a valid array of facilities",
    each: "Each facility must be a valid facility",
  },
  authorId: {
    invalidFormat: "Author ID must be a valid ID",
  },
  coordinates: {
    latitude: {
      invalidFormat: "Latitude must be a valid latitude",
    },
    longitude: {
      invalidFormat: "Longitude must be a valid longitude",
    },
  },
} as const;
