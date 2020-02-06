import { Injectable, NotFoundException } from '@nestjs/common';
// import { Task, TaskStatus } from './task.modal';
// import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository : TaskRepository,
    ) {} 
    // private tasks: Task[] = [];

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    // getAllTasks() : Task[]{
    //     return this.tasks;
    // }

    // getTaskWithFilters(filterDto : GetTasksFilterDto): Task[] {

    //     const { status, search } = filterDto;

    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //     if (search) {
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) ||
    //             task.description.includes(search) 
    //         );
    //     }

    //     return tasks;

    // }

    // async getAllTasks(): Promise<Task> {
    //     return this.taskRepository.getAllTasks();
    // }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`Task with id '${id}' Not Found`);
        }
        return found;
    }

    // getTaskById(id: string): Task {   

    //     const found =  this.tasks.find(task => task.id === id );

    //     if(!found) {
    //         throw new NotFoundException(`Task with id '${id}' Not Found`);
    //     }

    //     return found;
    // }

    // deleteTasksById(id: string): Task[]{

    //     const found = this.getTaskById(id);

    //     this.tasks =  this.tasks.filter(data => data.id !== found.id);

    //     return this.tasks; 
    // }

    async deleteTasksById(id: number): Promise<void> {

        // return this.taskRepository.deleteTask(id);
        const result = await this.taskRepository.delete(id);
        
        if(result.affected === 0) {
            throw new NotFoundException(`Task with id '${id}' Not Found`);
        }

    }


    async patchTasksById(id: number, status: TaskStatus): Promise<Task> {

        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;

    } 
    // patchTasksById(id: string, status: TaskStatus): Task{

    //     const task = this.getTaskById(id);

    //     task.status = status;

    //     return task;
    // }

    async createTasks(createTaskDto: CreateTaskDto): Promise<Task> {

        return this.taskRepository.createTask(createTaskDto);

    }


    // createTasks(createTaskDto: CreateTaskDto): Task {

    //     const { title, description } = createTaskDto;

    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     };

    //     this.tasks.push(task);
    //     return task;
    // }
}
