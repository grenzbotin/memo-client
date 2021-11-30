// Game settings / config

export const GAME_SIZES = [18, 36, 72, 144, 288];
export const IMAGE_CATEGORIES = [
  "cat",
  "dog",
  "bunny",
  "duck",
  "fox",
  "lizard",
  "koala",
  "panda",
];

export const TIMING_UNTIL_FALSE_MATCH_RELEASE = [2, 5, 10];

export const defaultConfig = {
  size: 72,
  imageCategores: IMAGE_CATEGORIES,
  timeUntilRelease: 5,
};

// GAME STATI
export const GAME_ONGOING = "ongoing";
export const GAME_REQUESTED = "requested";
export const GAME_FINISHED = "finished";

export const ALPHA_PASSWORD = process.env.REACT_APP_ALPHA_PASSWORD;
export const USERNAME_MAX_LENGTH = 15;
export const USERNAME_REGEX = /^[A-Za-zÄÖÜäöüß0-9_-]*$/;
