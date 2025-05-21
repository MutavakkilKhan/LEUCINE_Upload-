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
exports.AccessRequest = exports.AccessType = exports.RequestStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Software_1 = require("./Software");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var AccessType;
(function (AccessType) {
    AccessType["READ"] = "read";
    AccessType["WRITE"] = "write";
    AccessType["ADMIN"] = "admin";
})(AccessType || (exports.AccessType = AccessType = {}));
let AccessRequest = class AccessRequest {
};
exports.AccessRequest = AccessRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AccessRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.accessRequests),
    __metadata("design:type", User_1.User)
], AccessRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Software_1.Software, (software) => software.accessRequests),
    __metadata("design:type", Software_1.Software)
], AccessRequest.prototype, "software", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: RequestStatus,
        default: RequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], AccessRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: AccessType,
        default: AccessType.READ,
    }),
    __metadata("design:type", String)
], AccessRequest.prototype, "accessType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], AccessRequest.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AccessRequest.prototype, "timestamp", void 0);
exports.AccessRequest = AccessRequest = __decorate([
    (0, typeorm_1.Entity)()
], AccessRequest);
