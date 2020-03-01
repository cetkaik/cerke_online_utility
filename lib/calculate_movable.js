"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type__piece_1 = require("./type__piece");
const cerke_online_api_1 = require("cerke_online_api");
function applyDeltas(coord, deltas) {
    const [i, j] = coord;
    const assertCoord = ([l, m]) => [l, m];
    return deltas
        .map(([delta_x, delta_y]) => [i + delta_x, j + delta_y])
        .filter(([l, m]) => 0 <= l && l <= 8 && 0 <= m && m <= 8)
        .map(assertCoord);
}
console.assert(JSON.stringify(getBlockerDeltas([-6, 3])) === "[[-4,2],[-2,1]]");
console.assert(JSON.stringify(getBlockerDeltas([-3, 0])) === "[[-2,0],[-1,0]]");
console.assert(JSON.stringify(getBlockerDeltas([0, 3])) === "[[0,1],[0,2]]");
function getBlockerDeltas(delta) {
    /* blocking occurs only when there exists [dx_block, dy_block] such that
          - the dot product with [dx, dy] is positive
          - the cross product with [dx, dy] is zero
          - abs(dx_block, dy_block) < abs(dx, dy)
          */
    const [dx, dy] = delta;
    const ans = [];
    for (let dx_block = -8; dx_block <= 8; dx_block++) {
        for (let dy_block = -8; dy_block <= 8; dy_block++) {
            if (dx * dy_block - dy * dx_block !== 0) {
                continue;
            } // cross product must be zero
            if (dx * dx_block + dy * dy_block <= 0) {
                continue;
            } // cross product must be positive
            if (dx_block * dx_block + dy_block * dy_block >= dx * dx + dy * dy) {
                continue;
            }
            // must be strictly small in absolute value
            ans[ans.length] = [dx_block, dy_block];
        }
    }
    return ans;
}
function applyDeltasIfNoIntervention(coord, deltas, board) {
    return [].concat(...deltas.map(delta => applySingleDeltaIfNoIntervention(coord, delta, board)));
}
function applySingleDeltaIfNoIntervention(coord, delta, board) {
    const blocker = applyDeltas(coord, getBlockerDeltas(delta));
    // if nothing is blocking the way
    if (blocker.every(([i, j]) => board[i][j] == null)) {
        return applyDeltas(coord, [delta]);
    }
    else {
        return [];
    }
}
function applySingleDeltaIfZeroOrOneIntervention(coord, delta, board) {
    const blocker = applyDeltas(coord, getBlockerDeltas(delta));
    // if no piece or a single piece is blocking the way
    if (blocker.filter(([i, j]) => board[i][j] != null).length <= 1) {
        return applyDeltas(coord, [delta]);
    }
    else {
        return [];
    }
}
function applyDeltasIfZeroOrOneIntervention(coord, deltas, board) {
    return [].concat(...deltas.map(delta => applySingleDeltaIfZeroOrOneIntervention(coord, delta, board)));
}
function eightNeighborhood(coord) {
    return applyDeltas(coord, [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ]);
}
exports.eightNeighborhood = eightNeighborhood;
function isTamHue(coord, board, tam_itself_is_tam_hue) {
    // unconditionally TamHue
    if (type__piece_1.coordEq(coord, [2, 2]) ||
        type__piece_1.coordEq(coord, [2, 6]) ||
        type__piece_1.coordEq(coord, [3, 3]) ||
        type__piece_1.coordEq(coord, [3, 5]) ||
        type__piece_1.coordEq(coord, [4, 4]) ||
        type__piece_1.coordEq(coord, [5, 3]) ||
        type__piece_1.coordEq(coord, [5, 5]) ||
        type__piece_1.coordEq(coord, [6, 2]) ||
        type__piece_1.coordEq(coord, [6, 6])) {
        return true;
    }
    if (tam_itself_is_tam_hue && board[coord[0]][coord[1]] === "Tam2") {
        return true;
    }
    // is Tam2 available at any neighborhood?
    return eightNeighborhood(coord).some(([i, j]) => board[i][j] === "Tam2");
}
exports.isTamHue = isTamHue;
/** Checks whether it is possible for the moving piece to occupy the destination, either by moving to an empty square or taking the opponent's piece.
 * @param {Side} side the side who is moving the piece
 * @param {Coord} dest destination
 * @param {Piece} piece_to_move piece that is moving
 * @param {Readonly<Board>} board the board
 * @param {boolean} tam_itself_is_tam_hue whether tam2 itself is tam2 hue
 */
