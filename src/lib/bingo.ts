import { shuffleDeck } from "./animals";

// Nine columns, five numbers per row. The last column includes 80–99.
export function createBingoCard(): (number | null)[][] {
  const columns = shuffleDeck(Array.from({ length: 9 }, (_, i) => i));
  const slots = Array.from({ length: 3 }, (_, row) =>
    Array.from({ length: 5 }, (_, i) => columns[(row * 5 + i) % 9]),
  );
  const card: (number | null)[][] = Array.from({ length: 3 }, () =>
    Array(9).fill(null),
  );
  for (let col = 0; col < 9; col++) {
    const rows = slots.flatMap((items, row) =>
      items.includes(col) ? [row] : [],
    );
    const start = col === 0 ? 1 : col * 10;
    const end = col === 8 ? 99 : col * 10 + 9;
    const values = shuffleDeck(
      Array.from({ length: end - start + 1 }, (_, i) => start + i),
    )
      .slice(0, rows.length)
      .sort((a, b) => a - b);
    rows.forEach((row, i) => {
      card[row][col] = values[i];
    });
  }
  return card;
}
export function completedLines(card: (number | null)[][], marked: number[]) {
  return card.filter((row) =>
    row.every((n) => n === null || marked.includes(n)),
  ).length;
}

export function createBingoDraw(): number[] {
  return shuffleDeck(Array.from({ length: 99 }, (_, i) => i + 1));
}

export function canMarkBingoNumber(
  n: number,
  deck: number[],
  index: number,
): boolean {
  return deck.slice(0, index + 1).includes(n);
}
