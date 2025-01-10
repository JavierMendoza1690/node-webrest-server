import {prisma} from '../../data/postgres'
import { error } from "console";
import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

interface Todos {
  id: number;
  text: string
  completedAt: Date | null

}
// let todos: Todos[] = [
//     { id: 1, text: "Buy milk",    completedAt: new Date() },
//     { id: 2, text: "Buy bread",   completedAt: new Date() },
//     { id: 3, text: "Buy butter",  completedAt: new Date()  },
// ];

export class TodosController {
    //*DI
    constructor() {}

    // get todo
    public getTodos = async(req: Request, res: Response) => {

      const todos = await prisma.todo.findMany();
        res.json(todos);
    };

    //get todo por  id
    public getTodoById = async (req:Request, res:Response): Promise<any> =>{
      
      const id = +req.params.id;  // el signo + pasa a entero el string
      if( isNaN(id) ) return res.status(400).json({error: 'ID argument is not a number'})
      
      // const todo = todos.find(todo => todo.id === id);
      const todo = await prisma.todo.findFirst({where:{ id }})
      
      todo 
        ? res.json(todo)
        : res.status(404).json({error: `Todo with id ${id} not found`})
    }

    //crear un todo
    public createTodo = async (req: Request, res: Response):Promise<any> =>{
      
      const [error, createTodoDto] = CreateTodoDto.create(req.body);
      if(error) res.status(400).json({ error})
        
        const todo = await prisma.todo.create({
          data: createTodoDto!
        });

        res.status(200).json(todo)
    }

    //actualizar todo
    public updateTodo = async (req:Request, res: Response):Promise<any> =>{
      const id = +req.params.id   //leyendo id de los params
      const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});

      if(error) return res.status(400).json({error});

      const todo = await prisma.todo.findFirst({where :{id}});
      if(!todo) return res.status(404).json(`todo with id ${id} not found`)

 
      const updateTodo = await prisma.todo.update({
        where:{id},
        data: updateTodoDto!.values
      })
      
      res.json(updateTodo)
    }

    //delete
    public deleteTodo = async(req:Request, res: Response):Promise<any> =>{
      const id = +req.params.id;

      const findTodo = await prisma.todo.findFirst({where :{id}});
      if(!findTodo){
        return res.status(404).json({error: `Todo with id ${id} not found`})
      }

      const deleted = await prisma.todo.delete({where:{id}});

      (deleted)
      ? res.json(deleted)
      : res.status(400).json({error: `Todo with id ${id} not found`})
      

      res.json({findTodo, deleted})


    }
}
