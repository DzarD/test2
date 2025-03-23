import { SessionSettings } from "./types";

export const DEFAULT_SESSION_SETTINGS: SessionSettings = {
  focus_time: 25,
  short_break: 5,
  long_break: 15,
  sections: 4,
};

export const SESSION_SETTINGS_RANGES = {
  focus_time: { min: 1, max: 90 },
  short_break: { min: 1, max: 30 },
  long_break: { min: 1, max: 60 },
  sections: { min: 2, max: 10 },
};

export const DefaultModeColors = {
  background: "#EAF8EF",
  text: "#333333",
  accent: "#9B59B6",
  border: "#DADADA",
};

export const DarkModeColors = {
  background: "#1B4332",
  text: "#E0E0E0",
  accent: "#8E44AD",
  border: "#424242",
};
