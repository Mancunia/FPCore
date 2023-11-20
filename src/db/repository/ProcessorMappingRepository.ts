import ProcessorMapping,{ProcessorMappingIn,ProcessorMappingOut} from "../models/ProcessorMappingModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";
import { Op } from "sequelize";

interface ProcessorMappingRepositoryInterface {
    createProcessorMapping:(payload:ProcessorMappingIn)=>Promise<ProcessorMappingOut>;
    getAllProcessorMappings():Promise<ProcessorMapping[]>;
    getAllProcessorMappingsByApp_Processor(id:string|number,forApp:boolean):Promise<ProcessorMappingOut[]>
}

class ProcessorMappingRepository implements ProcessorMappingRepositoryInterface{
    private error:ErrorHandler;
    constructor() {
        this.error = new ErrorHandler()
    }

    //---------------------------------------------------------------- Create ProcessorMapping --------------------------------
    async createProcessorMapping(payload:ProcessorMappingIn):Promise<ProcessorMappingOut> {
        try {
            let processorMapping = await ProcessorMapping.findAll({
                where: {
                  [Op.and]: [
                    { ApplicationId: payload.ApplicationId },
                     { ProcessorId: payload.ProcessorId }
                    ]
                }
            }) 
            if(processorMapping) throw await this.error.CustomError(ErrorEnum[401],"ProcessorMapping already exists")

            let mapping = await ProcessorMapping.create(payload)

            return mapping

            
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw await this.error.CustomError(ErrorEnum[401],`This mapping has already been done`)
                }
                else if(error.message == "ProcessorMapping already exists"){
                    throw error
                }
                else{
                    throw await this.error.CustomError(ErrorEnum[400],"Error creating Processor")
                }
                
        }
    }

    //---------------------------------------------------------------- get all processors mappings ----------------------------------------------------------------
    async getAllProcessorMappings(): Promise<ProcessorMapping[]> {
        try {
            let mappings = await ProcessorMapping.findAll()
            if(!mappings) throw await this.error.CustomError(ErrorEnum[404],"No mapping found")

            return mappings
        } catch (error) {
            throw error
        }    
    }

    //-------------------------------------------------------------------- get mapping by app or processor name ----------------------------------------------------------------
    async getAllProcessorMappingsByApp_Processor(id: string | number,forApp:boolean = true): Promise<ProcessorMappingOut[]> {
        let mappings: ProcessorMappingOut[]
        try {
            if(!forApp){
                mappings = await ProcessorMapping.findAll({where:{ApplicationId:id}})
                if(!mappings) throw this.error.CustomError(ErrorEnum[404],"No mapping found for this application")
            }else{
            mappings = await ProcessorMapping.findAll({where:{ProcessorId:id}})
                if(!mappings) throw this.error.CustomError(ErrorEnum[404],"No mapping found for this application")
        }

        return mappings

        } catch (error) {
            throw error
        }
    }
}

export default ProcessorMappingRepository