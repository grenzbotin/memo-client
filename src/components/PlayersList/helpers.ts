import { TPlayerPayload } from "../../store/slices/players";

export const chunkArray = (
  arrayToSplit: TPlayerPayload[],
  chunkSize: number
) => {
  const results = Array.from(
    { length: Math.ceil(arrayToSplit.length / chunkSize) },
    (_, i) => arrayToSplit.slice(i * chunkSize, i * chunkSize + chunkSize)
  );

  return results;
};
