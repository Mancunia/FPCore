"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TransactionsModel_1 = __importDefault(require("./models/TransactionsModel")); //transactions model
const ApplicationsModel_1 = __importDefault(require("./models/ApplicationsModel")); //applications model
const ProcessorsModel_1 = __importDefault(require("./models/ProcessorsModel")); //processors model
const ProcessorMappingModel_1 = __importDefault(require("./models/ProcessorMappingModel")); //processor mapping model
const RequestResponseModel_1 = __importDefault(require("./models/RequestResponseModel")); //request response model
const TransactionTypes_1 = __importDefault(require("./models/TransactionTypes"));
const isDev = process.env.NODE_ENV == "development";
const dbInit = () => {
    try {
        ProcessorsModel_1.default.sync({ alter: isDev });
        ApplicationsModel_1.default.sync({ alter: isDev });
        ProcessorMappingModel_1.default.sync({ alter: isDev });
        RequestResponseModel_1.default.sync({ alter: isDev });
        TransactionsModel_1.default.sync({ alter: isDev });
        TransactionTypes_1.default.sync({ alter: isDev });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.default = dbInit;
//# sourceMappingURL=init.js.map