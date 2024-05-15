import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/models";
import * as bcrypt from "bcrypt";

const mockUserService = {
  create: jest.fn(),
  findOneByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockResolvedValue("mock-access-token"),
};

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  describe("signUp", () => {
    it("should create a new user and return an access token on successful signup", async () => {
      const user: IUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      const hashedPassword = await bcrypt.hash(user.password, 12);
      const mockCreatedUser = { ...user, userID: 1, password: hashedPassword };

      mockUserService.create.mockResolvedValueOnce(mockCreatedUser);

      const result = await authService.signUp(user);

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: user.email,
        }),
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: mockCreatedUser.userID,
      });
      expect(result).toEqual({ accessToken: "mock-access-token" });
    });

    it("should throw an error if a user with the same email already exists", async () => {
      const user: IUser = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      mockUserService.create.mockRejectedValueOnce(
        new Error("Email already exists"),
      );

      await expect(authService.signUp(user)).rejects.toThrowError(
        "Email already exists",
      );
    });
  });

  describe("signIn", () => {
    it("should return an access token on successful login", async () => {
      const password = "password123";
      const user = {
        email: "test@example.com",
        password: await bcrypt.hash(password, 12),
        userID: 1,
      };

      mockUserService.findOneByEmail.mockResolvedValueOnce(user);

      const result = await authService.signIn(user.email, password); // Use plain password for comparison
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(user.email);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.userID,
        email: user.email,
      });
      expect(result).toEqual({ accessToken: "mock-access-token" });
    });

    it("should throw an UnauthorizedException on invalid credentials", async () => {
      const email = "test@example.com";
      const password = "wrongpassword";

      mockUserService.findOneByEmail.mockResolvedValueOnce({
        email,
        password: "hashedPassword",
      });

      await expect(authService.signIn(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
