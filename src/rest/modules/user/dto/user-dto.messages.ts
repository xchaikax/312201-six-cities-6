export const UserDtoMessages = {
  name: {
    minLength: "Name must be at least 1 characters long",
    maxLength: "Name must be at most 15 characters long",
    invalidFormat: "Name is required",
  },
  email: {
    invalidFormat: "Email must be a valid email",
  },
  avatar: {
    invalidFormat: "Avatar must be a valid string",
  },
  password: {
    minLength: "Password must be at least 6 characters long",
    maxLength: "Password must be at most 12 characters long",
    invalidFormat: "Password is required",
  },
  userType: {
    invalidFormat: "User type must be a valid user type",
  },
} as const;
