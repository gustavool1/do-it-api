import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import Database from './database';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), Database.build(), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
