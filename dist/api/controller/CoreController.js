"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CoreService_1 = __importDefault(require("../service/CoreService"));
const error_1 = __importDefault(require("../../utilities/error"));
const service = new CoreService_1.default();
const errorHandler = new error_1.default();
class CoreController {
    async MakeNameEnquiry(req, res) {
        try {
            let payload = req.body; //extract body from request
            let response = await service.MakeNameEnquiry(res.locals.appToken, payload);
            res.status(200).json(response);
        }
        catch (error) {
            let errors = await errorHandler.HandleError(error?.errorCode, error?.message);
            res.status(errors[0]).json({ error: errors[1], message: errors[2] });
        }
    }
    async MakeFundTransfer(req, res) {
        try {
            let payload = req.body;
            let transaction = await service.MakeFundTransfer(res.locals.appToken, payload);
            res.status(200).json(transaction);
        }
        catch (error) {
            let errors = await errorHandler.HandleError(error?.errorCode, error?.message);
            res.status(errors[0]).json({ error: errors[1], message: errors[2] });
        }
    }
    async GetTransaction(req, res) {
        try {
            let refID = req.params.reference;
            let transaction = await service.GetTransactionDetails(refID);
            res.status(200).json(transaction);
        }
        catch (error) {
            let errors = await errorHandler.HandleError(error?.errorCode, error?.message);
            res.status(errors[0]).json({ error: errors[1], message: errors[2] });
        }
    }
}
exports.default = CoreController;
//# sourceMappingURL=CoreController.js.map