import {
  Side,
  NonTam2PieceUpward,
  Board,
  Piece,
  Coord,
  BoardIndex,
  coordEq,
  rotateCoord,
  rotateBoard
} from "./type__piece";

import { Field } from "./game_state";

import {
  Color,
  Profession,
  AbsoluteCoord,
  AbsoluteColumn,
  AbsoluteRow
} from "cerke_online_api";

import {
  calculateMovablePositions,
  eightNeighborhood,
  canGetOccupiedBy
} from "./calculate_movable";

export function toAbsoluteCoord_(
  [row, col]: Coord,
  IA_is_down: boolean
): AbsoluteCoord {
  const columns: AbsoluteColumn[] = [
    "K",
    "L",
    "N",
    "T",
    "Z",
    "X",
    "C",
    "M",
    "P"
  ];

  const rows: AbsoluteRow[] = ["A", "E", "I", "U", "O", "Y", "AI", "AU", "IA"];

  return [
    rows[IA_is_down ? row : 8 - row],
    columns[IA_is_down ? col : 8 - col]
  ];
}

export function fromAbsoluteCoord_(
  [absrow, abscol]: AbsoluteCoord,
  IA_is_down: boolean
): Coord {
  let rowind: BoardIndex;

  if (absrow === "A") {
    rowind = 0;
  } else if (absrow === "E") {
    rowind = 1;
  } else if (absrow === "I") {
    rowind = 2;
  } else if (absrow === "U") {
    rowind = 3;
  } else if (absrow === "O") {
    rowind = 4;
  } else if (absrow === "Y") {
    rowind = 5;
  } else if (absrow === "AI") {
    rowind = 6;
  } else if (absrow === "AU") {
    rowind = 7;
  } else if (absrow === "IA") {
    rowind = 8;
  } else {
    const _should_not_reach_here: never = absrow;
    throw new Error("does not happen");
  }

  let colind: BoardIndex;

  if (abscol === "K") {
    colind = 0;
  } else if (abscol === "L") {
    colind = 1;
  } else if (abscol === "N") {
    colind = 2;
  } else if (abscol === "T") {
    colind = 3;
  } else if (abscol === "Z") {
    colind = 4;
  } else if (abscol === "X") {
    colind = 5;
  } else if (abscol === "C") {
    colind = 6;
  } else if (abscol === "M") {
    colind = 7;
  } else if (abscol === "P") {
    colind = 8;
  } else {
    const _should_not_reach_here: never = abscol;
    throw new Error("does not happen");
  }

  if (IA_is_down) {
    return [rowind, colind];
  } else {
    return [(8 - rowind) as BoardIndex, (8 - colind) as BoardIndex];
  }
}

export interface PureOpponentMoveWithPotentialWaterEntry {
  type: "NonTamMove";
  data: PureSrcDst | PureSrcStepDstFinite;
}

export interface PureGameState {
  f: Field;
  IA_is_down: boolean;
  tam_itself_is_tam_hue: boolean;
  opponent_has_just_moved_tam: boolean;
}

export interface PureSrcDst {
  type: "SrcDst";
  src: AbsoluteCoord;
  dest: AbsoluteCoord;
  is_water_entry_ciurl: boolean;
}

export interface PureSrcStepDstFinite {
  type: "SrcStepDstFinite";
  src: AbsoluteCoord;
  step: AbsoluteCoord;
  dest: AbsoluteCoord;
  is_water_entry_ciurl: boolean;
}

export type PureOpponentMove =
  | PureOpponentMoveWithPotentialWaterEntry
  | {
      type: "NonTamMove";
      data: {
        type: "FromHand";
        color: Color;
        prof: Profession;
        dest: AbsoluteCoord;
      };
    }
  | {
      type: "TamMove";
      stepStyle: "NoStep";
      src: AbsoluteCoord;
      firstDest: AbsoluteCoord;
      secondDest: AbsoluteCoord;
    }
  | {
      type: "TamMove";
      stepStyle: "StepsDuringFormer" | "StepsDuringLatter";
      src: AbsoluteCoord;
      step: AbsoluteCoord;
      firstDest: AbsoluteCoord;
      secondDest: AbsoluteCoord;
    }
  | {
      type: "InfAfterStep";
      src: AbsoluteCoord;
      step: AbsoluteCoord;
      plannedDirection: AbsoluteCoord;
      stepping_ciurl: null;
      finalResult: null;
    };

