import { NameEnquiryRequestData,BalanceEnquiryRequestData, FundTransferRequestData, GIPNameEnquiryResponseData } from "./DTO";
import { NameEnquiry,FundTransfer } from "..";
import GIP_Processor from "./GIPRepository";
import { ProcessorsService } from "..";
import HELPER from "../../utilities/helper";
import ErrorHandler,{ ErrorEnum } from "../../utilities/error";


enum FUNCTIONCODES {
    "Name Enquiry For Credit" = 230,
    "Name Enquiry For dedit" = 231,
    "Fund Transfer For Credit" = 240,
    "Fund Transfer For Debit" = 241,
    "OTP request before Debit" = 242,
    "Balance Enquiry" = 250
}

enum CHANNELCODES {
    "Mobile Phones" = 300,
    "Bank Tellers" = 100
}

let ERROR = new ErrorHandler()



class GIP_Service implements ProcessorsService {

    private final: string
    ProcessorName: "GIP";
    LogFile: string = "/logs/ghipps.log";
    private Repo : GIP_Processor

    constructor(){
        this.Repo = new GIP_Processor()
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
            //  await HELPER.logger(`ATTEMPTING Name Enquiry: payload: ${JSON.stringify(payload)} `,this.LogFile)

            //make body
            body={
                amount:'000000000000',
                date: HELPER.getDate(),
                function_code: FUNCTIONCODES["Name Enquiry For Credit"],
                desitination_bank:String(bankMobileCode),
                session_id: "use Helper.getUUID() method",
                channel_code: String(accountType == "MOBILE" ? CHANNELCODES["Mobile Phones"] : CHANNELCODES["Bank Tellers"]),
                account_to_credit:recipientAccount,
                narration:"Name Enquiry For Credit",
                tracking_trace:"use Helper.getUUID() method"
            }

            let response = await this.Repo.NameEnquiry(body)

            return response.name_to_credit //return name to credit information from response object

        } catch (error) {
            this.final = `ERROR: ${error.message}, `

            throw await ERROR.CustomError(error, "Error getting recipient information")


        }
        finally {
            // await HELPER.logger(this.final,this.LogFile)
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
        let {senderName,amount,recipientName,recipientAccount,accountType,bankMobileCode,narration}=payload
        try {
            //Check transaction details
            if(!senderName || !recipientName || !amount || !recipientAccount || !accountType) throw {code:ErrorEnum[403],message:"Some essential data was not passed"};

            //Make body
            body = {
                amount:(String(amount)).padStart(12, "0"),
                account_to_credit:recipientAccount,
                date: HELPER.getDate(),
                tracking_trace:"use Helper.getUUID() method",
                function_code:FUNCTIONCODES['Fund Transfer For Credit'],
                desitination_bank:String(bankMobileCode),
                session_id:"session",
                channel_code:String(accountType == "MOBILE" ? CHANNELCODES["Mobile Phones"] : CHANNELCODES["Bank Tellers"]),
                narration:narration
            }

            //request sent
            let response = await this.Repo.FundTransfer(body)

            return response
            
            
        } catch (error) {
            let [code, message, extra] = error

            throw ERROR.HandleError(code, extra)
        }
        finally{

        }
    }



    GetBalanceEnquiry():Promise<any> {

        return 
    };
   
    ReverseTransaction():Promise<any> {
        return
    }

    CheckTransactionStatus?: any;
   

    async CheckProcessorStatus():Promise<boolean>{

        return await false
    }

}

export default GIP_Service