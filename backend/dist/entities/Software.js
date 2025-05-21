"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Software = void 0;
const typeorm_1 = require("typeorm");
const AccessRequest_1 = require("./AccessRequest");
let Software = class Software {
};
exports.Software = Software;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Software.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Software.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Software.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AccessRequest_1.AccessRequest, (accessRequest) => accessRequest.software),
    __metadata("design:type", Array)
], Software.prototype, "accessRequests", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'simple-array',
        default: 'read,write,admin',
    }),
    __metadata("design:type", Array)
], Software.prototype, "accessLevels", void 0);
exports.Software = Software = __decorate([
    (0, typeorm_1.Entity)()
], Software);
