import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    // @InjectRepository(TaskRepository)
    private TaskRepository: TaskRepository,
  ) {}

  async getAllTask(): Promise<Task[]> {
    return this.TaskRepository.find();
  }

  async getTaskWithFilters(
    filterdto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.TaskRepository.getTask(filterdto, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.TaskRepository.createTask(createTaskDto, user);
  }
  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.TaskRepository.findOneBy({ id, userId: user.id });

    if (!found) throw new NotFoundException(`Task with ID"${id}" not found!`);
    return found;
  }
  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.TaskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID"${id}" not found!`);
    }
  }
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await task.save();

    return task;
  }
}
