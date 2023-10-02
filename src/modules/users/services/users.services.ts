import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, SignInDto } from '../dtos/dtos';
import { AppError } from 'src/errors/app-error';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(userData: CreateUserDto): Promise<any> {
    const hasUserWithThisEmail = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (hasUserWithThisEmail) {
      throw new AppError('An account with this email already exists', 409);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    delete userData.password;

    const user = await this.usersRepository.create({
      ...userData,
      passwordHash: hashedPassword,
    });

    await this.usersRepository.save(user);

    return user;
  }

  async signIn(signInData: SignInDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: signInData.email },
    });

    if (!user) {
      throw new AppError('An user with this email dont exist', 404);
    }
    const passwordMatchesHash = await bcrypt.compare(
      signInData.password,
      user.passwordHash,
    );

    if (!passwordMatchesHash) {
      throw new AppError('Password incorrect', 400);
    }

    this.usersRepository.save(user);

    return {
      accessToken: await this.jwtService.signAsync(
        {
          ...signInData,
          id: user.id,
        },
        {
          expiresIn: process.env.JWT_EXPIRES_SECRET_TOKEN,
          secret: process.env.JWT_SECRET_TOKEN,
        },
      ),
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