export function isWaterAbs([row, col]: AbsoluteCoord): boolean {
  return (
    (row === "O" && col === "N") ||
    (row === "O" && col === "T") ||
    (row === "O" && col === "Z") ||
    (row === "O" && col === "X") ||
    (row === "O" && col === "C") ||
    (row === "I" && col === "Z") ||
    (row === "U" && col === "Z") ||
    (row === "Y" && col === "Z") ||
    (row === "AI" && col === "Z")
  );
}

export function isWater([row, col]: Coord): boolean {
  return (
    (row === 4 && col === 2) ||
    (row === 4 && col === 3) ||
    (row === 4 && col === 4) ||
    (row === 4 && col === 5) ||
    (row === 4 && col === 6) ||
    (row === 2 && col === 4) ||
    (row === 3 && col === 4) ||
    (row === 5 && col === 4) ||
    (row === 6 && col === 4)
  );
}

const boardIndices: Readonly<BoardIndex[]> = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export type Rotated = {
  rotated_piece: "Tam2" | NonTam2PieceUpward;
  rotated_coord: Coord;
};

export const get_opponent_pieces_rotated: (
  gameState: PureGameState
) => Rotated[] = gameState =>
  boardIndices.flatMap(rand_i =>
    boardIndices.flatMap((rand_j: BoardIndex): Rotated[] => {
      const coord: Coord = [rand_i, rand_j];
      const piece: Piece | null = gameState.f.currentBoard[rand_i][rand_j];

      if (piece === null) {
        return [];
      } else if (piece === "Tam2") {
        return [{ rotated_piece: piece, rotated_coord: rotateCoord(coord) }];
      } else if (piece.side === Side.Downward) {
        const rot_piece: NonTam2PieceUpward = {
          prof: piece.prof,
          color: piece.color,
          side: Side.Upward
        };
        return [
          { rotated_piece: rot_piece, rotated_coord: rotateCoord(coord) }
        ];
      } else {
        return [];
      }
    })
  );

export const empty_squares = (gameState: PureGameState): Coord[] =>
  boardIndices.flatMap(rand_i =>
    boardIndices.flatMap((rand_j: BoardIndex) => {
      const coord: Coord = [rand_i, rand_j];
      if (gameState.f.currentBoard[rand_i][rand_j] == null) {
        return [coord];
      } else return [];
    })
  );

const empty_neighbors_of = (board: Board, c: Coord): Coord[] =>
  eightNeighborhood(c).filter(([i, j]) => board[i][j] == null);

export const from_hand_candidates = (
  gameState: PureGameState
): PureOpponentMove[] =>
  gameState.f.hop1zuo1OfDownward.flatMap(piece =>
    empty_squares(gameState).flatMap(empty_square => [
      {
        type: "NonTamMove",
        data: {
          type: "FromHand",
          color: piece.color,
          prof: piece.prof,
          dest: toAbsoluteCoord_(empty_square, gameState.IA_is_down)
        }
      }
    ])
  );

