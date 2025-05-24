export const COLORS = {
  "primary-1": "#a8ff78",
  "primary-2": "#78ffd6",
  "primary-3": "#00e0b4",
  "primary-4": "#009f88",
  "active-yellow": "#FFEB3B",
  "active-dark-green": "#4fa94d",
  "calender-color-1": "#d9ffc3",
  income: "#4CAF50",
  expense: "#F44336",
  error: "#FF4D4D",
  disabled: "#ddd",
};

export const ACCOUNT_TYPES = [
  { label: "Debit", value: "debit" },
  { label: "Credit", value: "credit" },
  { label: "Cash", value: "cash" },
];

export const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export const ERRORS = {
  NOT_EMPTY: "Should not be empty",
  INVALID_EMAIL: "Please enter a valid email",
  SHORT_PASSWORD: "Password should be at least 6 characters long",
};

export const DAYS = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
  { label: "11", value: 11 },
  { label: "12", value: 12 },
  { label: "13", value: 13 },
  { label: "14", value: 14 },
  { label: "15", value: 15 },
  { label: "16", value: 16 },
  { label: "17", value: 17 },
  { label: "18", value: 18 },
  { label: "19", value: 19 },
  { label: "20", value: 20 },
  { label: "21", value: 21 },
  { label: "22", value: 22 },
  { label: "23", value: 23 },
  { label: "24", value: 24 },
  { label: "25", value: 25 },
  { label: "26", value: 26 },
  { label: "27", value: 27 },
  { label: "28", value: 28 },
  { label: "29", value: 29 },
  { label: "30", value: 30 },
];

export const CHART_COLORS = [
  "#FF0000", // Red
  "#00FF00", // Lime
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#008000", // Dark Green
  "#000080", // Navy
  "#FFC0CB", // Pink
  "#8B0000", // Dark Red
  "#B8860B", // Dark Goldenrod
  "#20B2AA", // Light Sea Green
  "#2E8B57", // Sea Green
  "#FF1493", // Deep Pink
  "#ADFF2F", // Green Yellow
  "#1E90FF", // Dodger Blue
  "#A52A2A", // Brown
  "#DC143C", // Crimson
];

//Functions

export const getMonth = (month: string) => MONTHS[Number(month)];

//CSS

export const STYLES = {
  SHADOW_1: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,

    // Elevation for Android
    elevation: 5,
  },
};
