export const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const getCardSize = (
  viewport: { width: number; height: number },
  cards: number
) => {
  const spacePerCard =
    ((viewport.width - 40) * (viewport.height - 140)) / cards;

  return Math.sqrt(spacePerCard);
};
