import { historyKey, mergeHistory, readHistory } from "@/lib/game-history";
import type { ImplementedMode, Topic } from "../types/game.types";
export const sessionHistoryKey = (topic: Topic, mode: ImplementedMode) =>
  `arrow-learn-games:history:v3:${topic.area}:${topic.id}:${mode}`;
// Read-through migration is idempotent; v2 data is never deleted or attributed to a different topic.
export function loadSessionHistory(
  storage: Pick<Storage, "getItem">,
  topic: Topic,
  mode: ImplementedMode,
) {
  const legacyMode = topic.legacyHistory?.[mode];
  return mergeHistory(
    legacyMode ? readHistory(storage.getItem(historyKey(legacyMode))) : [],
    readHistory(storage.getItem(sessionHistoryKey(topic, mode))),
  );
}
