import Application,{ApplicationIn,ApplicationOut} from "../models/ApplicationsModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";

interface ApplicationRepositoryInterface {
    createApplication: (payload: ApplicationIn) =>Promise<ApplicationOut>;
    getApplicationById: (applicationId:string|number) =>Promise<ApplicationOut>;
    getAllApplications:() => Promise<ApplicationOut[]>;
}

class ApplicationRepository implements ApplicationRepositoryInterface{
    private error: ErrorHandler;

    constructor() {
        this.error = new ErrorHandler()
    }

    //------------------------------------------------------- Create Application --------------------------------
    async createApplication(payload: ApplicationIn): Promise<ApplicationOut> {
        try {
            let application = await Application.create(payload)

            return application
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw await this.error.CustomError(ErrorEnum[401],`Application with name: ${payload.Name} exist's already`)
                }
                throw await this.error.CustomError(ErrorEnum[400],"Error creating Processor")
                   
        }
    }

    //-------------------------------------------------------get application by Id -------------------------------------
    async getApplicationById(applicationId: string|number):Promise<ApplicationOut>{
        try {
            let application = Application.findOne({where:{Token:applicationId}})
            if(!application) throw this.error.CustomError(ErrorEnum[404],"Application not found")

            return application
            
        } catch (error) {
            throw error
        }
    }

    //----------------------------------------------------------get applications -----------------------------------------
    async getAllApplications():Promise<ApplicationOut[]>{
        try {
            let applications = await Application.findAll()

            if(!applications) throw await this.error.CustomError(ErrorEnum[404],"Application not found")

            return applications
            
        } catch (error) {
            throw error
        }
    }
}


export default ApplicationRepository