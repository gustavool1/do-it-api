import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksServices } from '../services/tasks.services';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { AppError } from 'src/errors/app-error';
import { SuccessResponse } from '../dtos/success-response.dto';

const taskPayload = {
  title: 'title',
  description: 'description',
  userId: '318d2839-bdb6-4f63-bef9-cfa052c1d907',
  completed: false,
};

const task = new Task({
  id: '1',
  completed: false,
  createdAt: new Date(),
  description: 'description',
  title: 'title',
});

const user = new User({
  id: '1',
  createdAt: new Date(),
  email: 'user@email.com',
  name: 'Magnus Carlsen',
  passwordHash: 'fakehash',
  tasks: [],
});

describe('TasksServices', () => {
  let tasksServices: TasksServices;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksServices,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            findOne: jest.fn().mockReturnValue(task),
            create: jest.fn().mockReturnValue(task),
            save: jest.fn().mockReturnValue(task),
            find: jest.fn().mockReturnValue([task]),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockReturnValue(user),
          },
        },
      ],
    }).compile();

    tasksServices = module.get<TasksServices>(TasksServices);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  describe('createTask', () => {
    it('Should create task', async () => {
      const response = await tasksServices.createTask(taskPayload);

      expect(response).toBeInstanceOf(Task);
    });

    it('Should throw an error, saying that user was not found', async () => {
      userRepository.findOne = jest.fn().mockReturnValue(false);
      try {
        await tasksServices.createTask(taskPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe('getUserTasks', () => {
    it("Should return a list with the user's tasks", async () => {
      const userId = 'fakeuserid';
      const response = await tasksServices.getUsersTasks(userId);

      expect(Array.isArray(response)).toBe(true);
      response.forEach((task) => expect(task).toBeInstanceOf(Task));
    });

    it('Should throw an error, saying that user was not found', async () => {
      userRepository.findOne = jest.fn().mockReturnValue(false);
      try {
        await tasksServices.createTask(taskPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe('completeTask', () => {
    const taskId = 'faketaskid';

    it('Should complete the task', async () => {
      const response = await tasksServices.completeTask(taskId);

      expect(response).toMatchObject<SuccessResponse>({
        message: expect.any(String),
        statusCode: 200,
      });
    });

    it('Should throw an error saying that didnt found the task', async () => {
      taskRepository.findOne = jest.fn().mockReturnValue(false);
      try {
        await tasksServices.completeTask(taskId);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(404);
      }
    });
  });
});
