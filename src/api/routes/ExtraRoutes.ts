import { Router } from "express";
import ExtraServiceController from "../controller/ExtraServices";

const router = Router();
const controller = new ExtraServiceController()


router.post('/createApp/',controller.CreateApplication)
router.post('/createProcessor/',controller.CreateProcessor)
router.post('/createProcessormapping/',controller.CreateProcessorMapping)
router.post('/createTransactionType/',controller.CreatTransactionType)

router.get('/getProcessor',controller.GetAllProcessorsMapped)
router.get('/getApplications',controller.GetAllApplications)




export default router