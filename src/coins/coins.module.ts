import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { Coin, CoinSchema } from './schemas/coin.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Coin.name, schema: CoinSchema },
    // { name: User.name, schema: UserSchema }
  ])],
  controllers: [CoinsController],
  providers: [CoinsService],
  // controllers: [CoinsController, UsersController],
  // providers: [CoinsService, UsersService],
})
export class CoinsModule {
  constructor(
    private readonly appService: CoinsService
  ) {}  
}