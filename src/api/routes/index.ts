import { Router } from "express";
import Extra from "../routes/ExtraRoutes"
import Core from "./CoreRoutes";



const Route = Router();

Route.use('/application',Extra)
Route.use('/core', Core)


export default Route