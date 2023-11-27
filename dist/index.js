"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./api/routes/index"));
const config_1 = require("./utilities/config");
const init_1 = __importDefault(require("./db/init"));
const port = 3333;
const app = (0, express_1.default)();
//express middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// EndPoints for consumption --------------------------------
app.use('/api', index_1.default);
//Database --------------------------------
config_1.SequelizeInstance.connectToDBs().then(() => {
    (0, init_1.default)();
    app.emit("ready");
}).catch(err => {
    console.error(err);
    app.emit("error");
});
//Start server --------------------------------
app.on("ready", () => {
    try {
        app.listen(port, () => console.log(`Server started on port ${port}`));
    }
    catch (error) {
        console.log(error);
    }
});
//# sourceMappingURL=index.js.map