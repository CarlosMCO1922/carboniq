"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./prisma.service");
const users_module_1 = require("./users/users.module");
const health_controller_1 = require("./health.controller");
const organizations_module_1 = require("./organizations/organizations.module");
const projects_module_1 = require("./projects/projects.module");
const activities_module_1 = require("./activities/activities.module");
const factors_module_1 = require("./factors/factors.module");
const calculations_module_1 = require("./calculations/calculations.module");
const spend_module_1 = require("./spend/spend.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            users_module_1.UsersModule,
            organizations_module_1.OrganizationsModule,
            projects_module_1.ProjectsModule,
            activities_module_1.ActivitiesModule,
            factors_module_1.FactorsModule,
            calculations_module_1.CalculationsModule,
            spend_module_1.SpendModule
        ],
        controllers: [app_controller_1.AppController, health_controller_1.HealthController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map