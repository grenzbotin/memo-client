import { Fragment, useContext, useEffect } from "react";

import { useAppSelector } from "../../store";
import { WebSocketContext } from "../WebsocketContext";
import { chunkArray } from "./helpers";
import PlayerCard from "./PlayerCard";

const CHUNK_LENGTH = 4;

function PlayersList() {
  const { players } = useAppSelector((state) => state.playersReducer);
  const { inviteSend } = useAppSelector((state) => state.gamesReducer);
  const { getPlayers } = useContext(WebSocketContext);

  // initialize get players request
  useEffect(() => {
    getPlayers();
  }, [getPlayers]);

  const playerChunks = chunkArray(players, CHUNK_LENGTH);

  return (
    <main className="container">
      <hgroup>
        <h1>
          {players.length} {players.length === 1 ? "player" : "players"} online
        </h1>
        <h2>Click on a player card to ask for a match.</h2>
      </hgroup>
      {playerChunks.length > 0
        ? playerChunks.map((chunk, key) => (
            <div key={`chunk-${key}`} className="grid">
              {chunk.map((player, cKey) => {
                const isClickable =
                  !player.is_playing && inviteSend?.opponentId !== player.id;

                return (
                  <Fragment key={`player-${player.name}`}>
                    <PlayerCard player={player} isClickable={isClickable} />
                    {/* Add empty divs for colspan */}
                    {playerChunks.length - 1 === key &&
                      chunk.length < CHUNK_LENGTH &&
                      cKey === chunk.length - 1 &&
                      Array(CHUNK_LENGTH - chunk.length)
                        .fill(1)
                        .map((_, emptyKey) => (
                          <div key={`empty-${emptyKey}`} />
                        ))}
                  </Fragment>
                );
              })}
            </div>
          ))
        : "No players online."}
    </main>
  );
}

export default PlayersList;
