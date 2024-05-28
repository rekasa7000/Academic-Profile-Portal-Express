"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:4200",
    credentials: true,
}));
app.use("/", authRoute_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
