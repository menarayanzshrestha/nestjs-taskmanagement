import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    

    // async getAllTasks(): Promise<Task> {

      
    //     const data = await Task.find();

    //     return data;
    // }

    async getTasks(filterDto : GetTasksFilterDto):Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task'); 

        if(status){
            query.andWhere('task.status = :status', { status } );
        }

        if(search){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        const tasks = await query.getMany();

        return tasks;

    }
    
    async createTask(createTaskDto : CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();

        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;

        await task.save();

        return task;
    }

    // async deleteTask(id : number): Promise<Task> {
    
    //     const found = this.getTaskById(id);

    //     this.tasks =  this.tasks.filter(data => data.id !== found.id);

    //     return this.tasks;

    // }
} 