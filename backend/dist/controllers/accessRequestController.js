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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccessRequest = exports.listAccessRequests = exports.createAccessRequest = void 0;
const database_1 = require("../config/database");
const AccessRequest_1 = require("../entities/AccessRequest");
const User_1 = require("../entities/User");
const Software_1 = require("../entities/Software");
const accessRequestRepository = database_1.AppDataSource.getRepository(AccessRequest_1.AccessRequest);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const softwareRepository = database_1.AppDataSource.getRepository(Software_1.Software);
const createAccessRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { softwareId, accessType, reason } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const user = yield userRepository.findOne({ where: { id: userId } });
        const software = yield softwareRepository.findOne({ where: { id: softwareId } });
        if (!user || !software) {
            return res.status(404).json({ message: "User or software not found" });
        }
        const existingRequest = yield accessRequestRepository.findOne({
            where: {
                user: { id: userId },
                software: { id: softwareId },
                status: AccessRequest_1.RequestStatus.PENDING,
            },
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Access request already pending" });
        }
        const accessRequest = accessRequestRepository.create({
            user,
            software,
            status: AccessRequest_1.RequestStatus.PENDING,
            accessType,
            reason,
        });
        yield accessRequestRepository.save(accessRequest);
        res.status(201).json(accessRequest);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating access request" });
    }
});
exports.createAccessRequest = createAccessRequest;
const listAccessRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessRequests = yield accessRequestRepository.find({
            relations: ["user", "software"],
        });
        res.json(accessRequests);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching access requests" });
    }
});
exports.listAccessRequests = listAccessRequests;
const updateAccessRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const accessRequest = yield accessRequestRepository.findOne({
            where: { id: parseInt(id) },
            relations: ["user", "software"],
        });
        if (!accessRequest) {
            return res.status(404).json({ message: "Access request not found" });
        }
        accessRequest.status = status;
        yield accessRequestRepository.save(accessRequest);
        res.json(accessRequest);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating access request" });
    }
});
exports.updateAccessRequest = updateAccessRequest;
