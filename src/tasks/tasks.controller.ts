import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
// import { Task, TaskStatus } from './task.modal';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/pipes-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService){}

    @Get()
    @UsePipes(ValidationPipe)
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto){
        // if (Object.keys(filterDto).length) {
        //     return this.taskService.getTaskWithFilters(filterDto);  
        // } else {
        //     return this.taskService.getAllTasks();
        // } 

        return this.taskService.getTasks(filterDto);
    }

    @Get('/:id')
    getTasksById(@Param('id', ParseIntPipe) id: number): Promise<Task>{
        return this.taskService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTasksById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.taskService.deleteTasksById(id); 
    }
 
    @Patch('/:id/status')
    patchTasksById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return this.taskService.patchTasksById(id, status);
    }

    // @Post()
    // createTasks( 
    //     @Body('title') title : string,
    //     @Body('description') description : string,
    // ): Task {
    //     retur n this.taskService.createTasks(title, description);
    // }

    @Post() 
    @UsePipes(ValidationPipe)
    createTasks(
        @Body() createTaskDto : CreateTaskDto,
        @GetUser() user : User
    ): Promise<Task> {
        return this.taskService.createTasks(createTaskDto);
    }

}
