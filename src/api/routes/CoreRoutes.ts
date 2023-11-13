import { Router } from "express";
import CoreController from "../controller/CoreController";

let controller = new CoreController();
const router = Router();

router.post('/', controller.MakeNameEnquiry)

export default router