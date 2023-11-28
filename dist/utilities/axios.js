"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const error_1 = __importStar(require("./error"));
const errorHandler = new error_1.default();
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
        try {
            return await axios_1.default.request(data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                // Check if the error is due to a timeout
                if (axios_1.default.isCancel(error)) {
                    // console.error('Request was canceled:', error.message);
                    throw await errorHandler.CustomError(error_1.ErrorEnum[408], "Request Timed out");
                }
                else {
                    // console.error('Axios request error:', error.message);
                    throw await errorHandler.CustomError(error_1.ErrorEnum[400], "Request Error");
                }
            }
            else {
                console.error('Non-Axios error:', error.message);
            }
        }
    }
    static async AxiosPostRequest(url, body) {
        try {
            return await axios_1.default.post(url, body);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                // Check if the error is due to a timeout
                if (axios_1.default.isCancel(error)) {
                    // console.error('Request was canceled:', error.message);
                    throw await errorHandler.CustomError(error_1.ErrorEnum[408], "Request Timed out");
                }
                else {
                    // console.error('Axios request error:', error.message);
                    throw await errorHandler.CustomError(error_1.ErrorEnum[400], "Request Error");
                }
            }
            else {
                throw await errorHandler.CustomError(error_1.ErrorEnum[400], "Request Error");
            }
        }
    }
}
exports.default = SingletonAxios;
//# sourceMappingURL=axios.js.map