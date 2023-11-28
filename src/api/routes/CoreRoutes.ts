import { Router } from "express";
import CoreController from "../controller/CoreController";


let controller = new CoreController();
const router = Router();

router.post('/getName',controller.MakeNameEnquiry)
router.post('/send',controller.MakeFundTransfer)
router.get('/find/:reference',controller.GetTransaction)

export default router