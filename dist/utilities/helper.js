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
//imports
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import Config from '../db/config.js';
const error_1 = __importStar(require("./error"));
const uuid_1 = require("uuid");
const env_1 = require("./env");
//imports
const errorHandler = new error_1.default();
class HELPER {
    static getDate() {
        return new Date().toUTCString();
    }
    static async logger(message, file = "") {
        // const file = Config.File
        message = "#" + message + "\n";
        let dir = `${__dirname}${file}`;
        try {
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            fs_1.default.appendFile(dir, message, async (err) => {
                if (err) {
                    console.log("Error", err);
                    throw await errorHandler.CustomError(error_1.ErrorEnum[500], `Error Writing File to file: ${file}`);
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    //JSON web Token 
    static async ENCODE_Token(id) {
        try {
            return await jsonwebtoken_1.default.sign({ id }, env_1.SERVER_SECRET, {
                expiresIn: HELPER.SessionMaxAge
            });
        }
        catch (error) {
            throw await errorHandler.CustomError(error_1.ErrorEnum[500], "Try again later 🙏🏼");
        }
    }
    static async DECODE_TOKEN(token) {
        //check token
        if (token) {
            let back = "";
            try {
                await jsonwebtoken_1.default.verify(token, env_1.SERVER_SECRET, (err, decodedToken) => {
                    if (err) {
                        errorHandler.CustomError(error_1.ErrorEnum[403], "Invalid Token");
                        ;
                    }
                    else {
                        back = decodedToken.id;
                    }
                });
                return back;
            }
            catch (error) {
                throw error;
            }
        }
    }
    static async GET_DIRECTORY(file, dir = __dirname) {
        try {
            let directory = await path_1.default.join(dir, file);
            return directory;
        }
        catch (error) {
            throw await errorHandler.CustomError(error_1.ErrorEnum[500], "Try again later");
        }
    }
    static async genRandCode(size = 16) {
        try {
            let result = "";
            for (let i = 0; i < size; i++) {
                result += HELPER.Chars.charAt(Math.floor(Math.random() * HELPER.Chars.length));
            }
            if (result.length < size)
                throw new Error(error_1.ErrorEnum[500]);
            return result;
        }
        catch (error) {
            throw await errorHandler.CustomError(error_1.ErrorEnum[500], "Try again later");
        }
    }
    static async GENERATE_UUID() {
        try {
            let uuid = await (0, uuid_1.v4)();
            if (!uuid) {
                uuid = await this.genRandCode();
            }
            return uuid;
        }
        catch (error) {
            throw await errorHandler.CustomError(error_1.ErrorEnum[500], "Try again later 🙏🏼");
        }
    }
    static FILE_DETAILS(file) {
        try {
            let ext = (path_1.default.extname(file.name));
            return { extension: ext };
        }
        catch (error) {
        }
    }
}
HELPER.SessionMaxAge = 730 * 24 * 60 * 60; //2 years
HELPER.RefreshMaxAge = 60 * 24 * 60;
HELPER.SESSION = "session";
HELPER.Chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
exports.default = HELPER;
//# sourceMappingURL=helper.js.map