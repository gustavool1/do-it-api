import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersServices } from './services/users.services';
import { UsersController } from './controller/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersServices],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
})
export class UsersModule {}
