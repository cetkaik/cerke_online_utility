import { Color, Profession } from "cerke_online_api";

export enum Side {
  Upward, // Pieces that points upward. Denoted by @^@ in the ASCII notation.
  Downward // Pieces that points downward. Denoted by @_@ in the ASCII notation.
}

export interface NonTam2Piece {
  color: Color; // The color of the piece
  prof: Profession; // The profession of the piece
  side: Side; // The side that the piece belongs to
}

export function fromUpOrDown(
  u_or_d: NonTam2PieceDownward | NonTam2PieceUpward
): NonTam2Piece {
  return {
    color: u_or_d.color,
    prof: u_or_d.prof,
    side: u_or_d.side
  };
}

export function toUpOrDown(
  nontam: NonTam2Piece
): NonTam2PieceDownward | NonTam2PieceUpward {
  if (nontam.side === Side.Downward) {
    return {
      color: nontam.color,
      prof: nontam.prof,
      side: nontam.side
    };
  } else {
    return {
      color: nontam.color,
      prof: nontam.prof,
      side: nontam.side
    };
  }
}

export interface NonTam2PieceDownward {
  color: Color; // The color of the piece
  prof: Profession; // The profession of the piece
  side: Side.Downward; // The side that the piece belongs to
}

export interface NonTam2PieceUpward {
  color: Color; // The color of the piece
  prof: Profession; // The profession of the piece
  side: Side.Upward; // The side that the piece belongs to
}

export type Piece = "Tam2" | NonTam2Piece;

export type Tuple9<T> = [T, T, T, T, T, T, T, T, T];

export type Board = Tuple9<Row>;
export type Row = Tuple9<Piece | null>;

export type BoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Coord = Readonly<[BoardIndex, BoardIndex]>;

export function coordEq(a: Coord, b: Coord): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export function rotateCoord(c: Coord): Coord {
  return [(8 - c[0]) as BoardIndex, (8 - c[1]) as BoardIndex];
}

export function rotateBoard(b: Board): Board {
  const ans: Board = [
    [null, null, null, null, null, null, null, null, "Tam2"],
    [null, null, null, null, null, null, null, null, "Tam2"],
    [null, null, null, null, null, null, null, null, "Tam2"],
    [null, null, null, null, null, null, null, null, "Tam2"],
    [null, null, null, null, null, null, null, null, "Tam2"],
    [null, null, null, null, null, null, null, null, "Tam2"],
    [null, null, null, null, null, null, null, null, "Tam2"],
    [null, null, null, null, null, null, null, null, "Tam2"],
    [null, null, null, null, null, null, null, null, "Tam2"]
  ];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      ans[i][j] = rotatePieceOrNull(b[8 - i][8 - j]);
    }
  }
  return ans;
}

function rotatePieceOrNull(p: Piece | null): Piece | null {
  if (p === null || p === "Tam2") {
    return p;
  } else {
    return { prof: p.prof, color: p.color, side: 1 - p.side };
  }
}
