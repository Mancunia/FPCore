import { Router } from "express";
import Extra from "../routes/ExtraRoutes"
import Core from "./CoreRoutes";
import { CHECKAPPTOKEN } from "../middleware/CheckApp";



const Route = Router();

Route.use('/application',CHECKAPPTOKEN,Extra)
Route.use('/core',CHECKAPPTOKEN, Core)


export default Route