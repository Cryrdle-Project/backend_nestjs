import { isEthereumAddress } from 'class-validator';

export class CreateUserDto {
  // @isEthereumAddress()
  address: string;
}

export class UpdateGuessesDto {
    address: string;
    guess: string;
}

export class UpdateGuessesResponseDto {
    success: boolean;
    message: string;
    winner?: boolean;
}

