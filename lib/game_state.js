"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type__piece_1 = require("./type__piece");
const cerke_online_api_1 = require("cerke_online_api");
exports.initial_board_with_IA_down = [
    [
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kua2, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Maun1, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kaun1, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Uai1, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Io, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Uai1, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kaun1, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Maun1, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kua2, side: type__piece_1.Side.Downward }
    ],
    [
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Tuk2, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Gua2, side: type__piece_1.Side.Downward },
        null,
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Dau2, side: type__piece_1.Side.Downward },
        null,
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Dau2, side: type__piece_1.Side.Downward },
        null,
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Gua2, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Tuk2, side: type__piece_1.Side.Downward }
    ],
    [
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Nuak1, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Downward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Downward }
    ],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, "Tam2", null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Nuak1, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kauk2, side: type__piece_1.Side.Upward }
    ],
    [
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Tuk2, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Gua2, side: type__piece_1.Side.Upward },
        null,
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Dau2, side: type__piece_1.Side.Upward },
        null,
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Dau2, side: type__piece_1.Side.Upward },
        null,
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Gua2, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Tuk2, side: type__piece_1.Side.Upward }
    ],
    [
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kua2, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Maun1, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Kaun1, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Kok1, prof: cerke_online_api_1.Profession.Uai1, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Io, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Uai1, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kaun1, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Maun1, side: type__piece_1.Side.Upward },
        { color: cerke_online_api_1.Color.Huok2, prof: cerke_online_api_1.Profession.Kua2, side: type__piece_1.Side.Upward }
    ]
];
