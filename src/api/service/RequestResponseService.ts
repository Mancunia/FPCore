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

    async CreateRequestResponse(request: RequestResponseIn):Promise<RequestResponseOut> {
        try {
            let response = await this.repo.createResponseRequest(request)
            return response
        } catch (error) {
            throw error
        }
    }
}

export default RequestResponseService