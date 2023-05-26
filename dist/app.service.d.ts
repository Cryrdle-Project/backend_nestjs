import { ErrorMessageDTO, TxnResponseDTO } from './dto';
export declare class AppService {
    provider: any;
    signer: any;
    cryrdleContract: any;
    CURRENT_GAME: number;
    ENTRY_FEE_ETH: number;
    ENTRY_FEE_WEI: any;
    COIN_OF_THE_DAY_IDX: number;
    COIN_OF_THE_DAY_SYMBOL: string;
    PARTICIPANTS: any[];
    constructor();
    getContractAddress(): string;
    getCurrentGameInfo(): Promise<any>;
    _getGameAndCoin(): Promise<any>;
    getCurrentGame(): Promise<number>;
    getParticipants(): Promise<string[]>;
    getParticipationFee(): Promise<number>;
    getUserIsPaid(address: string): Promise<boolean>;
    getCoinOfTheDay(): Promise<number>;
    getWinningCoinSymbol(coinIdx: number): Promise<string>;
    setCoinOfTheDay(coinIdx: number): Promise<TxnResponseDTO | ErrorMessageDTO>;
    setJoinCryrdle(): Promise<TxnResponseDTO | ErrorMessageDTO>;
}
