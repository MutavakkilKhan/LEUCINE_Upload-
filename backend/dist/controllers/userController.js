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
exports.updateManager = exports.getMe = exports.checkEmail = exports.listUsers = exports.login = exports.register = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        email = email.toLowerCase(); // Ensure email is lowercase
        // Gmail regex
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return res.status(400).json({ message: "Only valid Gmail addresses are allowed" });
        }
        // Password strength
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        // Duplicate email
        const existingUser = yield userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Save user
        const user = userRepository.create({
            name,
            email,
            password: hashedPassword,
            role: User_1.UserRole.USER,
        });
        yield userRepository.save(user);
        // Optionally, generate JWT
        const secret = process.env.JWT_SECRET || "your-super-secret-jwt-key";
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || "24h" });
        res.status(201).json({ message: "User registered successfully", token });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        console.log('Login attempt for email:', email);
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        email = email.toLowerCase(); // Ensure email is lowercase
        // Gmail regex
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return res.status(400).json({ message: "Only valid Gmail addresses are allowed" });
        }
        // Find user
        const user = yield userRepository.findOne({ where: { email } });
        console.log('Found user:', user ? { id: user.id, email: user.email, role: user.role } : 'Not found');
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Compare password
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Generate JWT
        const secret = process.env.JWT_SECRET || "your-super-secret-jwt-key";
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || "24h" });
        console.log('Generated token for user:', { id: user.id, role: user.role });
        res.json({ token });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});
exports.login = login;
// Debug endpoint to list all users (remove in production)
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userRepository.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});
exports.listUsers = listUsers;
// Check if email exists
const checkEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ exists: false, message: 'Email is required' });
        }
        const user = yield userRepository.findOne({ where: { email } });
        res.json({ exists: !!user });
    }
    catch (error) {
        res.status(500).json({ exists: false, message: 'Error checking email' });
    }
});
exports.checkEmail = checkEmail;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        console.log('getMe request for userId:', userId);
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const user = yield userRepository.findOne({ where: { id: userId } });
        console.log('Found user in getMe:', user ? { id: user.id, email: user.email, role: user.role } : 'Not found');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    }
    catch (error) {
        console.error('Error in getMe:', error);
        res.status(500).json({ message: "Error fetching user info" });
    }
});
exports.getMe = getMe;
const updateManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const { email, name, password } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, name, and password are required' });
        }
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const newEmail = email.toLowerCase();
        let managerUser = yield userRepository.findOne({ where: { email: newEmail } });
        const bcrypt = require('bcrypt');
        if (!managerUser) {
            const hashedPassword = yield bcrypt.hash(password, 10);
            managerUser = userRepository.create({
                name,
                email: newEmail,
                password: hashedPassword,
                role: User_1.UserRole.MANAGER,
            });
            yield userRepository.save(managerUser);
        }
        else {
            managerUser.name = name;
            managerUser.password = yield bcrypt.hash(password, 10);
            managerUser.role = User_1.UserRole.MANAGER;
            yield userRepository.save(managerUser);
        }
        // Optionally, demote previous manager(s) except this one
        yield userRepository.createQueryBuilder()
            .update()
            .set({ role: User_1.UserRole.USER })
            .where('role = :role AND email != :email', { role: User_1.UserRole.MANAGER, email: newEmail })
            .execute();
        res.json({ message: 'Manager updated successfully', email: newEmail });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating manager', error: error.message });
    }
});
exports.updateManager = updateManager;
