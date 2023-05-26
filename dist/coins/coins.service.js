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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinsService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const coin_schema_1 = require("./schemas/coin.schema");
const axios_1 = __importDefault(require("axios"));
let NUMBER_OF_COINS = 100;
let NUMBER_OF_META = 50;
let CoinsService = class CoinsService {
    constructor(coinModel) {
        this.coinModel = coinModel;
    }
    async getWinningCoinSymbol(index) {
        const coin = await this.coinModel.findOne().skip(index - 1).limit(1).exec();
        const data = coin.toJSON();
        return data.symbol;
    }
    async findAll() {
        const coins = await this.coinModel.find().exec();
        const coinsWithLabel = coins.map((coin) => {
            return Object.assign({}, coin.toJSON());
        });
        return coinsWithLabel;
    }
    async dailyReset() {
        const MY_CMC_API_KEY = process.env.CMC_API_KEY;
        const listingUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${NUMBER_OF_COINS}&convert=USD`;
        const infoUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info';
        try {
            const listingResponse = await axios_1.default.get(listingUrl, {
                headers: {
                    'X-CMC_PRO_API_KEY': MY_CMC_API_KEY,
                },
            });
            const myListingResponse = listingResponse.data.data.map((coin) => {
                return {
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    date_added: coin.date_added,
                    max_supply: coin.max_supply,
                    cmc_rank: coin.cmc_rank,
                    price: coin.quote.USD.price,
                    marketCap: coin.quote.USD.market_cap,
                    volume24h: coin.quote.USD.volume_24h,
                };
            });
            const topCoins = myListingResponse.slice(0, NUMBER_OF_META);
            const ids_array = topCoins.map((coin) => coin.id);
            const ids = topCoins.map((coin) => coin.id).join();
            const infoResponse = await axios_1.default.get(infoUrl, {
                headers: {
                    'X-CMC_PRO_API_KEY': MY_CMC_API_KEY,
                },
                params: {
                    id: ids,
                },
            });
            const myInfoResponse = ids_array.map((id) => {
                return {
                    coin: infoResponse.data.data[id],
                    category: infoResponse.data.data[id].category,
                    description: infoResponse.data.data[id].description,
                    logo: infoResponse.data.data[id].logo,
                    tags: infoResponse.data.data[id].tags,
                };
            });
            const coinData = topCoins.map((coin) => {
                const id = coin.id;
                const fullmeta = myInfoResponse.find((item) => item.coin.id === id);
                const metadata = {
                    category: fullmeta.category,
                    description: fullmeta.description,
                    logo: fullmeta.logo,
                    tags: fullmeta.tags,
                };
                const coinWithMetadata = Object.assign(Object.assign({}, coin), metadata);
                return Object.assign(Object.assign({}, coinWithMetadata), { label: coinWithMetadata.virtualLabel });
            });
            await this.coinModel.deleteMany({});
            console.log('Coin list cleared from database');
            await this.coinModel.insertMany(coinData);
            console.log('Coin data saved to database');
            return { message: 'Coin data saved to database' };
        }
        catch (error) { }
    }
};
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoinsService.prototype, "dailyReset", null);
CoinsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(coin_schema_1.Coin.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], CoinsService);
exports.CoinsService = CoinsService;
//# sourceMappingURL=coins.service.js.map