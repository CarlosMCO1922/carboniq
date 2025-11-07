"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpendModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const spend_controller_1 = require("./spend.controller");
const spend_service_1 = require("./spend.service");
let SpendModule = class SpendModule {
};
exports.SpendModule = SpendModule;
exports.SpendModule = SpendModule = __decorate([
    (0, common_1.Module)({
        controllers: [spend_controller_1.SpendController],
        providers: [spend_service_1.SpendService, prisma_service_1.PrismaService]
    })
], SpendModule);
//# sourceMappingURL=spend.module.js.map