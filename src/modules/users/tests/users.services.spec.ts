import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersServices } from '../services/users.services';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AppError } from 'src/errors/app-error';
import * as bcrypt from 'bcrypt';

const createUserPayload = {
  name: 'Gustavo Oliveira',
  email: 'gustavo@email.com',
  password: '123456',
};

const user = new User({
  id: '1',
  createdAt: new Date(),
  email: 'user@email.com',
  name: 'Magnus Carlsen',
  passwordHash: 'fakehash',
  tasks: [],
});

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('UsersServices', () => {
  let usersServices: UsersServices;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersServices,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(user),
            create: jest.fn().mockReturnValue(user),
            save: jest.fn().mockReturnValue(user),
          },
        },
      ],
    }).compile();

    usersServices = module.get<UsersServices>(UsersServices);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('createUser', () => {
    it('Should create an user', async () => {
      usersRepository.findOne = jest.fn().mockReturnValue(null);

      const response = await usersServices.createUser(createUserPayload);

      expect(response).toMatchObject({
        name: expect.any(String),
        email: expect.any(String),
        passwordHash: expect.any(String),
        id: expect.any(String),
        createdAt: expect.any(Date),
      });

      expect(usersRepository.findOne).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledTimes(1);
    });

    it('Should throw an error with status code 409 that the email already exists', async () => {
      usersRepository.findOne = jest.fn().mockReturnValue(user);
      try {
        await usersServices.createUser(createUserPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(409);
      }
    });
  });

  describe('signIn', () => {
    const signInData = { email: 'gustavo@gmail.com', password: '123456' };

    it('Should sign in with the user and return an SignInResponse', async () => {
      user.passwordHash = await bcrypt.hash(signInData.password, 10);

      jwtService.signAsync = () => Promise.resolve('randomjwt');
      usersRepository.findOne = jest.fn().mockReturnValue(user);

      const response = await usersServices.signIn(signInData);

      expect(response).toMatchObject({
        accessToken: expect.any(String),
        id: expect.any(String),
      });
    });

    it('Should return an AppError with the message user with this email dont exist and status code 409', async () => {
      try {
        await usersServices.signIn(signInData);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(404);
      }
    });

    it('Should return an AppError with the message Password incorrect and status code 400', async () => {
      try {
        const compareMock = jest.spyOn(bcrypt, 'compare') as jest.Mock;
        compareMock.mockResolvedValue(false);

        usersRepository.findOne = jest.fn().mockReturnValue(user);
        await usersServices.signIn(signInData);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(400);
      }
    });
  });
});
