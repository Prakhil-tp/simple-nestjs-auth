import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { ConfigService, ConfigModule } from "@nestjs/config";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow("jwtSecret"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
