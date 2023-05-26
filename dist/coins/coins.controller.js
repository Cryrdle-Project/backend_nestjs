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
exports.CoinsController = void 0;
const common_1 = require("@nestjs/common");
const coins_service_1 = require("./coins.service");
let CoinsController = class CoinsController {
    constructor(appService) {
        this.appService = appService;
        console.log("coins controller constructor");
    }
    getAllCoins() {
        console.log("get all coins");
        return this.appService.findAll();
    }
    getWinningCoinSymbol(index) {
        console.log("get winning coin symbol at index: ", index);
        return this.appService.getWinningCoinSymbol(index);
    }
    updateCoinsList() {
        return this.appService.dailyReset();
    }
};
__decorate([
    (0, common_1.Get)("coins"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "getAllCoins", null);
__decorate([
    (0, common_1.Get)("get-winning-coin"),
    __param(0, (0, common_1.Param)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "getWinningCoinSymbol", null);
__decorate([
    (0, common_1.Post)("update-coins-list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "updateCoinsList", null);
CoinsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [coins_service_1.CoinsService])
], CoinsController);
exports.CoinsController = CoinsController;
//# sourceMappingURL=coins.controller.js.map