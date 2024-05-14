import { Body, Post, Controller, HttpCode, UsePipes } from "@nestjs/common";
import { IUser, signInSchema, signUpSchema } from "src/models";
import { JoiValidationPipe } from "src/pipes";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  @UsePipes(new JoiValidationPipe(signUpSchema))
  async signUp(@Body() user: IUser) {
    return this.authService.signUp(user);
  }

  @Post("sign-in")
  @UsePipes(new JoiValidationPipe(signInSchema))
  @HttpCode(200)
  async signIn(@Body() credentials: { email: string; password: string }) {
    return this.authService.signIn(credentials.email, credentials.password);
  }
}
