import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { AppService } from 'src/app.service';
import { CoinsService } from 'src/coins/coins.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, AppService],
})
export class UsersModule {
  constructor(
    private readonly appService: UsersService
  ) {} 
}