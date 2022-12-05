export const createPostIdFromTitle = (title: string) => {
  return title.split(" ").join("-").toLowerCase();
};

export const getReadingTime = (content: string) => {
  const wpm = 225;
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time.toString();
};

export const upgradeImageQuality = (photoURL: string | null) => {
  if (photoURL === null) return photoURL;
  const prefix = photoURL.split("=")[0];
  const qualityString = prefix + "=s720-c";
  return qualityString;
};

export const getCurrentDate = () => {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${day}-${month}-${year}`;
  return currentDate;
};
