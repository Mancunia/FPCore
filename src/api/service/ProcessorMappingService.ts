import ProcessorMappingRepository from "../../db/repository/ProcessorMappingRepository";
import { ProcessorMappingIn,ProcessorMappingOut } from "../../db/models/ProcessorMappingModel";
import ApplicationService from "./ApplicationService";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";

class ProcessorMappingService{
    private Repo: ProcessorMappingRepository;
    private appService: ApplicationService;
    private error: ErrorHandler;

    constructor() {
        this.Repo = new ProcessorMappingRepository()
        this.error = new ErrorHandler()
        this.appService = new ApplicationService()
    }

    async GetAllProcessorsForApp(app:string,type:string = "BOTH"): Promise<any[]>{
        try {

            if(!app)throw await this.error.CustomError(ErrorEnum[403],"Application ID is undefined")

            let appId = (await this.appService.GetApplication(app))?.id//get application id from application table
            

            let processors = await this.Repo.getProcessorsMappedToApp(appId,type)//find all processors

            return processors
            
        } catch (error) {
            throw error
        }
    }

    async CreateProcessorMapping(payload:ProcessorMappingIn):Promise<ProcessorMappingOut>{
        try {
            if(!payload.ApplicationId||!payload.ProcessorId) throw await this.error.CustomError(ErrorEnum[403],"Some essential information is missing")

            payload.ApplicationId = (await this.appService.GetApplication(String(payload.ApplicationId))).id//get application id from application table
            payload.ProcessorId = Number(payload.ProcessorId)
            let mapping = await this.Repo.createProcessorMapping(payload)

            console.log("Processor", mapping)

            return mapping
        } catch (error) {
            console.log("Error here:",error)
            throw error
        }
    }
}

export default ProcessorMappingService