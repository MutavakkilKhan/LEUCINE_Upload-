"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const softwareRoutes_1 = __importDefault(require("./routes/softwareRoutes"));
const accessRequestRoutes_1 = __importDefault(require("./routes/accessRequestRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/users", userRoutes_1.default);
app.use("/api/software", softwareRoutes_1.default);
app.use("/api/access-request", accessRequestRoutes_1.default);
const PORT = process.env.PORT || 3000;
database_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Database connected successfully");
    // Admin seeding logic
    const adminEmail = process.env.ADMIN_EMAIL || "mutavakkilukhan4428@gmail.com";
    const adminName = process.env.ADMIN_NAME || "Admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const managerEmail = process.env.MANAGER_EMAIL || "mutavakkilmuttu@gmail.com";
    const managerName = process.env.MANAGER_NAME || "Manager";
    const managerPassword = process.env.MANAGER_PASSWORD || "manager123";
    const userRepository = database_1.AppDataSource.getRepository("User");
    let adminUser = yield userRepository.findOne({ where: { email: adminEmail.toLowerCase() } });
    if (!adminUser) {
        const bcrypt = require("bcrypt");
        const hashedPassword = yield bcrypt.hash(adminPassword, 10);
        adminUser = userRepository.create({
            name: adminName,
            email: adminEmail.toLowerCase(),
            password: hashedPassword,
            role: "admin",
        });
        yield userRepository.save(adminUser);
        console.log(`Seeded admin user: ${adminEmail}`);
    }
    else if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        yield userRepository.save(adminUser);
        console.log(`Promoted user to admin: ${adminEmail}`);
    }
    // Manager seeding logic
    let managerUser = yield userRepository.findOne({ where: { email: managerEmail.toLowerCase() } });
    if (!managerUser) {
        const bcrypt = require("bcrypt");
        const hashedPassword = yield bcrypt.hash(managerPassword, 10);
        managerUser = userRepository.create({
            name: managerName,
            email: managerEmail.toLowerCase(),
            password: hashedPassword,
            role: "manager",
        });
        yield userRepository.save(managerUser);
        console.log(`Seeded manager user: ${managerEmail}`);
    }
    else if (managerUser.role !== "manager") {
        managerUser.role = "manager";
        yield userRepository.save(managerUser);
        console.log(`Promoted user to manager: ${managerEmail}`);
    }
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}))
    .catch((error) => {
    console.error("Error connecting to database:", error);
});
