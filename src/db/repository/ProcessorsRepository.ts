import Processor,{ProcessorIn,ProcessorOut} from "../models/ProcessorsModel";
import ProcessorMapping from "../models/ProcessorMappingModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";

interface ProcessorRepositoryInterface{
    createProcessor:(payload:ProcessorIn)=>Promise<ProcessorOut>;
    getProcessorByName:(processorName:string)=>Promise<ProcessorOut>;
    getAllProcessors:()=>Promise<ProcessorOut[]>;
    getProcessorsMappedToApp:(appId:string|number)=>Promise<any[]>//TODO: complete repo function to join ProcessorsMapping to processor to fetch all processors mapped to an app
}

class ProcessorRepository implements ProcessorRepositoryInterface{

    private error:ErrorHandler

    constructor(){
        this.error = new ErrorHandler()
    }

    //---------------------------------------------------------------- Create Processor --------------------------------
    async createProcessor(payload:ProcessorIn):Promise<ProcessorOut>{
        try {
            let processor = await Processor.create(payload);
            return processor
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw await this.error.CustomError(ErrorEnum[401],`Processor with name: ${payload.Name} exist's already`)
                }
                throw await this.error.CustomError(ErrorEnum[400],"Error creating Processor")
            
        }
    }


    //---------------------------------------------------------------- get all Processors --------------------------------
    async getAllProcessors():Promise<ProcessorOut[]>{
        try {
            let processors = await Processor.findAll()
            if(!processors) throw this.error.CustomError(ErrorEnum[404],"No proceessors found")
            return processors
        } catch (error) {
            throw error
        }
    }

    //----------------------------------------------------------------get a processor by name ---------------------------------
    async getProcessorByName(processorName:string):Promise<ProcessorOut>{
        try {
            let processor = await Processor.findOne({where:{Name:processorName}})
            if(!processor) throw this.error.CustomError(ErrorEnum[404],"No proceessors found")

            return processor
        } catch (error) {
            throw error
        }
    }


    //----------------------------------------------------------------get processors by mapped to apps --------------------------------
    async getProcessorsMappedToApp(appId:number|string):Promise<any[]>{
        try {
            let processors = await ProcessorMapping.findAll({where:{ApplicationId:appId},include:Processor})
            if(!processors) throw this.error.CustomError(ErrorEnum[401],"No processors found for app")

            return processors

        } catch (error) {
            throw error
            
        }
    }
}


export default ProcessorRepository