function canGetOccupiedBy(side, dest, piece_to_move, board, tam_itself_is_tam_hue) {
    if (piece_to_move === "Tam2") {
        const [i, j] = dest;
        const destPiece = board[i][j];
        /* It is allowed to enter an empty square */
        return destPiece === null;
    }
    else {
        return canGetOccupiedByNonTam(side, dest, board, tam_itself_is_tam_hue);
    }
}
exports.canGetOccupiedBy = canGetOccupiedBy;
function canGetOccupiedByNonTam(side, dest, board, tam_itself_is_tam_hue) {
    /* Intentionally does not verify whether the piece itself is of opponent */
    const isProtectedByOpponentTamHueAUai = (side, coord) => eightNeighborhood(coord).filter(([a, b]) => {
        const piece = board[a][b];
        if (piece == null) {
            return false;
        }
        if (piece === "Tam2") {
            return false;
        }
        return (piece.prof === cerke_online_api_1.Profession.Uai1 &&
            piece.side !== side &&
            isTamHue([a, b], board, tam_itself_is_tam_hue));
    }).length > 0;
    const [i, j] = dest;
    const destPiece = board[i][j];
    /* Tam2 can never be taken */
    if (destPiece === "Tam2") {
        return false;
    }
    /* It is always allowed to enter an empty square */
    if (destPiece === null) {
        return true;
    }
    else {
        return (destPiece.side !== side /* cannot take your own piece */ &&
            !isProtectedByOpponentTamHueAUai(side, dest) /* must not be protected by tam2 hue a uai1 */);
    }
}
exports.canGetOccupiedByNonTam = canGetOccupiedByNonTam;
/**
 * Calculates the possible squares to which the piece can MOVE to. THIS INCLUDES SQUARES OCCUPIED BY TAM2, ALLIES, OR OPPONENTS PROTECTED BY TAM2HUEAUAI1
 * @param coord the square from which the piece moves
 * @param piece the piece to be moved
 * @param board the board
 * @param tam_itself_is_tam_hue rule variation: does Tam2 itself count as a tam2 hue?
 */
