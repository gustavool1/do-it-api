import { Module } from '@nestjs/common';
import { TasksController } from './controller/tasks.controller';
import { TasksServices } from './services/tasks.services';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [TasksController],
  providers: [TasksServices],
  imports: [TypeOrmModule.forFeature([Task, User])],
})
export class TasksModule {}
