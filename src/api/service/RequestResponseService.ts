import RequestResponseRepository from "../../db/repository/RequestResponseRepository";
import { RequestResponseIn,RequestResponseOut } from "../../db/models/RequestResponseModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";


class RequestResponseService{
    private repo: RequestResponseRepository;
    private error: ErrorHandler

    constructor() {
        this.repo = new RequestResponseRepository()
        this.error = new ErrorHandler()
    }

    async CreateRequestResponse(isRequest:boolean,transactionID:number,processorID:number,payload:any):Promise<RequestResponseOut> {
        try {
            let request:RequestResponseIn = {
                TransactionId: transactionID,
                ProcessorId: processorID,
                Payload: JSON.stringify(payload),
                Type:isRequest ? "Request" : "Response"
            }
            let response = await this.repo.createResponseRequest(request)
            return response
        } catch (error) {
            throw error
        }
    }
}

export default RequestResponseService