export const not_from_hand_candidates_ = (
  config: { allow_kut2tam2: boolean },
  gameState: PureGameState
): PureOpponentMove[] =>
  get_opponent_pieces_rotated(gameState).flatMap(
    ({ rotated_piece, rotated_coord }) => {
      const {
        finite: guideListYellow,
        infinite: guideListGreen
      } = calculateMovablePositions(
        rotated_coord,
        rotated_piece,
        rotateBoard(gameState.f.currentBoard),
        gameState.tam_itself_is_tam_hue
      );

      const candidates: Coord[] = [
        ...guideListYellow.map(rotateCoord),
        ...guideListGreen.map(rotateCoord)
      ];

      const src: Coord = rotateCoord(rotated_coord);

      return candidates.flatMap((dest: Coord): PureOpponentMove[] => {
        function is_ciurl_required(
          dest: Coord,
          moving_piece_prof: Profession,
          src: Coord
        ) {
          return (
            isWater(dest) &&
            !isWater(src) &&
            moving_piece_prof !== Profession.Nuak1
          );
        }
        const destPiece = gameState.f.currentBoard[dest[0]][dest[1]];

        const candidates_when_stepping = (
          rotated_piece: NonTam2PieceUpward
        ) => {
          const step = dest; // less confusing

          /* now, to decide the final position, we must remove the piece to prevent self-occlusion */
          const subtracted_rotated_board = rotateBoard(
            gameState.f.currentBoard
          );
          subtracted_rotated_board[rotated_coord[0]][
            rotated_coord[1]
          ] = null; /* must remove the piece to prevent self-occlusion */

          const {
            finite: guideListYellow,
            infinite: guideListGreen
          } = calculateMovablePositions(
            rotateCoord(step),
            rotated_piece,
            subtracted_rotated_board,
            gameState.tam_itself_is_tam_hue
          );

          const candidates: Coord[] = guideListYellow.map(rotateCoord);
          const candidates_inf: Coord[] = guideListGreen.map(rotateCoord);
          return [
            ...candidates.flatMap(finalDest => {
              if (
                canGetOccupiedBy(
                  Side.Downward,
                  finalDest,
                  {
                    color: rotated_piece.color,
                    prof: rotated_piece.prof,
                    side: Side.Downward
                  },
                  rotateBoard(subtracted_rotated_board),
                  gameState.tam_itself_is_tam_hue
                )
              ) {
                const obj: PureOpponentMoveWithPotentialWaterEntry = {
                  type: "NonTamMove",
                  data: {
                    type: "SrcStepDstFinite",
                    src: toAbsoluteCoord_(src, gameState.IA_is_down),
                    step: toAbsoluteCoord_(step, gameState.IA_is_down),
                    dest: toAbsoluteCoord_(finalDest, gameState.IA_is_down),
                    is_water_entry_ciurl: is_ciurl_required(
                      finalDest,
                      rotated_piece.prof,
                      src
                    )
                  }
                };
                return [obj];
              } else return [];
            }),
            ...candidates_inf.flatMap(planned_dest => {
              if (
                !canGetOccupiedBy(
                  Side.Downward,
                  planned_dest,
                  {
                    color: rotated_piece.color,
                    prof: rotated_piece.prof,
                    side: Side.Downward
                  },
                  rotateBoard(subtracted_rotated_board),
                  gameState.tam_itself_is_tam_hue
                )
              ) {
                return [];
                // retry
              }
              const obj: PureOpponentMove = {
                type: "InfAfterStep",
                src: toAbsoluteCoord_(src, gameState.IA_is_down),
                step: toAbsoluteCoord_(step, gameState.IA_is_down),
                plannedDirection: toAbsoluteCoord_(
                  planned_dest,
                  gameState.IA_is_down
                ),
                stepping_ciurl: null,
                finalResult: null
              };
              return [obj];
            })
          ];
        };

        if (rotated_piece === "Tam2") {
          /* avoid self-occlusion */
          const subtracted_rotated_board = rotateBoard(
            gameState.f.currentBoard
          );
          subtracted_rotated_board[rotated_coord[0]][rotated_coord[1]] = null;
          // FIXME: tam2 ty sak2 not handled
          if (destPiece === null) {
            /* empty square; first move is completed without stepping */
            const fstdst: Coord = dest;
            return eightNeighborhood(fstdst).flatMap(
              (neighbor): PureOpponentMove[] => {
                /* if the neighbor is empty, that is the second destination */
                if (
                  gameState.f.currentBoard[neighbor[0]][neighbor[1]] ==
                    null /* the neighbor is utterly occupied */ ||
                  coordEq(
                    neighbor,
                    src
                  ) /* the neighbor is occupied by yourself, which means it is actually empty */
                ) {
                  const snddst: Coord = neighbor;
                  return [
                    {
                      type: "TamMove",
                      stepStyle: "NoStep",
                      secondDest: toAbsoluteCoord_(
                        snddst,
                        gameState.IA_is_down
                      ),
                      firstDest: toAbsoluteCoord_(fstdst, gameState.IA_is_down),
                      src: toAbsoluteCoord_(src, gameState.IA_is_down)
                    }
                  ];
                } else {
                  /* if not, step from there */
                  const step: Coord = neighbor;
                  return empty_neighbors_of(
                    rotateBoard(subtracted_rotated_board),
                    step
                  ).flatMap(snddst => {
                    return [
                      {
                        type: "TamMove",
                        stepStyle: "StepsDuringLatter",
                        firstDest: toAbsoluteCoord_(
                          fstdst,
                          gameState.IA_is_down
                        ),
                        secondDest: toAbsoluteCoord_(
                          snddst,
                          gameState.IA_is_down
                        ),
                        src: toAbsoluteCoord_(src, gameState.IA_is_down),
                        step: toAbsoluteCoord_(step, gameState.IA_is_down)
                      }
                    ];
                  });
                }
              }
            );
          } else {
            /* not an empty square: must complete the first move */
            const step = dest;
            return empty_neighbors_of(
              rotateBoard(subtracted_rotated_board),
              step
            ).flatMap(fstdst =>
              empty_neighbors_of(
                rotateBoard(subtracted_rotated_board),
                fstdst
              ).flatMap(snddst => [
                {
                  type: "TamMove",
                  stepStyle: "StepsDuringFormer",
                  firstDest: toAbsoluteCoord_(fstdst, gameState.IA_is_down),
                  secondDest: toAbsoluteCoord_(snddst, gameState.IA_is_down),
                  src: toAbsoluteCoord_(src, gameState.IA_is_down),
                  step: toAbsoluteCoord_(step, gameState.IA_is_down)
                }
              ])
            );
          }
        } else if (destPiece === null) {
          // cannot step
          const obj: PureOpponentMoveWithPotentialWaterEntry = {
            type: "NonTamMove",
            data: {
              type: "SrcDst",
              src: toAbsoluteCoord_(src, gameState.IA_is_down),
              dest: toAbsoluteCoord_(dest, gameState.IA_is_down),
              is_water_entry_ciurl: is_ciurl_required(
                dest,
                rotated_piece.prof,
                src
              )
            }
          };
          return [obj];
        } else if (destPiece === "Tam2") {
          // if allowed by config, allow stepping on Tam2;
          if (config.allow_kut2tam2) {
            return candidates_when_stepping(rotated_piece);
          } else {
            return [];
          }
        } else if (destPiece.side === Side.Upward) {
          // opponent's piece; stepping and taking both attainable

          // except when protected by tam2 hue a uai1
          if (
            !canGetOccupiedBy(
              Side.Downward,
              dest,
              {
                color: rotated_piece.color,
                prof: rotated_piece.prof,
                side: Side.Downward
              },
              gameState.f.currentBoard,
              gameState.tam_itself_is_tam_hue
            )
          ) {
            return candidates_when_stepping(rotated_piece);
          }

          return [
            {
              type: "NonTamMove",
              data: {
                type: "SrcDst",
                src: toAbsoluteCoord_(src, gameState.IA_is_down),
                dest: toAbsoluteCoord_(dest, gameState.IA_is_down),
                is_water_entry_ciurl: is_ciurl_required(
                  dest,
                  rotated_piece.prof,
                  src
                )
              }
            },
            ...candidates_when_stepping(rotated_piece)
          ];
        } else {
          return candidates_when_stepping(rotated_piece);
        }
      });
    }
  );
export const not_from_hand_candidates = (
  gameState: PureGameState
): PureOpponentMove[] =>
  not_from_hand_candidates_({ allow_kut2tam2: false }, gameState);
export const not_from_hand_candidates_with_kut2tam2 = (
  gameState: PureGameState
): PureOpponentMove[] =>
  not_from_hand_candidates_({ allow_kut2tam2: true }, gameState);

export function get_valid_opponent_moves(
  gameState: PureGameState
): PureOpponentMove[] {
  return [
    ...from_hand_candidates(gameState),
    ...not_from_hand_candidates_({ allow_kut2tam2: false }, gameState)
  ];
}
