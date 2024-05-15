import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow("port");
  await app.listen(port);
  Logger.log(`Application started on port ${port}`);
}

bootstrap().catch(err => Logger.error("Error while starting the app:", err));
