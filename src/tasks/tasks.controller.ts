import { Body, Controller, Get, Post, Param, Delete, Patch, Query, HttpCode, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AddUpdateTaskDto } from './dto/add-update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';


import { ConfigService } from '@nestjs/config';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/user-decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(
    private tasksService: TasksService,
    private configservice: ConfigService
  ) {
    //Acess env variable
    console.log("env variable for .env file:::", this.configservice.get('APP_ENV'))
  }

  @Get()
  getAllTasks(
    @Query() filterDto: FilterTaskDto,
    @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`Task of ${user.username}. Filter params: ${JSON.stringify(filterDto)}`);
    return this.tasksService.getAllTasks(filterDto, user);
  }

  @Post()

  //Use dto
  createTask(
    @Body() createTaskDto: AddUpdateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.creatTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
  }

  @Patch('/:id')
  //@HttpCode(204)
  updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskDto: AddUpdateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTaskById(id, updateTaskDto, user);
  }
}