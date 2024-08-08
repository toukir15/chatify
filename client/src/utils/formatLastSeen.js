export const formatLastSeen = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // If the difference is more than 7 days, return null
  if (diffInDays > 7) {
    return null;
  }

  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const timeString = date.toLocaleString("en-US", options);

  if (diffInDays === 0) {
    return `last seen today at ${timeString}`;
  } else if (diffInDays === 1) {
    return `last seen yesterday at ${timeString}`;
  } else {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    return `last seen ${dayOfWeek} at ${timeString}`;
  }
};
