import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

interface Game {
  gameNum: number;
  guesses: [string];
}

@Schema()
export class User extends Document {
  // @Prop()
  // id: number;

  @Prop({required: true})
  address: string;

  @Prop()
  games: Game[];
}

export const UserSchema = SchemaFactory.createForClass(User);