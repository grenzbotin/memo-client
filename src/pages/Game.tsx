import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";

import "../components/GameBoard/GameBoard.scss";
import { WebSocketContext } from "../components/WebsocketContext";
import ScoreHud from "../components/GameBoard/ScoreHud";
import Modal from "../components/Modal";
import GameBoard from "../components/GameBoard";
import { GAME_FINISHED } from "../configs/game";
import { resetCurrentGame } from "../store/slices/games";
import { useAppDispatch, useAppSelector } from "../store";

const preloadImage = (src: string) =>
  new Promise((r) => {
    const image = new Image();
    image.onload = r;
    image.onerror = r;
    image.src = src;
  });

function Game() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { current } = useAppSelector((state) => state.gamesReducer);
  const { setGameStatusReady } = useContext(WebSocketContext);

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

  if (current?.status === GAME_FINISHED) {
    return (
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
    );
  }

  if (current?.opponentLeft) {
    return (
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
    );
  }

  const isWaiting = !current?.host.isReady || !current?.opponent.isReady;

  return (
    <>
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
        {current && !isLoading && !isWaiting && <GameBoard />}
      </main>
    </>
  );
}

export default Game;
