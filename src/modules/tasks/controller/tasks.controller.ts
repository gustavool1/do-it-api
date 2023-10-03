import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TasksServices } from '../services/tasks.services';
import { AuthGuard } from 'src/guards/auth.guard';
import { Task } from '../entities/task.entity';
import { SuccessResponse } from '../dtos/success-response.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksServices: TasksServices) {}

  @UseGuards(AuthGuard)
  @Post()
  async createTask(@Body() data: CreateTaskDto): Promise<Task> {
    return this.tasksServices.createTask(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserTasks(@Query('userId') userId: string): Promise<Task[]> {
    return await this.tasksServices.getUsersTasks(userId);
  }
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async completeTask(@Param('id') id: string): Promise<SuccessResponse> {
    return await this.tasksServices.completeTask(id);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<SuccessResponse> {
    return await this.tasksServices.deleteTask(id);
  }
}
