import ProcessorsRepository from "../../db/repository/ProcessorsRepository";
import { ProcessorIn,ProcessorOut } from "../../db/models/ProcessorsModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";


class ProcessorService{
    private repo:ProcessorsRepository
    private error:ErrorHandler

    constructor() {
        this.repo = new ProcessorsRepository()
        this.error = new ErrorHandler()
        
    }

    async CreateProcessor(processor:ProcessorIn):Promise<ProcessorOut> {
        try {
            if(!processor.Name) throw await this.error.CustomError(ErrorEnum[403],"Processor name must be provided")
            let process = await this.repo.createProcessor(processor)

            return process
        } catch (error) {
            throw error
        }
    }
}

export default ProcessorService