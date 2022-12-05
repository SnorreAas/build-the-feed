export const getUserIdFromUrl = (pathName: string) =>
  pathName.split("/").filter(Boolean).pop();

export const getPostIdFromUrl = (pathName: string) =>
  pathName.split("/").filter(Boolean).pop();

export const formatDate = (dateString: string) => {
  const [day, month, year] = dateString.split("-") as any;
  return new Date(+year, month - 1, 0);
};
