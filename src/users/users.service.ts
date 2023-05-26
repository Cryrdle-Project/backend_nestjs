import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateGuessesResponseDto } from './dto/index';
import { ErrorMessageDTO } from 'src/dto';
import { AppService } from 'src/app.service';

// let CURRENT_GAME:number = 3; // updated each day, stored here (for now?)
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) 
      private userModel: Model<UserDocument>,
      private appService: AppService
    ) {}
  
  async getUser(address: string): Promise<User> {
    const user = await this.userModel.findOne({address: address}).exec();
    console.log("user:", user)
    return user
  }
  
  async getMyGuesses(address: string): Promise<string[]> {
    console.log("getting guesses of user: ", address);
    try {
      const user = await this.userModel.findOne({address: address}).exec()
      console.log("user:", user);
      console.log("userGames:", user.games)
      const userGuesses = user.games.find((game) => game.gameNum === this.appService.CURRENT_GAME);
      
      console.log("userGuesses:", userGuesses);
      return userGuesses.guesses;

    } catch (e) {
      console.log("error while getting guesses");
      // console.log(e);
      return [];
    }
  }
  
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  
  //--SETTERS
  async createUser(address: string): Promise<User | ErrorMessageDTO> {

    // get participants from contract
    const participants = await this.appService.cryrdleContract.getParticipants();
    const userExists = participants.map(p => p.toLowerCase()).includes(address)

    if (userExists) {
      console.log("user already exists in DB");
      return {
        message: 'User exists',
        detailedMessage: 'user already exists in DB'
      };
    }

    const createdUser = new this.userModel({address: address});
    return createdUser.save();
  }

  async addGameToUser(address: string, CURRENT_GAME: number) {
    console.log("adding game to user");
    const user = await this.userModel.findOne({ address }).exec();
    user.games.push({
      gameNum: CURRENT_GAME,
      guesses: null
    });
    await user.save();
  }

  async addGuess(address: string, guess: string): Promise<UpdateGuessesResponseDto | ErrorMessageDTO> {
    try {
      const user = await this.userModel.findOne({ address }).exec();
      
      const CURRENT_GAME = await this.appService.getCurrentGame();
      const winIdx = await this.appService.getCoinOfTheDay();
      const WIN_SYMBOL = await this.appService.getWinningCoinSymbol(winIdx);

      /* TODO: Add middleware:
        -user has paid, 
       */

      // check if user exists
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      
      // check if game exists
      const gameIndex = user.games.findIndex((game) => game.gameNum === CURRENT_GAME);
      if (gameIndex === -1) {
        console.log("...game not found, adding game");
        user.games.push({
          gameNum: CURRENT_GAME,
          guesses: [guess],
        });
        await user.save();
      } else { 
        
        // check for repeated guess
        const userGuesses = user.games.find((game) => game.gameNum === CURRENT_GAME);
        if (userGuesses.guesses.includes(guess)) {
          return {
            success: false,
            message: 'Repeated guess',
          };
        }
        
        await this.userModel.updateOne(
          { address: address, 'games.gameNum': CURRENT_GAME },
          { $push: { 'games.$.guesses': guess } },
        );
      }

      // check if guess matches Winning Coin
      if (guess === WIN_SYMBOL) {
        console.log(`..."${guess}" matches winning coin: "${WIN_SYMBOL}"`);
        return {
          success: true,
          message: 'WE GOTTA WINNER!!!',
          winner: true,

        };
      } else {
        return {
          success: true,
          message: 'Guess added successfully',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `error: ${error}`
      };
    }
  }
}