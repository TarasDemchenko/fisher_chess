function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) {
    return [arr];
  }

  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(remaining)) {
      result.push([current, ...perm]);
    }
  }
  return result;
}

export const generateChess960Fen = (): string => {
  const cells = [0, 1, 2, 3, 4, 5, 6, 7];

  const blackSquares = [0, 2, 4, 6];
  const whiteSquares = [1, 3, 5, 7];

  const bishopBlackPos = randomChoice(blackSquares);
  const bishopWhitePos = randomChoice(whiteSquares);

  const remainingCells = cells.filter(
    (c) => c !== bishopBlackPos && c !== bishopWhitePos
  );

  const piecesToPlace = ["R", "R", "K", "Q", "N", "N"];

  const validPermutations: string[][] = [];
  for (const perm of permutations(piecesToPlace)) {
    const rookPositions = perm
      .map((piece, idx) => (piece === "R" ? idx : -1))
      .filter((pos) => pos !== -1);
    const kingPosition = perm.indexOf("K");

    if (
      rookPositions.length === 2 &&
      Math.min(...rookPositions) < kingPosition &&
      kingPosition < Math.max(...rookPositions)
    ) {
      validPermutations.push(perm);
    }
  }

  const chosenArrangement = randomChoice(validPermutations);

  const backrank: Array<string | null> = new Array(8).fill(null);
  backrank[bishopBlackPos] = "B";
  backrank[bishopWhitePos] = "B";

  remainingCells.forEach((cellIndex, i) => {
    backrank[cellIndex] = chosenArrangement[i];
  });

  const whiteBackRank = backrank.join("");

  const blackBackRank = whiteBackRank.toLowerCase();

  const ranks = [
    blackBackRank,
    "pppppppp",
    "8",
    "8",
    "8",
    "8",
    "PPPPPPPP",
    whiteBackRank,
  ];

  const fen = ranks.join("/") + " w KQkq - 0 1";

  return fen;
};

export default generateChess960Fen;
