"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
const tokenJson = __importStar(require("./assets/CryrdleManual.json"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TEST_ADDRESS = "0xA2d937F18e9E7fC8d295EcAeBb10Acbd5e77e9eC";
const CRYRDLE_ADDRESS = "0xcDBF47C1fc051997b517c8a4c94f1e5441CbE69e";
const CRYRDLE_ABI = tokenJson.abi;
let AppService = class AppService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.cryrdleContract = null;
        this.ENTRY_FEE_ETH = null;
        this.ENTRY_FEE_WEI = null;
        this.COIN_OF_THE_DAY_IDX = null;
        this.PARTICIPANTS = [];
        this.provider = ethers_1.ethers.providers.getDefaultProvider('sepolia', {
            infura: process.env.INFURA_API_KEY
        });
        this.signer = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        this.cryrdleContract = new ethers_1.ethers.Contract(CRYRDLE_ADDRESS, CRYRDLE_ABI, this.signer);
    }
    getContractAddress() {
        return CRYRDLE_ADDRESS;
    }
    async getCurrentGameInfo() {
        this.CURRENT_GAME = await this.getCurrentGame();
        this.PARTICIPANTS = await this.getParticipants();
        this.ENTRY_FEE_ETH = await this.getParticipationFee();
        this.COIN_OF_THE_DAY_IDX = await this.getCoinOfTheDay();
        this.COIN_OF_THE_DAY_SYMBOL = await this.getWinningCoinSymbol(this.COIN_OF_THE_DAY_IDX);
        return {
            game: this.CURRENT_GAME,
            players: this.PARTICIPANTS,
            fee: this.ENTRY_FEE_ETH,
            winner: this.COIN_OF_THE_DAY_SYMBOL
        };
    }
    async _getGameAndCoin() {
        console.log("SENDING VALUES:");
        console.log("SENDING GAME:", this.CURRENT_GAME);
        console.log("SENDING COIN:", this.COIN_OF_THE_DAY_IDX);
        return {
            CURRENT_GAME: this.CURRENT_GAME,
            WIN_SYMBOL: this.COIN_OF_THE_DAY_SYMBOL
        };
    }
    async getCurrentGame() {
        const currentGameBN = await this.cryrdleContract.currentGameNum();
        const currentGame = parseInt(currentGameBN);
        this.CURRENT_GAME = currentGame;
        console.log("currentGame:", this.CURRENT_GAME);
        return currentGame;
    }
    async getParticipants() {
        const participants = await this.cryrdleContract.getParticipants();
        this.PARTICIPANTS = participants;
        console.log("participants:", this.PARTICIPANTS);
        return participants;
    }
    async getParticipationFee() {
        const entryFeeBN = await this.cryrdleContract.getParticipationFee();
        const entryFeeStr = ethers_1.ethers.utils.formatUnits(entryFeeBN);
        this.ENTRY_FEE_ETH = parseFloat(entryFeeStr);
        this.ENTRY_FEE_WEI = ethers_1.ethers.utils.parseEther(entryFeeStr);
        console.log("Entry fee in ETH:", this.ENTRY_FEE_ETH);
        return this.ENTRY_FEE_ETH;
    }
    async getUserIsPaid(address) {
        const participants = await this.cryrdleContract.getParticipants();
        const response = participants.map(p => p.toLowerCase()).includes(address);
        console.log(address, "isPaid?", response);
        return response;
    }
    async getCoinOfTheDay() {
        const coinBN = await this.cryrdleContract.getCoinOfTheDay();
        const coinInt = parseInt(coinBN);
        this.COIN_OF_THE_DAY_IDX = coinInt;
        return coinInt;
    }
    async getWinningCoinSymbol(coinIdx) {
        console.log("getting winning coin symbol...");
        return "hello";
    }
    async setCoinOfTheDay(coinIdx) {
        let txnError = null;
        let setCoinTxnReceipt = null;
        try {
            const setCoinTxn = await this.cryrdleContract.setCoinOfTheDay(coinIdx);
            setCoinTxnReceipt = await setCoinTxn.wait();
        }
        catch (error) {
            txnError = error;
        }
        if (txnError) {
            return {
                message: "Error while setting coin of the day",
                detailedMessage: JSON.stringify(txnError),
            };
        }
        else {
            this.COIN_OF_THE_DAY_IDX = coinIdx;
            this.CURRENT_GAME += 1;
        }
        return {
            message: "Successfully set coin of the day",
            transactionHash: setCoinTxnReceipt.transactionHash,
            etherscanLink: `https://sepolia.io/tx/${setCoinTxnReceipt.transactionHash}`,
        };
    }
    async setJoinCryrdle() {
        let txnError = null;
        let joinTxnReceipt = null;
        try {
            const joinTxn = await this.cryrdleContract.joinCryrdle({ "value": this.ENTRY_FEE_WEI, "gasLimit": 10000000 });
            joinTxnReceipt = await joinTxn.wait();
        }
        catch (error) {
            txnError = error;
        }
        if (txnError) {
            return {
                message: "Error while joining Cryrdle",
                detailedMessage: JSON.stringify(txnError),
            };
        }
        return {
            message: `Successfully joined Cryrdle for game: #${this.CURRENT_GAME}`,
            transactionHash: joinTxnReceipt.transactionHash,
            etherscanLink: `https://sepolia.io/tx/${joinTxnReceipt.transactionHash}`,
        };
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map