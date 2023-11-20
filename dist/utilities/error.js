"use strict";
// import fs from 'fs';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorEnum = void 0;
var ErrorEnum;
(function (ErrorEnum) {
    ErrorEnum[ErrorEnum["Unknown error"] = 400] = "Unknown error";
    ErrorEnum[ErrorEnum["UniqueConstraint"] = 401] = "UniqueConstraint";
    ErrorEnum[ErrorEnum["NotFound"] = 404] = "NotFound";
    ErrorEnum[ErrorEnum["ForbiddenError"] = 403] = "ForbiddenError";
})(ErrorEnum || (exports.ErrorEnum = ErrorEnum = {}));
class ErrorHandler {
    constructor(file) {
        this.fileName = file;
    }
    async CustomError(error, errorMessage) {
        try {
            return await { errorCode: error, message: errorMessage };
        }
        catch (error) {
            throw new Error("Unknown");
        }
    }
    async HandleError(error, message = "") {
        console.log("message", error);
        switch (error) {
            case ErrorEnum[404]:
                //code:404
                return [ErrorHandler.STATUS_ERROR_404, "Not Found", message || "Data not found"];
            case ErrorEnum[403]:
                //code:403
                return [ErrorHandler.STATUS_ERROR_403, "Forbidden Action", message || "Action is not allowed or there is something you are missing"];
            case ErrorEnum[401]:
                //code:401
                return [ErrorHandler.STATUS_ERROR_401, "Unauthorized action", message || "Field name should be unique"];
            case ErrorEnum[400]:
                //code:400
                return [ErrorHandler.STATUS_ERROR_400, "Unknown Error", message || "Contact Support for clarification"];
            default:
                //code:500
                return [ErrorHandler.STATUS_ERROR_500, "Internal Server Error", message || "Sorry, this is on us. Please try again!"];
        }
    }
}
ErrorHandler.STATUS_ERROR_404 = ErrorEnum["NotFound"];
ErrorHandler.STATUS_ERROR_500 = 500;
ErrorHandler.STATUS_ERROR_403 = 403;
ErrorHandler.STATUS_ERROR_401 = 401;
ErrorHandler.STATUS_ERROR_400 = 400;
exports.default = ErrorHandler;
//# sourceMappingURL=error.js.map