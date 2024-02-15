import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { FilterTaskDto } from './dto/filter-task.dto';

const mockUser = { id: 12, username: 'Test user' };

const mockTasksRepository = () => ({
    getAllTasks: jest.fn(),
    findOne: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let tasksRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TasksRepository, useFactory: mockTasksRepository },
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        tasksRepository = await module.get<TasksRepository>(TasksRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            tasksRepository.getAllTasks.mockResolvedValue('someValue');
            expect(tasksRepository.getAllTasks).not.toHaveBeenCalled();
            const filters: FilterTaskDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' };
            const result = await tasksService.getAllTasks(filters, mockUser);
            expect(tasksRepository.getAllTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls tasksRepository.findOne() and succesffuly retrieve and return the task', async () => {
            const mockTask = { id: 1, title: 'Test task', description: 'Test desc' };
            tasksRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(tasksRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    user: mockUser,
                }
            });
        });

        it('throws an error as task is not found', () => {
            tasksRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});