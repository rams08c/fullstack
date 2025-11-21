"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is running' });
});
// API Routes
app.use('/api', routes_1.default);
// 404 Handler - must be after all routes
app.use(middlewares_1.notFoundHandler);
// Error Handler - must be last
app.use(middlewares_1.errorHandler);
exports.default = app;
