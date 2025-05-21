"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post("/register", userController_1.register);
router.post("/login", userController_1.login);
router.get("/users", userController_1.listUsers); // Debug only, remove in production
router.get("/check-email", userController_1.checkEmail);
router.get("/me", auth_1.authenticateToken, userController_1.getMe);
router.patch("/manager-email", auth_1.authenticateToken, userController_1.updateManager);
exports.default = router;
