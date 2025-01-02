import { error } from "console";
import { Request, Response } from "express";

interface Todos {
  id: number;
  text: string
  completedAt: Date | null

}
let todos: Todos[] = [
    { id: 1, text: "Buy milk",    completedAt: new Date() },
    { id: 2, text: "Buy bread",   completedAt: new Date() },
    { id: 3, text: "Buy butter",  completedAt: new Date()  },
];

export class TodosController {
    //*DI
    constructor() {}

    // get todo
    public getTodos = (req: Request, res: Response) => {
        res.json(todos);
    };
    //get todo por  id
    public getTodoById = (req:Request, res:Response): any =>{
      const id = +req.params.id;  // el signo + pasa a entero el string
      if( isNaN(id) ) return res.status(400).json({error: 'ID argument is not a number'})
      
      const todo = todos.find(todo => todo.id === id);
      
      todo 
        ? res.json(todo)
        : res.status(404).json({error: `Todo with id ${id} not found`})
    }

    //crear un todo
    public createTodo = (req: Request, res: Response):any =>{
      const {text} = req.body
      if(!text) return res.status(400).json({error: 'Text property is required'})
      
        const newTodo = {
          id: todos.length +1,
          text: text,
          completedAt: new Date(),
        }
      
        todos.push( newTodo );

        res.status(200).json(todos)
    }

    //actualizar todo
    public updateTodo = (req:Request, res: Response):any =>{
      const id = +req.params.id   //leyendo id de los params
      if( isNaN(id) ) return res.status(400).json({error: 'ID argument is not a number'});

      const todo = todos.find(todo =>todo.id === id);
      if(!todo) return res.status(404).json(`todo with id ${id} not found`)

      const {text, completedAt} = req.body   //propiedades extraidas del body

      todo.text = (text || todo.text);
      completedAt === 'null' 
        ?todo.completedAt=  null
        :todo.completedAt = new Date( completedAt || todo.completedAt)

      todo.text = text; //! OJO, referencia. mutando informacion

      res.json(todo)
    }

    //delete
    public deleteTodo = (req:Request, res: Response):any =>{
      const id = +req.params.id;

      const findTodo = todos.find(todo=>todo.id === id);
      if(!findTodo){
        return res.status(404).json({error: `Todo with id ${id} not found`})
      }

      const newTodos = todos.filter(todo =>todo.id!==id);
      todos = newTodos;
      

      res.json(findTodo)


    }
}
