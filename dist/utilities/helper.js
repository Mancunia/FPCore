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
const path_1 = __importDefault(require("path"));
// import jwt from "jsonwebtoken"
// import Config from '../db/config.js';
const error_1 = __importStar(require("./error"));
// import {v4 as uuidV4} from "uuid"
//imports
// const __filename = fileURLToPath(import.meta.url);
// export const __dirname = path.dirname(__filename);
const errorHandler = new error_1.default();
class HELPER {
    static getDate() {
        return new Date().toUTCString();
    }
    // public static async logger(message: string){
    //     // const file = Config.File
    //     message ="#"+message+"\n"
    //     try {
    //         fs.appendFile(`${__dirname}-${file}`, message,(err)=>{
    //             if(err){
    //                 console.log(err);
    //                 throw "Writing File"}
    //         });
    //     } catch (error) {
    //         throw error.message
    //     }
    // }
    //JSON web Token 
    // public static async SessionToken(id:string): Promise<string>{
    //     try {
    //         return await jwt.sign({id},Config.SECRET,{
    //       expiresIn: Utility.SessionMaxAge
    //   });
    //     } catch (error) {
    //        throw await errorHandler.CustomError(ErrorEnum[500],"Try again later 🙏🏼"); 
    //     }
    // }
    // public static async DECODE_TOKEN(token:string): Promise<string>{
    //     //check token
    //     if(token){
    //         let back:string = "";
    //         try{
    //             await jwt.verify(token,Config.SECRET,(err,decodedToken)=>{
    //             if(err){
    //                 errorHandler.CustomError(ErrorEnum[403],"Invalid Token"); ;
    //             }
    //             else{
    //                 back=decodedToken.id;
    //             }
    //             });
    //             return back;
    //         }
    //         catch(error){
    //             throw error;
    //         }
    //         }
    //   }
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
    //   public static async GENERATE_UUID(): Promise<string>{
    //     try {
    //         let uuid = await uuidV4()
    //         if(!uuid){
    //             uuid = await this.genRandCode()
    //         }
    //         return uuid
    //     } catch (error) {
    //        throw await errorHandler.CustomError(ErrorEnum[500],"Try again later 🙏🏼"); 
    //     }
    //   }
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