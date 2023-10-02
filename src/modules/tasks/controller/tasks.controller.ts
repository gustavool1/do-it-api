import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { TasksServices } from '../services/tasks.services';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksServices: TasksServices) {}

  @Post()
  async createTask(@Body() data: CreateTaskDto): Promise<any> {
    return this.tasksServices.createTask(data);
  }

  @Get()
  async getUserTasks(@Query('userId') userId: string) {
    return await this.tasksServices.getUsersTasks(userId);
  }

  @Patch('/:id')
  async completeTask(@Param('id') id: string) {
    return await this.tasksServices.completeTask(id);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string) {
    return await this.tasksServices.deleteTask(id);
  }
}
