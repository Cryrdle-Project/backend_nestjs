import { UsersService } from './users.service';
import { CreateUserDto, UpdateGuessesDto, UpdateGuessesResponseDto } from './dto';
import { ErrorMessageDTO } from 'src/dto';
export declare class UsersController {
    private readonly appService;
    constructor(appService: UsersService);
    getAllUsers(): Promise<any>;
    getUser(address: string): Promise<any>;
    getMyGuesses(address: string): Promise<string[]>;
    createUser(body: CreateUserDto): Promise<any | ErrorMessageDTO>;
    addGuess(body: UpdateGuessesDto): Promise<UpdateGuessesResponseDto | ErrorMessageDTO>;
}
