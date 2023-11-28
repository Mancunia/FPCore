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
const GIPRepository_1 = __importDefault(require("./GIPRepository"));
const helper_1 = __importDefault(require("../../utilities/helper"));
const error_1 = __importStar(require("../../utilities/error"));
const workerThreads_1 = __importDefault(require("../../utilities/workerThreads"));
var FUNCTIONCODES;
(function (FUNCTIONCODES) {
    FUNCTIONCODES[FUNCTIONCODES["Name Enquiry For Credit"] = 230] = "Name Enquiry For Credit";
    FUNCTIONCODES[FUNCTIONCODES["Name Enquiry For dedit"] = 231] = "Name Enquiry For dedit";
    FUNCTIONCODES[FUNCTIONCODES["Fund Transfer For Credit"] = 240] = "Fund Transfer For Credit";
    FUNCTIONCODES[FUNCTIONCODES["Fund Transfer For Debit"] = 241] = "Fund Transfer For Debit";
    FUNCTIONCODES[FUNCTIONCODES["OTP request before Debit"] = 242] = "OTP request before Debit";
    FUNCTIONCODES[FUNCTIONCODES["Balance Enquiry"] = 250] = "Balance Enquiry";
    FUNCTIONCODES[FUNCTIONCODES["Transaction Status Check"] = 111] = "Transaction Status Check";
})(FUNCTIONCODES || (FUNCTIONCODES = {}));
var CHANNELCODES;
(function (CHANNELCODES) {
    CHANNELCODES[CHANNELCODES["Mobile Phones"] = 300] = "Mobile Phones";
    CHANNELCODES[CHANNELCODES["Bank Tellers"] = 100] = "Bank Tellers";
})(CHANNELCODES || (CHANNELCODES = {}));
class GIP_Service {
    // private transactions:TransactionService
    constructor() {
        this.LogFile = "/ghipps.log";
        this.Repo = new GIPRepository_1.default();
        this.errorHandler = new error_1.default();
        this.workers = new workerThreads_1.default(4);
        // this.transactions = new TransactionService()
    }
    /*
    1. Check recipient details
    2. check for account type
    3. Send request
    4. Handle and filter response
    5. send response
    */
    async MakeNameEnquiry(payload) {
        let body;
        let { recipientName, recipientAccount, accountType, bankMobileCode } = payload;
        try {
            // TODO: create name enquiry service for GIP service
            //1. Check recipient details
            if (!recipientName || !recipientAccount || !bankMobileCode)
                throw { code: error_1.ErrorEnum[403], message: "Some details are missing" };
            //2. Check for account type
            await helper_1.default.logger(`ATTEMPTING Name Enquiry: @${helper_1.default.getDate()} - payload: ${JSON.stringify(payload)} `, this.LogFile);
            //make body
            body = {
                amount: '000000000000',
                date: helper_1.default.getDate(),
                function_code: FUNCTIONCODES["Name Enquiry For Credit"],
                desitination_bank: String(bankMobileCode),
                session_id: await helper_1.default.GENERATE_UUID(),
                channel_code: String(accountType == "MOBILE" ? CHANNELCODES["Mobile Phones"] : CHANNELCODES["Bank Tellers"]),
                account_to_credit: recipientAccount,
                narration: "Name Enquiry For Credit",
                tracking_trace: "use Helper.getUUID() method"
            };
            let response = await this.Repo.NameEnquiry(body);
            return response.name_to_credit; //return name to credit information from response object
        }
        catch (error) {
            this.final = `Error: @ ${helper_1.default.getDate()} - ${error.message} payload: ${JSON.stringify(payload)}`;
            await this.ErrorSwitch(error, "Something went wrong when getting name information");
        }
        finally {
            await helper_1.default.logger(this.final, this.LogFile);
            this.final = null;
        }
    }
    /*
    1. Check transaction details
    2. send request
    3. handle and filter response
    4. send response
    */
    async MakeFundTransfer(payload) {
        let body;
        let { senderName, amount, recipientName, recipientAccount, accountType, bankMobileCode, narration, referenceId } = payload;
        try {
            //Check transaction details
            if (!senderName || !recipientName || !amount || !recipientAccount || !accountType || !referenceId)
                throw { code: error_1.ErrorEnum[403], message: "Some essential data was not passed" };
            //2. log transaction details
            await helper_1.default.logger(`ATTEMPTING Fund transfer: @${helper_1.default.getDate()} - payload: ${JSON.stringify(payload)} `, this.LogFile);
            //Make body
            body = {
                amount: (String(amount)).padStart(12, "0"),
                account_to_credit: recipientAccount,
                date: helper_1.default.getDate(),
                tracking_trace: referenceId,
                function_code: FUNCTIONCODES['Fund Transfer For Credit'],
                desitination_bank: String(bankMobileCode),
                session_id: "session",
                channel_code: String(accountType == "MOBILE" ? CHANNELCODES["Mobile Phones"] : CHANNELCODES["Bank Tellers"]),
                narration: narration
            };
            //request sent
            let response = await this.Repo.FundTransfer(body);
            response.act_code = response.act_code == "300" ? "Processed" : "Failed";
            return response;
        }
        catch (error) {
            this.final = `Error: @ ${helper_1.default.getDate()} - payload: ${JSON.stringify(payload)} ${error.message} `;
            if (error == "909") {
                let tries = 0;
                while (tries < 3) {
                    setInterval(() => {
                        body.function_code = FUNCTIONCODES["Transaction Status Check"];
                        this.workers.submitTask(this.CheckTransactionStatus(body));
                    }, 5000);
                }
            }
            throw await this.ErrorSwitch(error, "Something went wrong while make transfer");
        }
        finally {
            await helper_1.default.logger(this.final, this.LogFile);
            this.final = null;
        }
    }
    GetBalanceEnquiry() {
        return;
    }
    ;
    ReverseTransaction() {
        return;
    }
    async CheckTransactionStatus(payload) {
        try {
            let response = await this.Repo.FundTransfer(payload);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    ;
    async CheckProcessorStatus() {
        return await false;
    }
    async ErrorSwitch(code, defaultMessage = "Invalid") {
        switch (code) {
            case "100":
                throw await this.errorHandler.CustomError(error_1.ErrorEnum[403], "Invalid SOAP envelope");
            case "306":
                throw await this.errorHandler.CustomError(error_1.ErrorEnum[403], "Invalid SOAP envelope");
            case "400":
                throw await this.errorHandler.CustomError(error_1.ErrorEnum[400], "Something happened");
            default:
                throw code;
        }
    }
}
exports.default = GIP_Service;
//# sourceMappingURL=GIPService.js.map