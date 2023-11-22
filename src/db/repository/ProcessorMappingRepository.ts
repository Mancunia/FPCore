import ProcessorMapping,{ProcessorMappingIn,ProcessorMappingOut} from "../models/ProcessorMappingModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";
import { Op } from "sequelize";

interface ProcessorMappingRepositoryInterface {
    createProcessorMapping:(payload:ProcessorMappingIn)=>Promise<ProcessorMappingOut>;
    getAllProcessorMappings():Promise<ProcessorMapping[]>;
    getAllProcessorMappingsByApp_Processor(id:string|number,forApp:boolean):Promise<ProcessorMappingOut[]>
    getProcessorsMappedToApp:(appId:string|number,processes?:string)=>Promise<any[]>//TODO: complete repo function to join ProcessorsMapping to processor to fetch all processors mapped to an app
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
             

            if(processorMapping.length > 0) throw await this.error.CustomError(ErrorEnum[401],"ProcessorMapping already exists")

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


    //----------------------------------------------------------------get processors by mapped to apps --------------------------------
    async getProcessorsMappedToApp(appId:number|string,processes:string):Promise<any[]>{
        try {
            // let processors = await ProcessorMapping.findAll({where:{ApplicationId:appId},include:Processor})
            let fields = ["m.ApplicationId", "m.ProcessorId","p.Name","p.Processes"]
            let query:string
            console.log("Processes:",processes)
            switch (processes.toUpperCase()) {
                case "MOBILE":
                    query = `
                    Select ${fields} from ProcessorMappings m join Processors p on p.id=m.ProcessorId 
                    where m.ApplicationId = ${appId} and p.Processes = 'MOBILE' or p.Processes = 'BOTH'
                    and m.DeactivatedAt IS Null and p.DeactivatedAt IS Null and m.deletedAt IS NULL and p.deletedAt IS NULL ORDER BY m.CreatedAt desc;
                    `
                    break;
                case "BANK":
                query = `
                Select ${fields} from ProcessorMappings m join Processors p on p.id=m.ProcessorId 
                where m.ApplicationId = ${appId} and p.Processes = 'BANK' or p.Processes = 'BOTH'
                and m.DeactivatedAt IS Null and p.DeactivatedAt IS Null and m.deletedAt IS NULL and p.deletedAt IS NULL ORDER BY m.CreatedAt desc;
                `
                break;
            
                default:
                    console.log("query:default")
                query = `
                Select ${fields} from ProcessorMappings m join Processors p on p.id=m.ProcessorId 
                where m.ApplicationId = ${appId} 
                and m.DeactivatedAt IS Null and p.DeactivatedAt IS Null and m.deletedAt IS NULL and p.deletedAt IS NULL ORDER BY m.CreatedAt desc;
                `
                    break;
            }

            let processors = await ProcessorMapping.sequelize.query(query)
            
            if(!processors) throw this.error.CustomError(ErrorEnum[401],"No processors found for app")

            return processors[0]

        } catch (error) {
            throw error
            
        }
    }
}

export default ProcessorMappingRepository