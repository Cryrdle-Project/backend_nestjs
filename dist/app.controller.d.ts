import { AppService } from './app.service';
import { SetCoinDTO, TxnResponseDTO, ErrorMessageDTO } from './dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getContractAddress(): string;
    getUserIsPaid(address: string): Promise<boolean>;
    getCoinOfTheDay(): Promise<number>;
    getParticipationFee(): Promise<number>;
    getCurrentGame(): Promise<number>;
    getCurrentGameInfo(): Promise<any>;
    setCoinOfTheDay(body: SetCoinDTO): Promise<TxnResponseDTO | ErrorMessageDTO>;
    setjoinCryrdle(): Promise<TxnResponseDTO | ErrorMessageDTO>;
}
