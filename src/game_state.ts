import {
  Side,
  NonTam2PieceUpward,
  NonTam2PieceDownward,
  Board,
  Piece,
  Coord,
} from "./type__piece";

import { Color, Profession } from "cerke_online_api";

export interface Field {
  currentBoard: Board;
  hop1zuo1OfUpward: NonTam2PieceUpward[];
  hop1zuo1OfDownward: NonTam2PieceDownward[];
}

type Season = 0 | 1 | 2 | 3;
type Log2_Rate = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/*
 * Theoretically speaking, it is necessary to distinguish x32 and x64
 * because it is possible to score 1 point (3+3-5).
 * Not that it will ever be of use in any real situation.
 */

export interface GAME_STATE {
  f: Field;
  IA_is_down: boolean;
  tam_itself_is_tam_hue: boolean;
  is_my_turn: boolean;
  backupDuringStepping: null | [Coord, Piece];
  season: Season;
  my_score: number;
  log2_rate: Log2_Rate;
  opponent_has_just_moved_tam: boolean;
  scores_of_each_season: [number[], number[], number[], number[]];
}

export const initial_board_with_IA_down: Board = [
  [
    { color: Color.Huok2, prof: Profession.Kua2, side: Side.Downward },
    { color: Color.Huok2, prof: Profession.Maun1, side: Side.Downward },
    { color: Color.Huok2, prof: Profession.Kaun1, side: Side.Downward },
    { color: Color.Huok2, prof: Profession.Uai1, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Io, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Uai1, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Kaun1, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Maun1, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Kua2, side: Side.Downward },
  ],
  [
    { color: Color.Kok1, prof: Profession.Tuk2, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Gua2, side: Side.Downward },
    null,
    { color: Color.Kok1, prof: Profession.Dau2, side: Side.Downward },
    null,
    { color: Color.Huok2, prof: Profession.Dau2, side: Side.Downward },
    null,
    { color: Color.Huok2, prof: Profession.Gua2, side: Side.Downward },
    { color: Color.Huok2, prof: Profession.Tuk2, side: Side.Downward },
  ],
  [
    { color: Color.Huok2, prof: Profession.Kauk2, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Kauk2, side: Side.Downward },
    { color: Color.Huok2, prof: Profession.Kauk2, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Kauk2, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Nuak1, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Kauk2, side: Side.Downward },
    { color: Color.Huok2, prof: Profession.Kauk2, side: Side.Downward },
    { color: Color.Kok1, prof: Profession.Kauk2, side: Side.Downward },
    { color: Color.Huok2, prof: Profession.Kauk2, side: Side.Downward },
  ],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, "Tam2", null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [
    { color: Color.Huok2, prof: Profession.Kauk2, side: Side.Upward },
    { color: Color.Kok1, prof: Profession.Kauk2, side: Side.Upward },
    { color: Color.Huok2, prof: Profession.Kauk2, side: Side.Upward },
    { color: Color.Kok1, prof: Profession.Kauk2, side: Side.Upward },
    { color: Color.Huok2, prof: Profession.Nuak1, side: Side.Upward },
    { color: Color.Kok1, prof: Profession.Kauk2, side: Side.Upward },
    { color: Color.Huok2, prof: Profession.Kauk2, side: Side.Upward },
    { color: Color.Kok1, prof: Profession.Kauk2, side: Side.Upward },
    { color: Color.Huok2, prof: Profession.Kauk2, side: Side.Upward },
  ],
  [
    { color: Color.Huok2, prof: Profession.Tuk2, side: Side.Upward },
    { color: Color.Huok2, prof: Profession.Gua2, side: Side.Upward },
    null,
    { color: Color.Huok2, prof: Profession.Dau2, side: Side.Upward },
    null,
    { color: Color.Kok1, prof: Profession.Dau2, side: Side.Upward },
    null,
    { color: Color.Kok1, prof: Profession.Gua2, side: Side.Upward },
    { color: Color.Kok1, prof: Profession.Tuk2, side: Side.Upward },
  ],
  [
    { color: Color.Kok1, prof: Profession.Kua2, side: Side.Upward },
    { color: Color.Kok1, prof: Profession.Maun1, side: Side.Upward },
    { color: Color.Kok1, prof: Profession.Kaun1, side: Side.Upward },
    { color: Color.Kok1, prof: Profession.Uai1, side: Side.Upward },
    { color: Color.Huok2, prof: Profession.Io, side: Side.Upward },
    { color: Color.Huok2, prof: Profession.Uai1, side: Side.Upward },
    { color: Color.Huok2, prof: Profession.Kaun1, side: Side.Upward },
    { color: Color.Huok2, prof: Profession.Maun1, side: Side.Upward },
    { color: Color.Huok2, prof: Profession.Kua2, side: Side.Upward },
  ],
];
