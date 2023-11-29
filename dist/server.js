"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = __importDefault(require("./config/db"));
(0, db_1.default)();
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Body parser middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Cookie parser middleware
app.use((0, cookie_parser_1.default)());
app.use('/api/products', productRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLI_ID));
if (process.env.RUNNING_ON_SERVER === 'true') {
    app.use('/uploads', express_1.default.static('/data/uploads'));
}
else {
    const dirname3 = path_1.default.resolve();
    app.use('/uploads', express_1.default.static(path_1.default.join(dirname3, '/data/images')));
}
// Serve images statically
if (process.env.RUNNING_ON_SERVER === 'true') {
    app.use('/images', express_1.default.static('/data/images'));
}
else {
    const dirname2 = path_1.default.resolve();
    app.use('/images', express_1.default.static(path_1.default.join(dirname2, 'data', 'images')));
}
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path_1.default.join(__dirname, 'frontend', 'build');
    app.use(express_1.default.static(frontendPath));
    app.get('*', (req, res) => res.sendFile(path_1.default.join(frontendPath, 'index.html')));
}
else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
