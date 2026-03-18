const getWeekDays = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  // rewind to Monday of current week
  const monday = new Date(today);
  const diff = (today.getDay() + 6) % 7; // days since Monday
  monday.setDate(today.getDate() - diff);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      fullDate: date,
      isToday: date.toDateString() === today.toDateString(),
    };
  });
};

export const weekDays = getWeekDays();