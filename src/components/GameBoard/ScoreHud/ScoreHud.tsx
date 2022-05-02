import "./ScoreHud.scss";

function ScoreHud({
  opponent,
  host,
  hasTurn,
  max,
}: {
  opponent: { id: string; avatar: string; name: string; score: number };
  host: { id: string; avatar: string; name: string; score: number };
  hasTurn: string;
  max: number;
}) {
  return (
    <aside className="container-fluid hud">
      <div className="host">
        <article
          className={`game_player_card ${hasTurn === host.id && "selected"}`}
        >
          <img
            alt={host.avatar}
            height={64}
            width={64}
            src={require(`../../../assets/avatars/${host.avatar}.png`).default}
          />
          <div>
            <div>
              <b>{host.name}</b>
            </div>
            <div>{host.score}</div>
          </div>
        </article>
      </div>
      <div className="score">
        <div
          className="host_score"
          style={{ width: `${host.score > 0 ? (host.score / max) * 100 : 0}%` }}
        />
        <div
          className="neutral_score"
          style={{
            width: `${
              max - host.score - opponent.score > 0
                ? ((max - host.score - opponent.score) / max) * 100
                : 0
            }%`,
          }}
        />
        <div
          className="opponent_score"
          style={{
            width: `${opponent.score > 0 ? (opponent.score / max) * 100 : 0}%`,
          }}
        />
      </div>
      <div className="opponent">
        <article
          className={`game_player_card ${
            hasTurn === opponent.id && "selected"
          }`}
        >
          <div>
            <div>
              <b>{opponent.name}</b>
            </div>
            <div>{opponent.score}</div>
          </div>
          <img
            alt={opponent.avatar}
            height={64}
            width={64}
            src={
              require(`../../../assets/avatars/${opponent.avatar}.png`).default
            }
          />
        </article>
      </div>
    </aside>
  );
}

export default ScoreHud;
