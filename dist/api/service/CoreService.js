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
const GIPService_1 = __importDefault(require("../../Processors/GIP/GIPService"));
const error_1 = __importStar(require("../../utilities/error"));
const ERROR = new error_1.default();
class CoreService {
    constructor() {
        this.GIP = new GIPService_1.default();
    }
    // let {recipientName,recipientAccount,accountType,bankModileCode} = payload
    async MakeNameEnquiry(recipientName, recipientAccount, accountType, bankMobileCode) {
        try {
            if (!recipientName || !recipientAccount || !bankMobileCode || !accountType)
                throw { code: error_1.ErrorEnum[403], message: "Some details are missing" };
            let result = await this.GIP.MakeNameEnquiry({ recipientName, recipientAccount, accountType, bankMobileCode });
            return result;
        }
        catch (error) {
            console.log("in Service Core", error);
            let { errorCode, message } = error;
            throw await ERROR.HandleError(errorCode, message);
        }
        finally {
        }
    }
}
exports.default = CoreService;
//# sourceMappingURL=CoreService.js.map