"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes = require('./routes/routes');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const port = 3000;
app.use(routes);
app.use(async (req, res, next) => {
    res.status(404).send({ message: "Not Found" });
});
app.listen(port, () => {
    console.log("Express app is listening on the port 3000!");
});
