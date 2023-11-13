import GIP_Service from "../../Processors/GIP/GIPService"
import ErrorHandler,{ ErrorEnum } from "../../utilities/error"

const ERROR = new ErrorHandler()
class CoreService {
     
    private GIP:GIP_Service

    constructor(){
        this.GIP = new GIP_Service()
    }

    // let {recipientName,recipientAccount,accountType,bankModileCode} = payload
    async MakeNameEnquiry(recipientName,recipientAccount,accountType,bankMobileCode): Promise<string> {
        try {
            if (!recipientName || !recipientAccount || !bankMobileCode || !accountType) throw {code:ErrorEnum[403],message:"Some details are missing"}
            
            let result = await this.GIP.MakeNameEnquiry({recipientName,recipientAccount,accountType,bankMobileCode})

            return result

        } catch (error) {
            console.log("in Service Core",error)
             let {errorCode, message} = error

            throw await ERROR.HandleError(errorCode, message)
        }
        finally{

        }
    }


}

export default CoreService