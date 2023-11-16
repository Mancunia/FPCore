import { SERVER_ENV } from "../utilities/env";
import Transaction from "./models/TransactionsModel";//transactions model
import Application from "./models/ApplicationsModel";//applications model
import Processor from "./models/ProcessorsModel";//processors model
import ProcessorMapping from "./models/ProcessorMappingModel";//processor mapping model
import RequestResponse from "./models/RequestResponseModel";//request response model
import TransactionType from "./models/TransactionTypes";

const isDev = SERVER_ENV == "development";

const dbInit =() => {
    try {
        Processor.sync({alter: isDev})
        Application.sync({alter: isDev})
        ProcessorMapping.sync({alter: isDev})
        RequestResponse.sync({alter: isDev})
        Transaction.sync({alter: isDev})
        TransactionType.sync({alter: isDev})
    } catch (error) {
        throw new Error(error);
    }
}

export default dbInit