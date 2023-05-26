import { CoinsService } from './coins.service';
import { UpdateCoinsListDto } from './dto';
import { ErrorMessageDTO } from 'src/dto';
export declare class CoinsController {
    private readonly appService;
    constructor(appService: CoinsService);
    getAllCoins(): Promise<object[]>;
    getWinningCoinSymbol(index: number): Promise<string>;
    updateCoinsList(): Promise<UpdateCoinsListDto | ErrorMessageDTO>;
}
