import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { Task } from '../entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { AppError } from 'src/errors/app-error';
import { SuccessResponse } from '../dtos/success-response.dto';

export class TasksServices {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTask(data: CreateTaskDto) {
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const task = new Task({
      title: data.title,
      description: data.description,
      completed: data.completed,
      user,
    });

    await this.taskRepository.create(task);
    await this.taskRepository.save(task);
    delete task.user;

    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id: id } });
  }

  async getUsersTasks(userId: string): Promise<Task[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return await this.taskRepository.find({
      where: { user: user },
      relations: ['user'],
    });
  }

  async completeTask(id: string): Promise<SuccessResponse> {
    const task = await this.getTaskById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    task.completed = true;
    this.taskRepository.save(task);
    return { message: 'Task completed successfully', statusCode: 200 };
  }

  async deleteTask(id: string): Promise<SuccessResponse> {
    const task = await this.getTaskById(id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully', statusCode: 200 };
  }
}
