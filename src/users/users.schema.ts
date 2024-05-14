import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from "uuid";

@Schema({ timestamps: true })
export class User {
  @Prop({ default: uuidv4 })
  userID: string;
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
