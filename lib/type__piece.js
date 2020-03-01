"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Side;
(function (Side) {
    Side[Side["Upward"] = 0] = "Upward";
    Side[Side["Downward"] = 1] = "Downward"; // Pieces that points downward. Denoted by @_@ in the ASCII notation.
})(Side = exports.Side || (exports.Side = {}));
function fromUpOrDown(u_or_d) {
    return {
        color: u_or_d.color,
        prof: u_or_d.prof,
        side: u_or_d.side
    };
}
exports.fromUpOrDown = fromUpOrDown;
function toUpOrDown(nontam) {
    if (nontam.side === Side.Downward) {
        return {
            color: nontam.color,
            prof: nontam.prof,
            side: nontam.side
        };
    }
    else {
        return {
            color: nontam.color,
            prof: nontam.prof,
            side: nontam.side
        };
    }
}
exports.toUpOrDown = toUpOrDown;
function coordEq(a, b) {
    return a[0] === b[0] && a[1] === b[1];
}
exports.coordEq = coordEq;
function rotateCoord(c) {
    return [(8 - c[0]), (8 - c[1])];
}
exports.rotateCoord = rotateCoord;
function rotateBoard(b) {
    const ans = [
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
exports.rotateBoard = rotateBoard;
function rotatePieceOrNull(p) {
    if (p === null || p === "Tam2") {
        return p;
    }
    else {
        return { prof: p.prof, color: p.color, side: 1 - p.side };
    }
}
