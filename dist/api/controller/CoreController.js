"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CoreService_1 = __importDefault(require("../service/CoreService"));
const service = new CoreService_1.default();
class CoreController {
    async MakeNameEnquiry(req, res) {
        try {
            let { recipientName, recipientAccount, accountType, bankMobileCode } = req.body; //extract body from request
            let response = await service.MakeNameEnquiry(recipientName, recipientAccount, accountType, bankMobileCode);
            res.status(200).json(response);
        }
        catch (error) {
            let [code, message, extra_message] = error;
            res.status(code).json({ message, extra_message });
        }
    }
}
exports.default = CoreController;
//# sourceMappingURL=CoreController.js.map