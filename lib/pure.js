"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type__piece_1 = require("./type__piece");
const cerke_online_api_1 = require("cerke_online_api");
const calculate_movable_1 = require("./calculate_movable");
function toAbsoluteCoord_([row, col], IA_is_down) {
    const columns = [
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
    const rows = ["A", "E", "I", "U", "O", "Y", "AI", "AU", "IA"];
    return [
        rows[IA_is_down ? row : 8 - row],
        columns[IA_is_down ? col : 8 - col]
    ];
}
exports.toAbsoluteCoord_ = toAbsoluteCoord_;
function fromAbsoluteCoord_([absrow, abscol], IA_is_down) {
    let rowind;
    if (absrow === "A") {
        rowind = 0;
    }
    else if (absrow === "E") {
        rowind = 1;
    }
    else if (absrow === "I") {
        rowind = 2;
    }
    else if (absrow === "U") {
        rowind = 3;
    }
    else if (absrow === "O") {
        rowind = 4;
    }
    else if (absrow === "Y") {
        rowind = 5;
    }
    else if (absrow === "AI") {
        rowind = 6;
    }
    else if (absrow === "AU") {
        rowind = 7;
    }
    else if (absrow === "IA") {
        rowind = 8;
    }
    else {
        const _should_not_reach_here = absrow;
        throw new Error("does not happen");
    }
    let colind;
    if (abscol === "K") {
        colind = 0;
    }
    else if (abscol === "L") {
        colind = 1;
    }
    else if (abscol === "N") {
        colind = 2;
    }
    else if (abscol === "T") {
        colind = 3;
    }
    else if (abscol === "Z") {
        colind = 4;
    }
    else if (abscol === "X") {
        colind = 5;
    }
    else if (abscol === "C") {
        colind = 6;
    }
    else if (abscol === "M") {
        colind = 7;
    }
    else if (abscol === "P") {
        colind = 8;
    }
    else {
        const _should_not_reach_here = abscol;
        throw new Error("does not happen");
    }
    if (IA_is_down) {
        return [rowind, colind];
    }
    else {
        return [(8 - rowind), (8 - colind)];
    }
}
exports.fromAbsoluteCoord_ = fromAbsoluteCoord_;
function isWaterAbs([row, col]) {
    return ((row === "O" && col === "N") ||
        (row === "O" && col === "T") ||
        (row === "O" && col === "Z") ||
        (row === "O" && col === "X") ||
        (row === "O" && col === "C") ||
        (row === "I" && col === "Z") ||
        (row === "U" && col === "Z") ||
        (row === "Y" && col === "Z") ||
        (row === "AI" && col === "Z"));
}
exports.isWaterAbs = isWaterAbs;
function isWater([row, col]) {
    return ((row === 4 && col === 2) ||
        (row === 4 && col === 3) ||
        (row === 4 && col === 4) ||
        (row === 4 && col === 5) ||
        (row === 4 && col === 6) ||
        (row === 2 && col === 4) ||
        (row === 3 && col === 4) ||
        (row === 5 && col === 4) ||
        (row === 6 && col === 4));
}
exports.isWater = isWater;
const boardIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
exports.get_opponent_pieces_rotated = gameState => boardIndices.flatMap(rand_i => boardIndices.flatMap((rand_j) => {
    const coord = [rand_i, rand_j];
    const piece = gameState.f.currentBoard[rand_i][rand_j];
    if (piece === null) {
        return [];
    }
    else if (piece === "Tam2") {
        return [{ rotated_piece: piece, rotated_coord: type__piece_1.rotateCoord(coord) }];
    }
    else if (piece.side === type__piece_1.Side.Downward) {
        const rot_piece = {
            prof: piece.prof,
            color: piece.color,
            side: type__piece_1.Side.Upward
        };
        return [
            { rotated_piece: rot_piece, rotated_coord: type__piece_1.rotateCoord(coord) }
        ];
    }
    else {
        return [];
    }
}));
exports.empty_squares = (gameState) => boardIndices.flatMap(rand_i => boardIndices.flatMap((rand_j) => {
    const coord = [rand_i, rand_j];
    if (gameState.f.currentBoard[rand_i][rand_j] == null) {
        return [coord];
    }
    else
        return [];
}));
const empty_neighbors_of = (board, c) => calculate_movable_1.eightNeighborhood(c).filter(([i, j]) => board[i][j] == null);
exports.from_hand_candidates = (gameState) => gameState.f.hop1zuo1OfDownward.flatMap(piece => exports.empty_squares(gameState).flatMap(empty_square => [
    {
        type: "NonTamMove",
        data: {
            type: "FromHand",
            color: piece.color,
            prof: piece.prof,
            dest: toAbsoluteCoord_(empty_square, gameState.IA_is_down)
        }
    }
]));
exports.not_from_hand_candidates_ = (config, gameState) => exports.get_opponent_pieces_rotated(gameState).flatMap(({ rotated_piece, rotated_coord }) => {
    const { finite: guideListYellow, infinite: guideListGreen } = calculate_movable_1.calculateMovablePositions(rotated_coord, rotated_piece, type__piece_1.rotateBoard(gameState.f.currentBoard), gameState.tam_itself_is_tam_hue);
    const candidates = [
        ...guideListYellow.map(type__piece_1.rotateCoord),
        ...guideListGreen.map(type__piece_1.rotateCoord)
    ];
    const src = type__piece_1.rotateCoord(rotated_coord);
    return candidates.flatMap((dest) => {
        function is_ciurl_required(dest, moving_piece_prof, src) {
            return (isWater(dest) &&
                !isWater(src) &&
                moving_piece_prof !== cerke_online_api_1.Profession.Nuak1);
        }
        const destPiece = gameState.f.currentBoard[dest[0]][dest[1]];
        const candidates_when_stepping = (rotated_piece) => {
            const step = dest; // less confusing
            /* now, to decide the final position, we must remove the piece to prevent self-occlusion */
            const subtracted_rotated_board = type__piece_1.rotateBoard(gameState.f.currentBoard);
            subtracted_rotated_board[rotated_coord[0]][rotated_coord[1]] = null; /* must remove the piece to prevent self-occlusion */
            const { finite: guideListYellow, infinite: guideListGreen } = calculate_movable_1.calculateMovablePositions(type__piece_1.rotateCoord(step), rotated_piece, subtracted_rotated_board, gameState.tam_itself_is_tam_hue);
            const candidates = guideListYellow.map(type__piece_1.rotateCoord);
            const candidates_inf = guideListGreen.map(type__piece_1.rotateCoord);
            return [
                ...candidates.flatMap(finalDest => {
                    if (calculate_movable_1.canGetOccupiedBy(type__piece_1.Side.Downward, finalDest, {
                        color: rotated_piece.color,
                        prof: rotated_piece.prof,
                        side: type__piece_1.Side.Downward
                    }, type__piece_1.rotateBoard(subtracted_rotated_board), gameState.tam_itself_is_tam_hue)) {
                        const obj = {
                            type: "NonTamMove",
                            data: {
                                type: "SrcStepDstFinite",
                                src: toAbsoluteCoord_(src, gameState.IA_is_down),
                                step: toAbsoluteCoord_(step, gameState.IA_is_down),
                                dest: toAbsoluteCoord_(finalDest, gameState.IA_is_down),
                                is_water_entry_ciurl: is_ciurl_required(finalDest, rotated_piece.prof, src)
                            }
                        };
                        return [obj];
                    }
                    else
                        return [];
                }),
                ...candidates_inf.flatMap(planned_dest => {
                    if (!calculate_movable_1.canGetOccupiedBy(type__piece_1.Side.Downward, planned_dest, {
                        color: rotated_piece.color,
                        prof: rotated_piece.prof,
                        side: type__piece_1.Side.Downward
                    }, type__piece_1.rotateBoard(subtracted_rotated_board), gameState.tam_itself_is_tam_hue)) {
                        return [];
                        // retry
                    }
                    const obj = {
                        type: "InfAfterStep",
                        src: toAbsoluteCoord_(src, gameState.IA_is_down),
                        step: toAbsoluteCoord_(step, gameState.IA_is_down),
                        plannedDirection: toAbsoluteCoord_(planned_dest, gameState.IA_is_down),
                        stepping_ciurl: null,
                        finalResult: null
                    };
                    return [obj];
                })
            ];
        };
        if (rotated_piece === "Tam2") {
            /* avoid self-occlusion */
            const subtracted_rotated_board = type__piece_1.rotateBoard(gameState.f.currentBoard);
            subtracted_rotated_board[rotated_coord[0]][rotated_coord[1]] = null;
            // FIXME: tam2 ty sak2 not handled
            if (destPiece === null) {
                /* empty square; first move is completed without stepping */
                const fstdst = dest;
                return calculate_movable_1.eightNeighborhood(fstdst).flatMap((neighbor) => {
                    /* if the neighbor is empty, that is the second destination */
                    if (gameState.f.currentBoard[neighbor[0]][neighbor[1]] ==
                        null /* the neighbor is utterly occupied */ ||
                        type__piece_1.coordEq(neighbor, src) /* the neighbor is occupied by yourself, which means it is actually empty */) {
                        const snddst = neighbor;
                        return [
                            {
                                type: "TamMove",
                                stepStyle: "NoStep",
                                secondDest: toAbsoluteCoord_(snddst, gameState.IA_is_down),
                                firstDest: toAbsoluteCoord_(fstdst, gameState.IA_is_down),
                                src: toAbsoluteCoord_(src, gameState.IA_is_down)
                            }
                        ];
                    }
                    else {
                        /* if not, step from there */
                        const step = neighbor;
                        return empty_neighbors_of(type__piece_1.rotateBoard(subtracted_rotated_board), step).flatMap(snddst => {
                            return [
                                {
                                    type: "TamMove",
                                    stepStyle: "StepsDuringLatter",
                                    firstDest: toAbsoluteCoord_(fstdst, gameState.IA_is_down),
                                    secondDest: toAbsoluteCoord_(snddst, gameState.IA_is_down),
                                    src: toAbsoluteCoord_(src, gameState.IA_is_down),
                                    step: toAbsoluteCoord_(step, gameState.IA_is_down)
                                }
                            ];
                        });
                    }
                });
            }
            else {
                /* not an empty square: must complete the first move */
                const step = dest;
                return empty_neighbors_of(type__piece_1.rotateBoard(subtracted_rotated_board), step).flatMap(fstdst => empty_neighbors_of(type__piece_1.rotateBoard(subtracted_rotated_board), fstdst).flatMap(snddst => [
                    {
                        type: "TamMove",
                        stepStyle: "StepsDuringFormer",
                        firstDest: toAbsoluteCoord_(fstdst, gameState.IA_is_down),
                        secondDest: toAbsoluteCoord_(snddst, gameState.IA_is_down),
                        src: toAbsoluteCoord_(src, gameState.IA_is_down),
                        step: toAbsoluteCoord_(step, gameState.IA_is_down)
                    }
                ]));
            }
        }
        else if (destPiece === null) {
            // cannot step
            const obj = {
                type: "NonTamMove",
                data: {
                    type: "SrcDst",
                    src: toAbsoluteCoord_(src, gameState.IA_is_down),
                    dest: toAbsoluteCoord_(dest, gameState.IA_is_down),
                    is_water_entry_ciurl: is_ciurl_required(dest, rotated_piece.prof, src)
                }
            };
            return [obj];
        }
        else if (destPiece === "Tam2") {
            // if allowed by config, allow stepping on Tam2;
            if (config.allow_kut2tam2) {
                return candidates_when_stepping(rotated_piece);
            }
            else {
                return [];
            }
        }
        else if (destPiece.side === type__piece_1.Side.Upward) {
            // opponent's piece; stepping and taking both attainable
            // except when protected by tam2 hue a uai1
            if (!calculate_movable_1.canGetOccupiedBy(type__piece_1.Side.Downward, dest, {
                color: rotated_piece.color,
                prof: rotated_piece.prof,
                side: type__piece_1.Side.Downward
            }, gameState.f.currentBoard, gameState.tam_itself_is_tam_hue)) {
                return candidates_when_stepping(rotated_piece);
            }
            return [
                {
                    type: "NonTamMove",
                    data: {
                        type: "SrcDst",
                        src: toAbsoluteCoord_(src, gameState.IA_is_down),
                        dest: toAbsoluteCoord_(dest, gameState.IA_is_down),
                        is_water_entry_ciurl: is_ciurl_required(dest, rotated_piece.prof, src)
                    }
                },
                ...candidates_when_stepping(rotated_piece)
            ];
        }
        else {
            return candidates_when_stepping(rotated_piece);
        }
    });
});
exports.not_from_hand_candidates = (gameState) => exports.not_from_hand_candidates_({ allow_kut2tam2: false }, gameState);
exports.not_from_hand_candidates_with_kut2tam2 = (gameState) => exports.not_from_hand_candidates_({ allow_kut2tam2: true }, gameState);
function get_valid_opponent_moves(gameState) {
    return [
        ...exports.from_hand_candidates(gameState),
        ...exports.not_from_hand_candidates_({ allow_kut2tam2: false }, gameState)
    ];
}
exports.get_valid_opponent_moves = get_valid_opponent_moves;
