// Object to keep track of the last displayed date
const lastDisplayed = {
  today: false,
  yesterday: false,
  day: null,
};

export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const options = { weekday: "long" };
  const dayOfWeek = date.toLocaleDateString("en-US", options);
  const formattedDate = date.toLocaleDateString("en-GB");

  // Get the current date without time
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Get the date of the message without time
  const messageDate = new Date(date);
  messageDate.setHours(0, 0, 0, 0);

  let result = "";

  if (diffInDays === 0) {
    // Today
    if (!lastDisplayed.today) {
      result = "Today";
      lastDisplayed.today = true;
      lastDisplayed.yesterday = false;
      lastDisplayed.day = null;
    }
  } else if (diffInDays === 1) {
    // Yesterday
    if (!lastDisplayed.yesterday) {
      result = "Yesterday";
      lastDisplayed.yesterday = true;
      lastDisplayed.today = false;
      lastDisplayed.day = null;
    }
  } else if (diffInDays > 1 && diffInDays <= 7) {
    // Day of the week
    if (lastDisplayed.day !== dayOfWeek) {
      result = dayOfWeek;
      lastDisplayed.day = dayOfWeek;
      lastDisplayed.today = false;
      lastDisplayed.yesterday = false;
    }
  } else {
    // Date
    result = formattedDate;
    lastDisplayed.today = false;
    lastDisplayed.yesterday = false;
    lastDisplayed.day = null;
  }

  return result;
};
