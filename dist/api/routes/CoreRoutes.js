"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CoreController_1 = __importDefault(require("../controller/CoreController"));
let controller = new CoreController_1.default();
const router = (0, express_1.Router)();
router.post('/', controller.MakeNameEnquiry);
exports.default = router;
//# sourceMappingURL=CoreRoutes.js.map