import "./GameCard.scss";

function GameCard({
  card,
  cardSize,
  onSelect,
  isGameBlocked,
}: {
  card: { key: number; solved: boolean; imgSrc?: string };
  cardSize: number;
  isGameBlocked: boolean;
  onSelect: (key: number) => void;
}) {
  const isSelectable = !card.solved && !card.imgSrc && !isGameBlocked;

  const handleSelect = () => {
    isSelectable && onSelect(card.key);
  };

  return (
    <div
      key={card.key}
      className={`game__quadrant ${isSelectable ? "selectable" : ""}`}
      style={{ height: cardSize, width: cardSize }}
      tabIndex={isSelectable ? 0 : undefined}
      onClick={handleSelect}
    >
      <div className={`card-content ${card.imgSrc && "flipped"}`}>
        <div className={`cover ${card.solved ? "solved" : ""}`} />
        {card.imgSrc && (
          <div className="card-image">
            <img
              alt=""
              src={card.imgSrc}
              className={`${card.solved ? "solved" : ""}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default GameCard;
