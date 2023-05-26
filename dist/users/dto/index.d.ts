export declare class CreateUserDto {
    address: string;
}
export declare class UpdateGuessesDto {
    address: string;
    guess: string;
}
export declare class UpdateGuessesResponseDto {
    success: boolean;
    message: string;
    winner?: boolean;
}
