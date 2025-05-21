"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Software_1 = require("../entities/Software");
const AccessRequest_1 = require("../entities/AccessRequest");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "Muttu@098",
    database: process.env.DB_DATABASE || "uam_system",
    synchronize: true,
    logging: true,
    entities: [User_1.User, Software_1.Software, AccessRequest_1.AccessRequest],
    subscribers: [],
    migrations: [],
    ssl: false,
    extra: {
        trustServerCertificate: true
    }
});
