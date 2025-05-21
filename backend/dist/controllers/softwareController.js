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
exports.createSoftware = exports.listSoftware = void 0;
const database_1 = require("../config/database");
const Software_1 = require("../entities/Software");
const softwareRepository = database_1.AppDataSource.getRepository(Software_1.Software);
const listSoftware = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const software = yield softwareRepository.find();
        res.json(software);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching software list" });
    }
});
exports.listSoftware = listSoftware;
const createSoftware = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, accessLevels } = req.body;
        const software = softwareRepository.create({
            name,
            description,
            accessLevels: accessLevels && Array.isArray(accessLevels) && accessLevels.length > 0 ? accessLevels : ["read", "write", "admin"],
        });
        yield softwareRepository.save(software);
        res.status(201).json(software);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating software" });
    }
});
exports.createSoftware = createSoftware;
