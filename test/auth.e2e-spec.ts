import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { AuthService } from "../src/auth/auth.service";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthController (e2e)", () => {
  let app;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue({
        signUp: jest.fn().mockResolvedValue({ accessToken: "abc123" }), // Mock signUp method
        signIn: jest.fn(), // Initialize signIn as a Jest mock function
      })
      .compile();

    app = moduleFixture.createNestApplication();
    authService =
      moduleFixture.get<Partial<Record<keyof AuthService, jest.Mock>>>(
        AuthService,
      );
    await app.init();
  });

  it("/auth/sign-up (POST)", async () => {
    return request(app.getHttpServer())
      .post("/auth/sign-up")
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123!",
      })
      .expect(201)
      .then(response => {
        expect(response.body).toHaveProperty("accessToken");
      });
  });

  it("/auth/sign-up (POST) - invalid payload", () => {
    return request(app.getHttpServer())
      .post("/auth/sign-up")
      .send({
        name: "",
        email: "john.doe@example.com",
        password: "",
      })
      .expect(400);
  });

  it("/auth/sign-in (POST)", async () => {
    authService.signIn.mockResolvedValueOnce({ accessToken: "def456" }); // Mock signIn method for valid credentials

    return request(app.getHttpServer())
      .post("/auth/sign-in")
      .send({
        email: "john.doe@example.com",
        password: "password123!",
      })
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty("accessToken");
      });
  });

  it("/auth/sign-in (POST) - invalid credentials", () => {
    authService.signIn.mockRejectedValueOnce(new UnauthorizedException()); // Mock signIn method for invalid credentials

    return request(app.getHttpServer())
      .post("/auth/sign-in")
      .send({
        email: "invalid@example.com",
        password: "wrongpassword1!",
      })
      .expect(401); // Expecting 401 Unauthorized due to invalid credentials
  });

  afterEach(async () => {
    await app.close();
  });
});
