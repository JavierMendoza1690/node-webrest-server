import express, { Router } from 'express';
import path from 'path';

export interface Options{
    port: number;
    routes: Router;
    public_path?: string;
}

export class Server {
    //* Attribute Declarations
    private app = express();
    private readonly port:number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options){

        const {port, public_path = 'public', routes} = options
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes

    }

    //* start method
    async start(){

        //* Middlewares
        this.app.use(express.json());                        //parsear a json automaticamente las peticiones
        this.app.use(express.urlencoded({extended: true}));  //habilitando lectura de x-www-form-urlendcoded

        //* Usando Public folder en el path seleccionado
        this.app.use(express.static( this.publicPath ))

        //* Routes
        this.app.use( this.routes);
 

        //* comodin para cualquier spa
        this.app.get('*',(req,res)=>{
           const indexPath = path.join(__dirname + `../../../${ this.publicPath }/index.html`);
           res.sendFile(indexPath);
            
        })
        
        //* Activando el puerto para mostrar informacion del backend
        this.app.listen(this.port, ()=>{
            console.log(`server running in port ${this.port}`);
            
        })
        
    }

}