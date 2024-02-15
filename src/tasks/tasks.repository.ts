import { DataSource, Repository } from "typeorm";
import { Task } from "./task.entity";
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { AddUpdateTaskDto } from "./dto/add-update-task.dto";
import { TaskStatus } from "./task-status.enum";
import { FilterTaskDto } from "./dto/filter-task.dto";
import { User } from "../auth/user.entity";


@Injectable()
export class TasksRepository extends Repository<Task> {
    private logger = new Logger('TasksController');

    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async getAllTasks(filterDto: FilterTaskDto, user: User): Promise<any> {
        const { status, search } = filterDto;
        //const query = this.createQueryBuilder(<name of entity>); // EX. import { Task } from "./task.entity";
        const query = this.createQueryBuilder('task');
        query.where({ user });
        if (status) {
            query.andWhere("task.status = :status", { status });
        }

        if (search) {
            query.andWhere("(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)", { search: `%${search.toLowerCase()}%` });
        }

        //console.log("Print query", query.getQuery()); //Working
        //console.log("Print query", query.getSql()); //Working

        //console.log("Print query", query.printSql()); //Not Working

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(
                `Failed to get tasks for ${user.username}. Filter params: ${JSON.stringify(filterDto)}`,
                error.stack
            );
            throw new InternalServerErrorException()
        }

    }

    async creatTask(createTaskDto: AddUpdateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto
        const task: Task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user, //Orm will be insert userid in task table. Column name will be userId
        });
        await this.save(task);
        return task;

    }

    async updateTaskById(id: string, updateTaskDto: AddUpdateTaskDto, user: User): Promise<Task> {
        const result = await this.update({ id, user }, updateTaskDto);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ${id} not found`)
        }
        return await this.findOne({
            where: {
                id,
                user
            }
        })
    }
}