"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class SingletonAxios {
    constructor() {
        SingletonAxios.instance = axios_1.default.create();
    }
    static getInstance() {
        if (!SingletonAxios.instance) {
            SingletonAxios.instance = new SingletonAxios();
        }
        return SingletonAxios.instance;
    }
    async request(data) {
        return await axios_1.default.request(data);
    }
}
exports.default = SingletonAxios;
//# sourceMappingURL=axios.js.map