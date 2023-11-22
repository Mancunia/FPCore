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
            console.log("In Core_NameEnquiry")
            if (!payload.recipientName || !payload.recipientAccount || !payload.bankMobileCode || !payload.accountType) throw {code:ErrorEnum[403],message:"Some details are missing"}

            let processors = await this.mappings.GetAllProcessorsForApp(app,payload.accountType)
            console.log("Processors:", processors)

            while(processors.length > 0) {
                console.log("In CORE_while")
                this.Processor = await this.SwitchProcessor(processors[0].Name)
                try {
                    console.log("ProcessorName:",this.Processor)
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

}

export default SendMoneyService