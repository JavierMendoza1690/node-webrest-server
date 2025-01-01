import express from 'express';
import path from 'path';

export interface Options{
    port: number;
    public_path?: string;
}

export class Server {
    //* Attribute Declarations
    private app = express();
    private readonly port:number;
    private readonly publicPath: string;

    constructor(options: Options){

        const {port, public_path = 'public'} = options
        this.port = port;
        this.publicPath = public_path;

    }

    //* start method
    async start(){

        //* Middlewares

        //* Usando Public folder en el path seleccionado
        this.app.use(express.static( this.publicPath ))

        //* comodin para cualquier ruta que que no sea la raiz
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