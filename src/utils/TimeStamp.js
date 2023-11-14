const convertMilliseconds = (milliseconds) => {
  const today = new Date(milliseconds);
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const hour = today.getHours();
  const minute = today.getMinutes();
  const second = today.getSeconds();
  return `${month}/${day}/${year}/${hour}/${minute}/${second}`;
};

const timeSince = (commentTime) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentSecond = currentDate.getSeconds();
  const splitDate = commentTime.split("/").map((index) => parseInt(index));
  const commentYear = splitDate[2];
  const commentMonth = splitDate[0];
  const commentDay = splitDate[1];
  let commentHour;
  let commentMinute;
  let commentSecond;

  if (splitDate.length > 3) {
    commentHour = splitDate[3];
    commentMinute = splitDate[4];
    commentSecond = splitDate[5];
  }

  if (currentYear !== commentYear) {
    if (currentYear - commentYear === 1) {
      return `1 Year Ago`;
    }
    return `${currentYear - commentYear} Years Ago`;
  }
  if (currentMonth !== commentMonth) {
    if (currentYear - commentYear === 1) {
      return `1 Month Ago`;
    }
    return `${currentMonth - commentMonth} Months Ago`;
  }
  if (currentDay !== commentDay) {
    if (currentDay - commentDay === 1) {
      return `1 Day Ago`;
    }
    return `${currentDay - commentDay} Days Ago`;
  }
  if (currentHour !== commentHour) {
    if (currentHour - commentHour === 1) {
      return `1 Hour Ago`;
    }
    return `${currentHour - commentHour} Hours Ago`;
  }
  if (currentMinute !== commentMinute) {
    if (currentMinute - commentMinute === 1) {
      return `1 Minute Ago`;
    }
    return `${currentMinute - commentMinute} Minutes Ago`;
  }
  if (currentSecond !== commentSecond) {
    if (currentSecond - commentSecond === 1) {
      return `1 Second Ago`;
    }
    return `${currentSecond - commentSecond} Seconds ago`;
  }
  return `Just Now!`;
};

const timestampConverter = (timestamp) => {
  return timeSince(convertMilliseconds(timestamp));
};

export default timestampConverter;

export const formatDateToSentence = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const dayOfWeek = date.toLocaleString("default", { weekday: "long" });

  const sentence = `${dayOfWeek}, ${month} ${day}, ${year}`;

  return sentence;
};
