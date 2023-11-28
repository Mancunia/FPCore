import GIP_Service from "../../Processors/GIP/GIPService"
import ErrorHandler,{ ErrorEnum } from "../../utilities/error"
import HELPER from "../../utilities/helper"

import { ProcessorsService,NameEnquiry,FundTransfer } from "../../Processors"

import ProcessorMappingService from "./ProcessorMappingService"
import TransactionTypeService from "./TransactionType"
import TransactionService from "./TransactionService"
import ApplicationService from "./ApplicationService"
import RequestResponseService from "./RequestResponseService"

const ERROR = new ErrorHandler()

interface TransactionInterfacePayload{
    
}


class SendMoneyService {
     
    private Processor:ProcessorsService
    private mappings: ProcessorMappingService
    private transactionType:TransactionTypeService
    private transaction:TransactionService
    private application:ApplicationService
    private requestResponse:RequestResponseService


    private error:ErrorHandler

    constructor(){
        // this.Processor = new GIP_Service()
        this.mappings = new ProcessorMappingService()
        this.error = new ErrorHandler()
        this.transactionType = new TransactionTypeService()
        this.transaction = new TransactionService()
        this.application = new ApplicationService()
        this.requestResponse = new RequestResponseService()

    }

    // let {recipientName,recipientAccount,accountType,bankModileCode} = payload
    /*
    0.get processors
    1.check if processors are available
    2.create instance of processor at index 0
    3.perform transaction
    3.1.if fails
    */
    async MakeNameEnquiry(app:string, payload:NameEnquiry): Promise<string> {
        try {
            if (!payload.recipientName || !payload.recipientAccount || !payload.bankMobileCode || !payload.accountType) throw this.error.CustomError(ErrorEnum[403],"Some details are missing")

            let processors = await this.mappings.GetAllProcessorsForApp(app,payload.accountType)

            while(processors.length > 0) {
                this.Processor = await this.SwitchProcessor(processors[0].Name)
                try {
                    console.log("ProcessorName:",this.Processor)
                    let result = await this.Processor.MakeNameEnquiry(payload)
                    if(result){
                        return result
                    }
                    else{//Transaction failed to process, eject current processor and restart process
                        console.log('Transaction processing failed. Trying next processor...');
                        processors.shift(); // Remove the failed processor 
                    }
                } catch (error) {
                    throw error
                }
            }
             
            // if(processors.length === 0) throw await this.error.CustomError(ErrorEnum[403],"App run out of processors")
            // return result

        } catch (error) {
            console.log("in Service Core",error)
             let {errorCode, message} = error

            throw await ERROR.HandleError(errorCode, message)
        }
        finally{

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
    async MakeFundTransfer(app:string, payload:FundTransfer):Promise<any>{
        try {
            let transactionType = await this.transactionType.GetTransactionTypeByName(payload.accountType.toUpperCase())
            let application = await this.application.GetApplication(app)
            let processors = await this.mappings.GetAllProcessorsForApp(app,payload.accountType.toUpperCase())

            if(payload.amount < transactionType.MinAmount || payload.amount > transactionType.MaxAmount) {
                throw await this.error.CustomError(ErrorEnum[403],"Sending Amount is not a valid amount")//check for amount validity
            }
            //create transaction
            let transactPayload = {
                SessionID: await HELPER.GENERATE_UUID(),
                Amount: payload.amount,
                TransactionTypeId: transactionType.id,
                ApplicationId: application.id,
                ReferenceID:payload.referenceId,
            }
            let currentTransaction = await this.transaction.CreateTransaction(transactPayload)

            while(processors.length > 0) {
                this.Processor = await this.SwitchProcessor(processors[0].Name)
                try {
                    //post request data
                    await this.requestResponse.CreateRequestResponse(true,currentTransaction.id,processors[0].ProcessorId,payload)
                    let result = await this.Processor.MakeFundTransfer(payload)
                    if(result){
                        //post response data
                        await this.requestResponse.CreateRequestResponse(false,currentTransaction.id,processors[0].id,result)

                        //get details from processor
                        let updateTransaction = {
                            ProcessedAt:result.ProcessedAt,
                            Status:result.act_code

                        }

                    return await this.transaction.UpdateTransactionStatus(currentTransaction.SessionID,updateTransaction)
                    
                    }
                    else{//Transaction failed to process, eject current processor and restart process
                        if(processors.length == 0){
                             //get details from processor
                        let updateTransaction = {
                            ProcessedAt:result.ProcessedAt || "Failed",
                            Status:result.act_code

                        }

                    return await this.transaction.UpdateTransactionStatus(currentTransaction.SessionID,updateTransaction)
                        }
                        processors.shift(); // Remove the failed processor 
                    }
                    await this.requestResponse.CreateRequestResponse(false,currentTransaction.id,processors[0].id,result)
                } catch (error) {
                    throw error
                }
            }

            
        } catch (error) {
            console.log('error:',error)
            throw error
        }
        finally {
            //send callback here
        }

    }

    async GetTransactionDetails(transactionRef: string):Promise<any> {
        try {
            if(!transactionRef) throw await this.error.CustomError(ErrorEnum[403],"Transaction Reference is invalid");

            let transaction =  await this.transaction.GetTransaction(transactionRef);

            delete transaction.id
            
            return transaction
            
        } catch (error) {
            throw error
        }
    }




    // async SendMoney(payload):Promise


    async SwitchProcessor(processorName: string):Promise<ProcessorsService> {
        try {
            switch (processorName) {
                case "GIP":
                    console.log("In Swith ")
                    return new GIP_Service()
                    break;
            
                default:
                    console.log("In Swith default")
                    throw await this.error.CustomError(ErrorEnum[400],"Ran out of processors")
                    break;
            }
            
        } catch (error) {
            throw error
        }
    }


    // async SendCallBack(callBackName: string,

}

export default SendMoneyService