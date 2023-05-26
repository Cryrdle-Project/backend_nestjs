import { Controller, Body, Get, Post, Query, Param } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { ApiBody } from '@nestjs/swagger';
import { UpdateCoinsListDto } from './dto'
import { ErrorMessageDTO } from 'src/dto';

// let TODAY_WINNING_COIN:string = "DOGE";

@Controller()
export class CoinsController {
  constructor(
    private readonly appService: CoinsService
  ) {
    console.log("coins controller constructor");
    // this.updateCoinsList(); // uncomment when not constantly restarting serve
  }

  //---GETTERS

  @Get("coins")
  getAllCoins(): Promise<object[]> {
    console.log("get all coins");
    return this.appService.findAll();
  }
  
  @Get("get-winning-coin")
  getWinningCoinSymbol(@Param('index') index: number): Promise<string> {
    console.log("get winning coin symbol at index: ", index);
    return this.appService.getWinningCoinSymbol(index);
  }
  
  //---SETTERS

  @Post("update-coins-list")
  updateCoinsList(): Promise<UpdateCoinsListDto | ErrorMessageDTO> {
    return this.appService.dailyReset();
  }

}