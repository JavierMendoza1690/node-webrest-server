import http from 'http';
import fs from 'fs';

const port=8080;



const server = http.createServer((req, res) => {
    //* response method 1:
    // res.writeHead(200, {'Content-Type': 'text/html'});  // 200 is the status code
    // res.write(`<h1>This is the url: ${req.url} </h1>`);  //html content
    // res.end();

    //* response method 2:
    // const data = {name: 'John Doe', age: 30, city: 'New York'};
    // res.writeHead(200, {'Content-Type': 'application/json'});  // 200 is the status code
    // res.end( JSON.stringify(data) );

    //* response method 3:
    if(req.url === '/'){
        const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
        res.writeHead(200, {'Content-Type': 'text/html'});  // 200 is the status code
        res.end(htmlFile);
        return;
    }

    if( req.url?.endsWith('.js')){
        res.writeHead(200, {'Content-Type': 'application/javascript'});
    }else if(req.url?.endsWith('.css')){
        res.writeHead(200, {'Content-Type': 'text/css'});
    }

    const responseContent = fs.readFileSync(`./public/${req.url}`, 'utf-8');
    res.end(responseContent)
});


server.listen(port, ()=>{
    console.log(`server running on port ${port}`);
    
})