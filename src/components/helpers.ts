export const getUserIdFromUrl = (pathName: string) =>
  pathName.split("/").filter(Boolean).pop();

export const getPostIdFromUrl = (pathName: string) =>
  pathName.split("/").filter(Boolean).pop();
