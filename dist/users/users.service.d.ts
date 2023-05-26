import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateGuessesResponseDto } from './dto/index';
import { ErrorMessageDTO } from 'src/dto';
import { AppService } from 'src/app.service';
export declare class UsersService {
    private userModel;
    private appService;
    constructor(userModel: Model<UserDocument>, appService: AppService);
    getUser(address: string): Promise<User>;
    getMyGuesses(address: string): Promise<string[]>;
    findAll(): Promise<User[]>;
    createUser(address: string): Promise<User | ErrorMessageDTO>;
    addGameToUser(address: string, CURRENT_GAME: number): Promise<void>;
    addGuess(address: string, guess: string): Promise<UpdateGuessesResponseDto | ErrorMessageDTO>;
}
