import ApplicationRepository from "../../db/repository/ApplicationsRepository";
import { ApplicationIn,ApplicationOut } from "../../db/models/ApplicationsModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";
import HELPER from "../../utilities/helper";


class ApplicationService{
    private repo: ApplicationRepository;
    private error: ErrorHandler;

    constructor() {
        this.repo = new ApplicationRepository()
        this.error = new ErrorHandler()
    }

    async CreateApplication(application: ApplicationIn) {
        try {
            console.log("Creating application")
            if(!application.Name) throw await this.error.CustomError(ErrorEnum[403],"Application details not provided")
            if(!application.Token){
                application.Token = await HELPER.GENERATE_UUID()
            }
            application.Token = await HELPER.ENCODE_Token(application.Token)
            let app = await this.repo.createApplication(application);

            return app
        } catch (error) {
            throw error
        }
    }

    async GetApplication(application: string): Promise<ApplicationOut> {
        try {
            if(!application) throw await this.error.CustomError(ErrorEnum[403],"Application ID not provided")
            let app = await this.repo.getApplicationById(application)
            return app
            
        } catch (error) {
            throw error
        }
    }
}

export default ApplicationService

