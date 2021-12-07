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
  const adaptedHeight = viewport.height - 120;
  const adaptedWidth = viewport.width - 40;

  const spacePerCard = (adaptedHeight * adaptedWidth) / cards;

  return Math.sqrt(spacePerCard) * 0.95;
};
