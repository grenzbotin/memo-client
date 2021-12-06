import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store";
import { getCardSize, getWindowDimensions } from "../components/Game/helpers";
import "../components/Game/Game.scss";
import GameCard from "../components/Game/GameCard";
import { WebSocketContext } from "../components/WebsocketContext";
import { resetCurrentGame } from "../store/slices/games";
import ScoreHud from "../components/Game/ScoreHud";
import { GAME_FINISHED } from "../configs/game";
import Modal from "../components/Modal";

const preloadImage = (src: string) =>
  new Promise((r) => {
    const image = new Image();
    image.onload = r;
    image.onerror = r;
    image.src = src;
  });

function Game() {
  const viewport = getWindowDimensions();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  const handleReturnToLobby = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    dispatch(resetCurrentGame());
    navigate("/");
  };

  const renderModals = (
    <>
      {current?.status === GAME_FINISHED && (
        <Modal
          id="gameFinished"
          modalContent={<>{current.winner} won!</>}
          modalActions={{
            primary: {
              action: (e) => handleReturnToLobby(e),
              text: "Return to lobby",
            },
          }}
        />
      )}
      {current?.opponentLeft && (
        <Modal
          id="opponentLeft"
          modalContent={<>Your opponent left :(</>}
          modalActions={{
            primary: {
              action: (e) => handleReturnToLobby(e),
              text: "Back to lobby",
            },
          }}
        />
      )}
    </>
  );

  const cardSize =
    (current && getCardSize(viewport, current?.gameBoard.length)) || 50;
  const isWaiting = !current?.host.isReady || !current?.opponent.isReady;

  return (
    <>
      {renderModals}
      {current && (
        <ScoreHud
          host={current.host}
          opponent={current.opponent}
          hasTurn={current.has_turn}
          max={current.memoryPairs}
        />
      )}
      <main className="container-fluid game-wrapper">
        {current && (isLoading || isWaiting) && (
          <div className="loadingWrapper">
            <span aria-busy="true">
              {isLoading ? "Loading assets.." : "Waiting for opponent.."}
            </span>
          </div>
        )}
        {current && !isLoading && !isWaiting && (
          <div className="game">
            {current.gameBoard.map((card) => (
              <GameCard
                key={card.key}
                card={card}
                cardSize={cardSize}
                onSelect={(key: number) => selectCard(current.id, key)}
                isGameBlocked={
                  current.isGameBlocked || current.has_turn !== userId
                }
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default Game;
