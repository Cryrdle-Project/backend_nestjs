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
exports.UsersService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const app_service_1 = require("../app.service");
let UsersService = class UsersService {
    constructor(userModel, appService) {
        this.userModel = userModel;
        this.appService = appService;
    }
    async getUser(address) {
        const user = await this.userModel.findOne({ address: address }).exec();
        console.log("user:", user);
        return user;
    }
    async getMyGuesses(address) {
        console.log("getting guesses of user: ", address);
        try {
            const user = await this.userModel.findOne({ address: address }).exec();
            console.log("user:", user);
            console.log("userGames:", user.games);
            const userGuesses = user.games.find((game) => game.gameNum === this.appService.CURRENT_GAME);
            console.log("userGuesses:", userGuesses);
            return userGuesses.guesses;
        }
        catch (e) {
            console.log("error while getting guesses");
            return [];
        }
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async createUser(address) {
        const participants = await this.appService.cryrdleContract.getParticipants();
        const userExists = participants.map(p => p.toLowerCase()).includes(address);
        if (userExists) {
            console.log("user already exists in DB");
            return {
                message: 'User exists',
                detailedMessage: 'user already exists in DB'
            };
        }
        const createdUser = new this.userModel({ address: address });
        return createdUser.save();
    }
    async addGameToUser(address, CURRENT_GAME) {
        console.log("adding game to user");
        const user = await this.userModel.findOne({ address }).exec();
        user.games.push({
            gameNum: CURRENT_GAME,
            guesses: null
        });
        await user.save();
    }
    async addGuess(address, guess) {
        try {
            const user = await this.userModel.findOne({ address }).exec();
            const CURRENT_GAME = await this.appService.getCurrentGame();
            const winIdx = await this.appService.getCoinOfTheDay();
            const WIN_SYMBOL = await this.appService.getWinningCoinSymbol(winIdx);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                };
            }
            const gameIndex = user.games.findIndex((game) => game.gameNum === CURRENT_GAME);
            if (gameIndex === -1) {
                console.log("...game not found, adding game");
                user.games.push({
                    gameNum: CURRENT_GAME,
                    guesses: [guess],
                });
                await user.save();
            }
            else {
                const userGuesses = user.games.find((game) => game.gameNum === CURRENT_GAME);
                if (userGuesses.guesses.includes(guess)) {
                    return {
                        success: false,
                        message: 'Repeated guess',
                    };
                }
                await this.userModel.updateOne({ address: address, 'games.gameNum': CURRENT_GAME }, { $push: { 'games.$.guesses': guess } });
            }
            if (guess === WIN_SYMBOL) {
                console.log(`..."${guess}" matches winning coin: "${WIN_SYMBOL}"`);
                return {
                    success: true,
                    message: 'WE GOTTA WINNER!!!',
                    winner: true,
                };
            }
            else {
                return {
                    success: true,
                    message: 'Guess added successfully',
                };
            }
        }
        catch (error) {
            return {
                success: false,
                message: `error: ${error}`
            };
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        app_service_1.AppService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map