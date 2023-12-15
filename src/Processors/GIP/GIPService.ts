import { NameEnquiryRequestData,BalanceEnquiryRequestData, FundTransferRequestData, GIPNameEnquiryResponseData } from "./DTO";
import { NameEnquiry,FundTransfer } from "..";
import GIP_Processor from "./GIPRepository";

// import TransactionService from "../../api/service/TransactionService";

import { ProcessorsService } from "..";
import HELPER from "../../utilities/helper";
import ErrorHandler,{ ErrorEnum } from "../../utilities/error";
import ThreadPool from "../../utilities/workerThreads";

enum FUNCTIONCODES {
    "Name Enquiry For Credit" = 230,
    "Name Enquiry For dedit" = 231,
    "Fund Transfer For Credit" = 240,
    "Fund Transfer For Debit" = 241,
    "OTP request before Debit" = 242,
    "Balance Enquiry" = 250,
    "Transaction Status Check" = 111
}

enum CHANNELCODES {
    "Mobile Phones" = 300,
    "Bank Tellers" = 100
}





class GIP_Service implements ProcessorsService {

    private final: string
    ProcessorName: "GIP";
    LogFile: string = "/ghipps.log";
    private Repo : GIP_Processor
    private errorHandler: ErrorHandler
    private workers:ThreadPool

    // private transactions:TransactionService

    constructor(){
        this.Repo = new GIP_Processor()
        this.errorHandler = new ErrorHandler()
        this.workers = new ThreadPool(4)
        // this.transactions = new TransactionService()
    }

    /*
    1. Check recipient details
    2. check for account type
    3. Send request
    4. Handle and filter response
    5. send response
    */
    async MakeNameEnquiry (payload:NameEnquiry): Promise<string> {
        let body:NameEnquiryRequestData
        let {recipientName,recipientAccount,accountType,bankMobileCode} = payload
        try {
            // TODO: create name enquiry service for GIP service
            //1. Check recipient details
            if (!recipientName || !recipientAccount || !bankMobileCode) throw {code:ErrorEnum[403],message:"Some details are missing"}

            //2. Check for account type
             await HELPER.logger(`ATTEMPTING Name Enquiry: @${HELPER.getDate()} - payload: ${JSON.stringify(payload)} `,this.LogFile)

            //make body
            body={
                amount:'000000000000',
                date: HELPER.getDate(),
                function_code: FUNCTIONCODES["Name Enquiry For Credit"],
                desitination_bank:String(bankMobileCode),
                session_id: await HELPER.GENERATE_UUID(),
                channel_code: String(accountType == "MOBILE" ? CHANNELCODES["Mobile Phones"] : CHANNELCODES["Bank Tellers"]),
                account_to_credit:recipientAccount,
                narration:"Name Enquiry For Credit",
                tracking_trace:"use Helper.getUUID() method"
            }

            let response = await this.Repo.NameEnquiry(body)

            return response.name_to_credit //return name to credit information from response object

        } catch (error) {
            this.final= `Error: @ ${HELPER.getDate()} - ${error.message} payload: ${JSON.stringify(payload)}`
           await this.ErrorSwitch(error,"Something went wrong when getting name information")


        }
        finally {
            await HELPER.logger(this.final,this.LogFile)
            this.final = null
        }
    }

    /*
    1. Check transaction details
    2. send request
    3. handle and filter response
    4. send response
    */
    async MakeFundTransfer(payload:FundTransfer): Promise<object> {
        let body:FundTransferRequestData
        let {senderName,amount,recipientName,recipientAccount,accountType,bankMobileCode,narration,referenceId}=payload
        try {
            //Check transaction details
            if(!senderName || !recipientName || !amount || !recipientAccount || !accountType|| !referenceId) throw {code:ErrorEnum[403],message:"Some essential data was not passed"};

             //2. log transaction details
             await HELPER.logger(`ATTEMPTING Fund transfer: @${HELPER.getDate()} - payload: ${JSON.stringify(payload)} `,this.LogFile)

            //Make body
            body = {
                amount:(String(amount)).padStart(12, "0"),
                account_to_credit:recipientAccount,
                date: HELPER.getDate(),
                tracking_trace: referenceId,
                function_code:FUNCTIONCODES['Fund Transfer For Credit'],
                desitination_bank:String(bankMobileCode),
                session_id:"session",
                channel_code:String(accountType == "MOBILE" ? CHANNELCODES["Mobile Phones"] : CHANNELCODES["Bank Tellers"]),
                narration:narration
            }

            //request sent
            let response = await this.Repo.FundTransfer(body)

            response.act_code = response.act_code == "300" ? "Processed" : "Failed"
            return response
            
            
        } catch (error) {
            this.final= `Error: @ ${HELPER.getDate()} - payload: ${JSON.stringify(payload)} ${error.message} `
           console.error("error:",error)//TODO: take this log off

            if(error =="909"){
              

                     setTimeout(() =>{

                     body.function_code = FUNCTIONCODES["Transaction Status Check"]
                       
                    this.workers.submitTask(this.CheckTransactionStatus(body))
                      
                },50000)

                }
               
               
            
           throw await this.ErrorSwitch(error,"Something went wrong while make transfer");
        }
        finally{
            await HELPER.logger(this.final,this.LogFile)
            this.final = null
        }
    }



    GetBalanceEnquiry():Promise<any> {

        return 
    };
   
    ReverseTransaction():Promise<any> {
        return
    }

   async  CheckTransactionStatus(payload:FundTransferRequestData):Promise<any> {
       try {
        let response = await this.Repo.FundTransfer(payload)

            return response
        
       } catch (error) {
            throw error
       }
    };
   

    async CheckProcessorStatus():Promise<boolean>{

        return await false
    }


    private async ErrorSwitch(code:number|string|Error,defaultMessage:string ="Invalid"){
        switch (code) {
            case "100":
                throw await this.errorHandler.CustomError(ErrorEnum[403],"Invalid SOAP envelope")
            case "306":    
            throw await this.errorHandler.CustomError(ErrorEnum[403],"Invalid SOAP envelope")
            
            case "400":
             throw await this.errorHandler.CustomError(ErrorEnum[400],"Something happened")
                
            default:
                throw code
             
           }
    }
}

export default GIP_Service