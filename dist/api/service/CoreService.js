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
const helper_1 = __importDefault(require("../../utilities/helper"));
const ProcessorMappingService_1 = __importDefault(require("./ProcessorMappingService"));
const TransactionType_1 = __importDefault(require("./TransactionType"));
const TransactionService_1 = __importDefault(require("./TransactionService"));
const ApplicationService_1 = __importDefault(require("./ApplicationService"));
const RequestResponseService_1 = __importDefault(require("./RequestResponseService"));
const ERROR = new error_1.default();
class CoreService {
    constructor() {
        // this.Processor = new GIP_Service()
        this.mappings = new ProcessorMappingService_1.default();
        this.error = new error_1.default();
        this.transactionType = new TransactionType_1.default();
        this.transaction = new TransactionService_1.default();
        this.application = new ApplicationService_1.default();
        this.requestResponse = new RequestResponseService_1.default();
    }
    /*
    0.get processors
    1.check if processors are available
    2.create instance of processor at index 0
    3.perform transaction
    3.1.if fails
    */
    async MakeNameEnquiry(app, payload) {
        try {
            if (!payload.recipientName || !payload.recipientAccount || !payload.bankMobileCode || !payload.accountType)
                throw this.error.CustomError(error_1.ErrorEnum[403], "Some details are missing");
            let processors = await this.mappings.GetAllProcessorsForApp(app, payload.accountType);
            while (processors.length > 0) {
                this.Processor = await this.SwitchProcessor(processors[0].Name);
                try {
                    console.log("ProcessorName:", this.Processor); //TODO: take this log off
                    let result = await this.Processor.MakeNameEnquiry(payload);
                    if (result) {
                        return result;
                    }
                    else { //Transaction failed to process, eject current processor and restart process
                        console.log('Transaction processing failed. Trying next processor...'); //TODO: take this log off
                        processors.shift(); // Remove the failed processor 
                    }
                }
                catch (error) {
                    throw error;
                }
            }
            // if(processors.length === 0) throw await this.error.CustomError(ErrorEnum[403],"App run out of processors")
            // return result
        }
        catch (error) {
            console.log("in Service Core", error); //TODO: take this log off
            let { errorCode, message } = error;
            throw await ERROR.HandleError(errorCode, message);
        }
        finally {
        }
    }
    /*
    0. fetch transaction type
    1. Check if transaction amount is valid per the transaction type configuration
    2. Create transaction instance
    3. fetch Processors for application**
    4. Post request data
    4. Attempt to process transaction
    5. is transaction was successful?
    6.1. Yes, Hit app callback with transaction success status information
    6.2. No, Hit app callback with transaction failure status information
    6.3. Timeout, Hit app callback with transaction timeout message

    */
    async MakeFundTransfer(app, payload) {
        try {
            let transactionType = await this.transactionType.GetTransactionTypeByName(payload.accountType.toUpperCase());
            let application = await this.application.GetApplication(app);
            let processors = await this.mappings.GetAllProcessorsForApp(app, payload.accountType.toUpperCase());
            if (payload.amount < transactionType.MinAmount || payload.amount >= transactionType.MaxAmount) {
                throw await this.error.CustomError(error_1.ErrorEnum[403], "Sending Amount is not a valid amount"); //check for amount validity
            }
            //create transaction
            let transactPayload = {
                SessionID: await helper_1.default.GENERATE_UUID(),
                Amount: payload.amount,
                TransactionTypeId: transactionType.id,
                ApplicationId: application.id,
                ReferenceID: payload.referenceId,
            };
            let currentTransaction = await this.transaction.CreateTransaction(transactPayload);
            //post request data
            await this.requestResponse.CreateRequestResponse(true, currentTransaction.id, processors[0].ProcessorId, payload); // create request
            this.Processor = await this.SwitchProcessor(processors[0].Name); // fetch processor
            let result = await this.Processor.MakeFundTransfer(payload); //make fund transactions
            processors.shift();
            if (!result) { //first attempt failed
                //post response data
                await this.requestResponse.CreateRequestResponse(false, currentTransaction.id, processors[0].id, result);
                if (processors.length > 0) {
                    this.Processor = await this.SwitchProcessor(processors[0].Name); // fetch processor
                    result = await this.Processor.MakeFundTransfer(payload); //make fund transactions
                }
            }
            //post response data
            await this.requestResponse.CreateRequestResponse(false, currentTransaction.id, processors[0].id, result);
            let updateTransaction = {
                ProcessedAt: result.ProcessedAt,
                Status: result.act_code
            };
            return await this.transaction.UpdateTransactionStatus(currentTransaction.SessionID, updateTransaction);
        }
        catch (error) {
            console.log('error:', error); //TODO: take this log off
            throw error;
        }
        finally {
            //send callback here
        }
    }
    async GetTransactionDetails(transactionRef) {
        try {
            if (!transactionRef)
                throw await this.error.CustomError(error_1.ErrorEnum[403], "Transaction Reference is invalid");
            let transaction = await this.transaction.GetTransaction(transactionRef);
            delete transaction.id;
            return transaction;
        }
        catch (error) {
            throw error;
        }
    }
    // async SendMoney(payload):Promise
    async SwitchProcessor(processorName) {
        try {
            switch (processorName) {
                case "GIP":
                    console.log("In Swith "); //TODO: take this log off
                    return new GIPService_1.default();
                    break;
                default:
                    console.log("In Swith default"); //TODO: take this log off
                    throw await this.error.CustomError(error_1.ErrorEnum[400], "Ran out of processors");
                    break;
            }
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = CoreService;
//# sourceMappingURL=CoreService.js.map