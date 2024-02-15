import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { AddUpdateTaskDto } from './dto/add-update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';






@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository) { }
  getAllTasks(filterDto: FilterTaskDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getAllTasks(filterDto, user)
  }

  /* async creatTask(createTaskDto: AddUpdateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto
    const task: Task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN
    });
    await this.tasksRepository.save(task);
    return task;
  } */

  creatTask(createTaskDto: AddUpdateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.creatTask(createTaskDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: {
        id,
        user
      }
    })
    if (!task) {
      throw new NotFoundException(`Task with ${id} not found`)
    }
    return task
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`)
    }
  }

  updateTaskById(id: string, updateTaskDto: AddUpdateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.updateTaskById(id, updateTaskDto, user);
  }
}
