import { Model } from 'mongoose';
import { CoinDocument } from './schemas/coin.schema';
import { UpdateCoinsListDto } from './dto/index';
import { ErrorMessageDTO } from 'src/dto';
export declare class CoinsService {
    private coinModel;
    constructor(coinModel: Model<CoinDocument>);
    getWinningCoinSymbol(index: number): Promise<string>;
    findAll(): Promise<object[]>;
    dailyReset(): Promise<UpdateCoinsListDto | ErrorMessageDTO>;
}
