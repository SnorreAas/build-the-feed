export const isLoggedInUserProfile = (
  userId: string | undefined,
  idToCheck: string
) => {
  if (userId) {
    return userId === idToCheck;
  }
  return false;
};
