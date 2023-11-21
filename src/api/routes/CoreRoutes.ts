import { Router } from "express";
import CoreController from "../controller/CoreController";
import { CHECKAPPTOKEN } from "../middleware/CheckApp";


let controller = new CoreController();
const router = Router();

router.post('/',CHECKAPPTOKEN, controller.MakeNameEnquiry)

export default router