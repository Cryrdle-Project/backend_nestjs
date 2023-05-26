import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type CoinDocument = HydratedDocument<Coin>;

@Schema()
export class Coin extends Document {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop()
  date_added: string;

  @Prop()
  max_supply: number;

  @Prop()
  cmc_rank: number;

  @Prop()
  price: number;

  @Prop()
  marketCap: number;

  @Prop()
  volume24h: number;

  @Prop()
  category: string;

  @Prop()
  description: string;

  @Prop()
  logo: string;

  @Prop()
  tags: [string];
  
  @Prop()
  label: string; // TODO: maybe don't need this?

  @Prop()
  get virtualLabel(): string {
    return `${this.name} ${this.symbol}`;
  }
}

export const CoinSchema = SchemaFactory.createForClass(Coin);
