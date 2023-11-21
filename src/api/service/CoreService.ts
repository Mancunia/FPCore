import GIP_Service from "../../Processors/GIP/GIPService"
import ErrorHandler,{ ErrorEnum } from "../../utilities/error"
import { ProcessorsService,NameEnquiry } from "../../Processors"

import ProcessorMappingService from "./ProcessorMappingService"

const ERROR = new ErrorHandler()

interface TransactionInterfacePayload{
    
}


class SendMoneyService {
     
    private Processor:ProcessorsService
    private mappings: ProcessorMappingService


    private error:ErrorHandler

    constructor(){
        // this.Processor = new GIP_Service()
        this.mappings = new ProcessorMappingService()
        this.error = new ErrorHandler()

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
            if (!payload.recipientName || !payload.recipientAccount || !payload.bankMobileCode || !payload.accountType) throw {code:ErrorEnum[403],message:"Some details are missing"}

            let processors = await this.mappings.GetAllProcessorsForApp(app)

            while(processors.length > 0) {
                this.Processor = processors[0]
                try {
                    let result = await this.Processor.MakeNameEnquiry(payload)
                    if(result){
                        return result
                    }
                    else{
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



    // async SendMoney(payload):Promise

}

export default SendMoneyService