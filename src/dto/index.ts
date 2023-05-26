export class ErrorMessageDTO {
    message: string;
    detailedMessage: string;
}

export class TxnResponseDTO {
    message: string;
    transactionHash: string;
    etherscanLink: string;
}

export class SetCoinDTO {
    coinIdx: number;
}

export class JoinGameDTO {
    address: string;
    // points: number;
}

// export class RequestTokenDTO {
//     address: string;
//     amount: number;
// }
// 
// export class DelegateDTO {
//     delegatee: string;
// }
// 
// export class VoteDTO { 
//     proposalId: string;
//     amount: number;
// }