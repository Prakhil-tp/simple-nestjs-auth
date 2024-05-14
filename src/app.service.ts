import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getMessage(): string {
    return "Server is alive!";
  }
}
