import express from "express";
import winston from "winston";
import accountsRouter from "./routes/account.routes.js";
import {promises as fs} from "fs";
import cors from "cors";
import swaggerUi from "swagger-ui-express"; 
import { swaggerDocument } from "./doc.js";
import basicAuth from "express-basic-auth";

const {readFile, writeFile} = fs //destructing -> podemos utilizar os metodos sem o fs.

global.fileName = "accounts.json" //definindo como global

/******************** configurando winston para gravar log ***************************/
const { combine, timestamp, label, printf } = winston.format;
const MyFormat = printf (({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File) ({ filename: "MyBank_API.log" })
    ],
    format: combine (
        label ({ label: "MyBank_API" }),
        timestamp(),
        MyFormat
    )
});

/****************************************** Fim ******************************/

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors()); // instanciando o CORS para que paginas de outros servers possam consultar a API
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //definindo a rota da documentação

function getRole(username){
    if(username == 'admin'){
        return 'admin';
    }else if(username == 'leonardo'){
        return 'role1'
    }
};

function authorize (...allowed){

    const isAllowed = role => allowed.indexOf(role) > -1;

    return (req, res, next) =>{
        if(req.auth.user){
            const role = getRole(req.auth.user);

            if(isAllowed(role)){
                next();
            }else{
                res.status(401).send('Role not allowed');
            }
        } else{
            res.status(403).send('User not found');
        }
    };
};

app.use(basicAuth({
    authorizer: (username, password) =>{
       
       const userMatches = basicAuth.safeCompare(username, 'admin');
       const pwdMatches = basicAuth.safeCompare(password, 'admin');

       const user2Matches = basicAuth.safeCompare(username, 'leonardo');
       const pwd2Matches = basicAuth.safeCompare(password, '12345');

       return userMatches && pwdMatches || user2Matches && pwd2Matches;
    }
}));

app.use("/account", authorize('admin', 'role1'), accountsRouter);

app.listen(3000, async () =>{
    
    try{
        await readFile(global.fileName); // tenta executar o arquivo, se não conseguir, ele cria na função abaixo.
        logger.info("API Started!");
    } catch (err){
        const initialJson = {
            nextId: 1,
            accounts: []
        }
         writeFile(global.fileName, JSON.stringify(initialJson)).then(() =>{ //criando o arquivo JSON como string
            global.logger.info("API Started and File Created!");
         }). catch(err =>{
            global.logger.error(err);
         }); 
    }
    
});