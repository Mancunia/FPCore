"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml2json_1 = __importDefault(require("xml2json"));
const toJson = async (xml) => {
    return await JSON.parse(xml2json_1.default.toJson(xml));
};
exports.default = toJson;
//# sourceMappingURL=xmlParser.js.map