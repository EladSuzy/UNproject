"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const app = (0, express_1.default)();
const PORT = 4000;
// Middleware
app.use(express_1.default.json());
// Routes
app.use('/api', customerRoutes_1.default);
// Start Server
app.listen(PORT, () => {
    console.log(`Web Server running on http://localhost:${PORT}`);
});
