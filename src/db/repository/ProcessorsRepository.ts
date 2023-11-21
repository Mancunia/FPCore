import Processor,{ProcessorIn,ProcessorOut} from "../models/ProcessorsModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";

interface ProcessorRepositoryInterface{
    createProcessor:(payload:ProcessorIn)=>Promise<ProcessorOut>;
    getProcessorByName:(processorName:string)=>Promise<ProcessorOut>;
    getAllProcessors:()=>Promise<ProcessorOut[]>;
}

class ProcessorRepository implements ProcessorRepositoryInterface{

    private error:ErrorHandler

    constructor(){
        this.error = new ErrorHandler()
    }
    getAllProcessors: () => Promise<ProcessorOut[]>;

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
    async getAllProcessorsByApp():Promise<ProcessorOut[]>{
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


}


export default ProcessorRepository