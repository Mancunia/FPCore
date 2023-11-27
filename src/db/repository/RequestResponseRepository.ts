import RequestResponse,{RequestResponseIn,RequestResponseOut} from "../models/RequestResponseModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";


interface RequestResponseInterface{
    createResponseRequest:(payload:RequestResponseIn)=>Promise<RequestResponseOut>;
}

class RequestResponseRepository implements RequestResponseInterface{
    private error:ErrorHandler;

    constructor() {
        this.error = new ErrorHandler()
    }

    //---------------------------------------------------------------- Create a new Request/Response record --------------------------------
    async createResponseRequest(payload:RequestResponseIn):Promise<RequestResponseOut>{
        try {
            let record = await RequestResponse.create(payload)
            return record
        } catch (error) {
            throw error
            
        }
    }
}

export default RequestResponseRepository