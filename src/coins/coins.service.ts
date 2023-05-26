import { Model } from 'mongoose';
import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coin, CoinDocument } from './schemas/coin.schema';
import { UpdateCoinsListDto } from './dto/index'
import { ErrorMessageDTO } from 'src/dto';

import axios from 'axios';

let NUMBER_OF_COINS:number = 100;
let NUMBER_OF_META:number = 50; // ultimately don't need this, but for now...

@Injectable()
export class CoinsService {
  constructor(@InjectModel(Coin.name) private coinModel: Model<CoinDocument>) {}

  async getWinningCoinSymbol(index: number): Promise<string> {
    const coin = await this.coinModel.findOne().skip(index-1).limit(1).exec();
    const data = coin.toJSON();
    return data.symbol;
  }
  
  //--return all coins from DB, for dropdown list etc
  async findAll(): Promise<object[]> {
    const coins = await this.coinModel.find().exec();
    const coinsWithLabel = coins.map((coin) => {
      return {
        ...coin.toJSON(),
      };
    });
    return coinsWithLabel;
  }
  
  //--DAILY RESET CMC COINLIST TO MONGODB DATABASE
  @HttpCode(HttpStatus.NO_CONTENT)
  async dailyReset(): Promise<UpdateCoinsListDto | ErrorMessageDTO> {
    const MY_CMC_API_KEY = process.env.CMC_API_KEY
    const listingUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${NUMBER_OF_COINS}&convert=USD`
    const infoUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info'

    try {
        const listingResponse = await axios.get(listingUrl, {
            headers: {
                'X-CMC_PRO_API_KEY': MY_CMC_API_KEY,
            },
        })
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
                // label: `${coin.name} ${coin.symbol}`,
            }
        })

        //---------- SPLIT AND RETRIEVE METADATA ----------
        const topCoins = myListingResponse.slice(0, NUMBER_OF_META)
        const ids_array = topCoins.map((coin) => coin.id)
        const ids = topCoins.map((coin) => coin.id).join()

        const infoResponse = await axios.get(infoUrl, {
            headers: {
                'X-CMC_PRO_API_KEY': MY_CMC_API_KEY,
            },
            params: {
                id: ids, // pass to info endpoint
            },
        })
        const myInfoResponse = ids_array.map((id) => {
            return {
                coin: infoResponse.data.data[id],
                category: infoResponse.data.data[id].category,
                description: infoResponse.data.data[id].description,
                logo: infoResponse.data.data[id].logo,
                tags: infoResponse.data.data[id].tags,
            }
        })

        // Merge the two responses based on the `id` field
        const coinData = topCoins.map((coin) => {
            const id = coin.id
            const fullmeta = myInfoResponse.find((item) => item.coin.id === id)
            const metadata = {
                category: fullmeta.category,
                description: fullmeta.description,
                logo: fullmeta.logo,
                tags: fullmeta.tags,
            }
            const coinWithMetadata = { ...coin, ...metadata }
            return { ...coinWithMetadata, label: coinWithMetadata.virtualLabel  }
        })

        // clear prev coins list from MongoDB Cloud
        await this.coinModel.deleteMany({})
        console.log('Coin list cleared from database')

        // Save new coins list to MongoDB Cloud
        await this.coinModel.insertMany(coinData)
        console.log('Coin data saved to database')

        // update winning coin
        // const coins = await this.coinModel.find()
        // TODAY_WINNING_COIN = coins[TODAY_WINNING_INDEX]
        // console.log('Winning coin updated')
        return { message: 'Coin data saved to database' }
    } catch (error) {}
  }
}
