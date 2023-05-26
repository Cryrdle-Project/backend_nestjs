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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const dto_1 = require("./dto");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
        console.log("app controller constructor");
    }
    getContractAddress() {
        return this.appService.getContractAddress();
    }
    getUserIsPaid(address) {
        console.log("get user is paid for address: ", address);
        return this.appService.getUserIsPaid(address);
    }
    getCoinOfTheDay() {
        return this.appService.getCoinOfTheDay();
    }
    getParticipationFee() {
        return this.appService.getParticipationFee();
    }
    getCurrentGame() {
        return this.appService.getCurrentGame();
    }
    async getCurrentGameInfo() {
        const data = await this.appService.getCurrentGameInfo();
        return data;
    }
    setCoinOfTheDay(body) {
        const { coinIdx } = body;
        return this.appService.setCoinOfTheDay(coinIdx);
    }
    setjoinCryrdle() {
        return this.appService.setJoinCryrdle();
    }
};
__decorate([
    (0, common_1.Get)("contract-address"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getContractAddress", null);
__decorate([
    (0, common_1.Get)("is-paid/:address"),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUserIsPaid", null);
__decorate([
    (0, common_1.Get)("secret-win-index"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCoinOfTheDay", null);
__decorate([
    (0, common_1.Get)("fee"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getParticipationFee", null);
__decorate([
    (0, common_1.Get)("current-game"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCurrentGame", null);
__decorate([
    (0, common_1.Get)("current-game-info"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCurrentGameInfo", null);
__decorate([
    (0, swagger_1.ApiBody)({ description: 'Example payload (integer[1,100])' }),
    (0, common_1.Post)("set-coin-of-the-day"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SetCoinDTO]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "setCoinOfTheDay", null);
__decorate([
    (0, common_1.Post)("join-game-for-game-num"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "setjoinCryrdle", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map