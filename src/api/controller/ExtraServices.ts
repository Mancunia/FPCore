import { Request,Response } from "express";
import ApplicationService from "../service/ApplicationService";
import ProcessorService from "../service/ProcessorService";
import ProcessorMappingService from "../service/ProcessorMappingService";
import TransactionTypeService from "../service/TransactionType";
import ErrorHandler from "../../utilities/error";

const errorHandler = new ErrorHandler()
const Application = new ApplicationService()
const Processor = new ProcessorService()
const ProcessorMapping = new ProcessorMappingService()
const TransactionType = new TransactionTypeService()

class ExtraServiceController {

    async CreateApplication(req: Request, res: Response){
        try {
            console.log(req.body)
            let body = req.body

            let app = await Application.CreateApplication(body)
            
            res.status(201).json(app)
        } catch (error) {
            let errors:[number,string,string?] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async CreateProcessor(req: Request, res: Response){
        try {
            console.log(req.body)
            let body = req.body

            let app = await Processor.CreateProcessor(body)
            
            res.status(201).json(app)
        } catch (error) {
            let errors:[number,string,string?] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
    async CreateProcessorMapping(req: Request, res: Response){
        try {
            console.log(req.body)
            let body = req.body

            let app = await ProcessorMapping.CreateProcessorMapping(body)
            
            res.status(201).json(app)
        } catch (error) {
            let errors:[number,string,string?] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetAllProcessorsMapped(req: Request, res: Response){
        try {
            let app = await ProcessorMapping.GetAllProcessorsForApp(res.locals.appToken)

            res.status(200).json(app)
        } catch (error) {
            console.log(error)
            let errors:[number,string,string?] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetAllApplications(req: Request, res: Response){
        try {
            let app =await Application.GetAllApplication()
            res.status(200).json(app)

        } catch (error) {
            let errors:[number,string,string?] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async CreatTransactionType(req: Request, res: Response){
        try {
            let type = await TransactionType.CreateTransactionType(req.body)

            res.status(200).json(type)
            
        } catch (error) {
            let errors:[number,string,string?] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
}

export default ExtraServiceController