function calculateMovablePositions(coord, piece, board, tam_itself_is_tam_hue) {
    if (piece === "Tam2") {
        return { finite: eightNeighborhood(coord), infinite: [] };
    }
    if (piece.prof === cerke_online_api_1.Profession.Io) {
        return { finite: eightNeighborhood(coord), infinite: [] };
    }
    const UPLEFT = [
        [-8, -8],
        [-7, -7],
        [-6, -6],
        [-5, -5],
        [-4, -4],
        [-3, -3],
        [-2, -2],
        [-1, -1]
    ];
    const UPRIGHT = [
        [-8, 8],
        [-7, 7],
        [-6, 6],
        [-5, 5],
        [-4, 4],
        [-3, 3],
        [-2, 2],
        [-1, 1]
    ];
    const DOWNLEFT = [
        [8, -8],
        [7, -7],
        [6, -6],
        [5, -5],
        [4, -4],
        [3, -3],
        [2, -2],
        [1, -1]
    ];
    const DOWNRIGHT = [
        [8, 8],
        [7, 7],
        [6, 6],
        [5, 5],
        [4, 4],
        [3, 3],
        [2, 2],
        [1, 1]
    ];
    const UP = [
        [-1, 0],
        [-2, 0],
        [-3, 0],
        [-4, 0],
        [-5, 0],
        [-6, 0],
        [-7, 0],
        [-8, 0]
    ];
    const DOWN = [
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0],
        [8, 0]
    ];
    const LEFT = [
        [0, -1],
        [0, -2],
        [0, -3],
        [0, -4],
        [0, -5],
        [0, -6],
        [0, -7],
        [0, -8]
    ];
    const RIGHT = [
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
        [0, 6],
        [0, 7],
        [0, 8]
    ];
    if (isTamHue(coord, board, tam_itself_is_tam_hue)) {
        switch (piece.prof) {
            case cerke_online_api_1.Profession.Uai1: // General, 将, varxle
                return { finite: eightNeighborhood(coord), infinite: [] };
            case cerke_online_api_1.Profession.Kaun1:
                return {
                    finite: applyDeltas(coord, [
                        [-2, -2],
                        [-2, 2],
                        [2, 2],
                        [2, -2]
                    ]),
                    infinite: []
                }; // 車, vadyrd
            case cerke_online_api_1.Profession.Kauk2: // Pawn, 兵, elmer
                return {
                    finite: [
                        ...applyDeltas(coord, [
                            [-1, 0],
                            [0, -1],
                            [0, 1],
                            [1, 0]
                        ]),
                        ...applySingleDeltaIfNoIntervention(coord, [-2, 0], board)
                    ],
                    infinite: []
                };
            case cerke_online_api_1.Profession.Nuak1: // Vessel, 船, felkana
                return {
                    finite: [
                        ...applyDeltas(coord, [
                            [0, -1],
                            [0, 1]
                        ]),
                        ...applyDeltasIfNoIntervention(coord, [
                            [0, -2],
                            [0, 2]
                        ], board)
                    ],
                    infinite: applyDeltasIfNoIntervention(coord, [...UP, ...DOWN], board)
                };
            case cerke_online_api_1.Profession.Gua2: // Rook, 弓, gustuer
            case cerke_online_api_1.Profession.Dau2: // Tiger, 虎, stistyst
                return {
                    finite: [],
                    infinite: applyDeltasIfNoIntervention(coord, [...UPLEFT, ...UPRIGHT, ...DOWNLEFT, ...DOWNRIGHT], board)
                };
            case cerke_online_api_1.Profession.Maun1: {
                // Horse, 馬, dodor
                const deltas = [
                    [-8, -8],
                    [-7, -7],
                    [-6, -6],
                    [-5, -5],
                    [-4, -4],
                    [-3, -3],
                    [-2, -2],
                    [-8, 8],
                    [-7, 7],
                    [-6, 6],
                    [-5, 5],
                    [-4, 4],
                    [-3, 3],
                    [-2, 2],
                    [8, -8],
                    [7, -7],
                    [6, -6],
                    [5, -5],
                    [4, -4],
                    [3, -3],
                    [2, -2],
                    [8, 8],
                    [7, 7],
                    [6, 6],
                    [5, 5],
                    [4, 4],
                    [3, 3],
                    [2, 2]
                ];
                let inf = [];
                for (let i = 0; i < deltas.length; i++) {
                    const delta = deltas[i];
                    const blocker_deltas = getBlockerDeltas(delta).filter(d => 
                    /*
                     * remove [-1, 1], [-1, -1], [1, -1] and [1, 1], because
                     * pieces here will not prevent Tam2HueAMaun1 from moving.
                     */
                    !([-1, 1].includes(d[0]) && [-1, 1].includes(d[1])));
                    const blocker = applyDeltas(coord, blocker_deltas);
                    // if nothing is blocking the way
                    if (blocker.every(([i, j]) => board[i][j] == null)) {
                        inf = [...inf, ...applyDeltas(coord, [delta])];
                    }
                }
                return {
                    finite: [],
                    infinite: inf
                };
            }
            case cerke_online_api_1.Profession.Kua2: // Clerk, 筆, kua
                return {
                    finite: [],
                    infinite: applyDeltasIfNoIntervention(coord, [...UP, ...DOWN, ...LEFT, ...RIGHT], board)
                };
            case cerke_online_api_1.Profession.Tuk2: // Shaman, 巫, terlsk
                return {
                    finite: [],
                    infinite: applyDeltasIfZeroOrOneIntervention(coord, [
                        ...UP,
                        ...DOWN,
                        ...LEFT,
                        ...RIGHT,
                        ...UPLEFT,
                        ...UPRIGHT,
                        ...DOWNLEFT,
                        ...DOWNRIGHT
                    ], board)
                };
            default:
                const _should_not_reach_here = piece.prof;
                return _should_not_reach_here;
        }
    }
    else {
        switch (piece.prof) {
            case cerke_online_api_1.Profession.Kauk2:
                return { finite: applyDeltas(coord, [[-1, 0]]), infinite: [] }; // Pawn, 兵, elmer
            case cerke_online_api_1.Profession.Kaun1:
                return {
                    finite: applyDeltas(coord, [
                        [-2, 0],
                        [2, 0],
                        [0, -2],
                        [0, 2]
                    ]),
                    infinite: []
                }; // 車, vadyrd
            case cerke_online_api_1.Profession.Dau2: // Tiger, 虎, stistyst
                return {
                    finite: applyDeltas(coord, [
                        [-1, -1],
                        [-1, 1],
                        [1, -1],
                        [1, 1]
                    ]),
                    infinite: []
                };
            case cerke_online_api_1.Profession.Maun1: // Horse, 馬, dodor
                return {
                    finite: applyDeltas(coord, [
                        [-2, -2],
                        [-2, 2],
                        [2, 2],
                        [2, -2]
                    ]),
                    infinite: []
                };
            case cerke_online_api_1.Profession.Nuak1: // Vessel, 船, felkana
                return {
                    finite: [],
                    infinite: applyDeltasIfNoIntervention(coord, UP, board)
                };
            case cerke_online_api_1.Profession.Gua2: // Rook, 弓, gustuer
                return {
                    finite: [],
                    infinite: applyDeltasIfNoIntervention(coord, [...UP, ...DOWN, ...LEFT, ...RIGHT], board)
                };
            case cerke_online_api_1.Profession.Kua2: // Clerk, 筆, kua
                return {
                    finite: applyDeltas(coord, [
                        [0, -1],
                        [0, 1]
                    ]),
                    infinite: applyDeltasIfNoIntervention(coord, [...UP, ...DOWN], board)
                };
            case cerke_online_api_1.Profession.Tuk2: // Shaman, 巫, terlsk
                return {
                    finite: applyDeltas(coord, [
                        [-1, 0],
                        [1, 0]
                    ]),
                    infinite: applyDeltasIfNoIntervention(coord, [...LEFT, ...RIGHT], board)
                };
            case cerke_online_api_1.Profession.Uai1: // General, 将, varxle
                return {
                    finite: applyDeltas(coord, [
                        [-1, -1],
                        [-1, 0],
                        [-1, 1],
                        [0, -1],
                        [0, 1],
                        [1, -1],
                        [1, 1]
                    ]),
                    infinite: []
                };
            default:
                const _should_not_reach_here = piece.prof;
                return _should_not_reach_here;
        }
    }
}
exports.calculateMovablePositions = calculateMovablePositions;
