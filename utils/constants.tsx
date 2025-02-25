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
