import { useContext, useEffect, useState } from "react";

import { useAppSelector } from "../../store";
import { getCardSize, getWindowDimensions } from "./helpers";
import "./GameBoard.scss";
import GameCard from "./GameCard";
import { WebSocketContext } from "../WebsocketContext";

const preloadImage = (src: string) =>
  new Promise((r) => {
    const image = new Image();
    image.onload = r;
    image.onerror = r;
    image.src = src;
  });

function GameBoard() {
  const viewport = getWindowDimensions();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { current } = useAppSelector((state) => state.gamesReducer);
  const { id: userId } = useAppSelector((state) => state.profileReducer);
  const { selectCard, setGameStatusReady } = useContext(WebSocketContext);

  useEffect(() => {
    async function preloadImages(imageUrls: string[]) {
      await Promise.all(imageUrls?.map((x: string) => preloadImage(x)));
      setIsLoading(false);
      current?.id && setGameStatusReady(current.id);
    }

    if (current?.imageUrls && isLoading) {
      preloadImages(current.imageUrls);
    }
  }, [current?.imageUrls, current?.id, setGameStatusReady, isLoading]);

  const cardSize =
    (current && getCardSize(viewport, current?.gameBoard.length)) || 50;

  return (
    <div className="game">
      {current &&
        current.gameBoard.map((card) => (
          <GameCard
            key={card.key}
            card={card}
            cardSize={cardSize}
            onSelect={(key: number) => selectCard(current.id, key)}
            isGameBlocked={current.isGameBlocked || current.has_turn !== userId}
          />
        ))}
    </div>
  );
}

export default GameBoard;
