export const CommentDtoMessages = {
  text: {
    minLength: "Comment must be at least 5 characters long",
    maxLength: "Comment must be at most 1024 characters long",
  },
  rating: {
    min: "Rating must be at least 1",
    max: "Rating must be at most 5",
  },
  authorId: {
    invalidFormat: "Author ID must be a valid ID",
  },
} as const;
