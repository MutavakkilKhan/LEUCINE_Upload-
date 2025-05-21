"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const softwareController_1 = require("../controllers/softwareController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticateToken, softwareController_1.listSoftware);
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, softwareController_1.createSoftware);
exports.default = router;
