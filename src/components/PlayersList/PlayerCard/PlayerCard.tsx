import { useContext, useEffect, useState } from "react";
import { XIcon } from "@primer/octicons-react";

import {
  defaultConfig,
  GAME_SIZES,
  IMAGE_CATEGORIES,
  TIMING_UNTIL_FALSE_MATCH_RELEASE,
} from "../../../configs/game";
import { useAppSelector } from "../../../store";
import { WebSocketContext } from "../../WebsocketContext";
import { TPlayerPayload } from "../../../store/slices/players";
import "./PlayerCard.scss";
import Modal from "../../Modal";

function PlayerCard({
  player,
  isClickable,
}: {
  player: TPlayerPayload;
  isClickable: boolean;
}) {
  const { inviteSend } = useAppSelector((state) => state.gamesReducer);
  const { getPlayers, requestGame, cancelGameRequest } =
    useContext(WebSocketContext);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<string>(
    defaultConfig.size.toString()
  );
  const [imageCategories, setImageCategories] = useState<string[]>(
    defaultConfig.imageCategores
  );
  const [timeUntilRelease, setTimeUntilRelease] = useState<string>(
    defaultConfig.timeUntilRelease.toString()
  );

  // initialize get players request
  useEffect(() => {
    getPlayers();
  }, [getPlayers]);

  const handleCancelGameRequest = (
    e: React.MouseEvent<HTMLElement>,
    gameId: string
  ) => {
    e.stopPropagation();
    cancelGameRequest(gameId);
  };

  const handleSendRequest = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (!player.is_playing) {
      // currently only 1 invite per sender possible
      if (inviteSend) {
        cancelGameRequest(inviteSend.gameId);
      }
      requestGame({
        options: {
          fields: parseInt(boardSize, 10),
          imageCategories,
          timeUntilRelease: parseInt(timeUntilRelease, 10),
        },
        opponentId: player.id,
      });
    }

    setShowModal(false);
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target) {
      setImageCategories(
        imageCategories.includes(e.target.value)
          ? imageCategories.filter((item) => item !== e.target.value)
          : [...imageCategories, e.target.value]
      );
    }
  };

  return (
    <>
      {/* OptionsModal */}
      {showModal && (
        <Modal
          id="createGame"
          modalContent={
            <>
              <label htmlFor="game-options">
                Select the size of your board
              </label>
              <select
                name="boardSize"
                id="boardSize"
                value={boardSize}
                onChange={(e) => setBoardSize(e.target.value)}
              >
                {GAME_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size / 2} pairs
                  </option>
                ))}
              </select>
              <label htmlFor="game-options">
                Time until a false pair is turned again (in seconds):
              </label>
              <select
                name="timeUntilRelease"
                id="timeUntilRelease"
                value={timeUntilRelease}
                onChange={(e) => setTimeUntilRelease(e.target.value)}
              >
                {TIMING_UNTIL_FALSE_MATCH_RELEASE.map((time) => (
                  <option key={time} value={time}>
                    {time}s
                  </option>
                ))}
              </select>

              <legend>Please select the image categories for your game:</legend>
              {IMAGE_CATEGORIES.map((item) => (
                <div key={item} className="image_checkbox">
                  <input
                    type="checkbox"
                    name="image_categories"
                    value={item}
                    onChange={handleSelectionChange}
                    checked={imageCategories.includes(item)}
                  />
                  {item}{" "}
                </div>
              ))}
            </>
          }
          modalActions={{
            secondary: {
              action: () => setShowModal(false),
              text: "Close",
            },
            primary: {
              action: (e) => handleSendRequest(e),
              text: "Ask for match",
              disabled: !imageCategories.length,
            },
          }}
        />
      )}
      {/* PlayerCard */}
      <article
        className={`playerslist__card ${isClickable && "active"}`}
        tabIndex={isClickable ? 0 : undefined}
        onClick={() => isClickable && setShowModal(true)}
        onKeyDown={(e) =>
          isClickable && e.key === "Enter" && setShowModal(true)
        }
      >
        {player.is_playing && <div className="label isPlaying">In game</div>}
        {inviteSend?.opponentId === player.id && (
          <div className="label">
            {!inviteSend.success && !inviteSend.error && (
              <>
                Sending.. <span aria-busy="true" />
              </>
            )}
            {!inviteSend.success && inviteSend.error && (
              <>
                Error{" "}
                <button
                  className="contrast outline"
                  onClick={(e) => handleCancelGameRequest(e, inviteSend.gameId)}
                >
                  <XIcon verticalAlign="middle" size={16} />
                </button>
              </>
            )}
            {inviteSend.success && (
              <>
                Request sent
                <button
                  className="contrast outline"
                  onClick={(e) => handleCancelGameRequest(e, inviteSend.gameId)}
                >
                  <XIcon verticalAlign="middle" size={16} />
                </button>
              </>
            )}
          </div>
        )}
        <img
          alt={player.avatar}
          height={64}
          width={64}
          src={require(`../../../assets/avatars/${player.avatar}.png`).default}
        />
        <p>{player.name}</p>
        <footer>
          Played: {player.played} | Won: {player.won} | Draw: {player.draw}
        </footer>
      </article>
    </>
  );
}

export default PlayerCard;
