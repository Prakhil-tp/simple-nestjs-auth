import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { IUser } from "src/models";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: IUser): Promise<{ accessToken: string }> {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const createdUser = await this.usersService.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });

    Logger.log(
      `User has been created successfully. email: ${createdUser.email} userID: ${createdUser.userID}`,
    );

    const accessToken = this.jwtService.sign({
      email: createdUser.email,
      sub: createdUser.userID,
    });

    return { accessToken };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneByEmail(email);

    if (user == null || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    const accessToken = this.jwtService.sign({
      sub: user.userID,
      email: user.email,
    });

    Logger.log(
      `User has signed-in successfully! email: ${email}, userID: ${user.userID}`,
    );
    return { accessToken };
  }
}
