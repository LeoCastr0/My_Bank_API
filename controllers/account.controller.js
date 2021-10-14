//Receber os parametros da requisição, chamar o services e devolver a resposta

import AccountService from "../services/account.services.js";

async function createAccount(req, res, next){
    try {
        let account = req.body;

        if (!account.name || !account.balance == null){ //verifica se existe name e balance
            throw new Error("Name e Balance são obrigatórios.");
        }

        account =  await AccountService.createAccount(account); //passa o account como parametro para a execução da function e atribui o resultado da function a let account

        res.send(account);

        logger.info(`POST /account - ${JSON.stringify(account)}`);
    } catch(err){
        next(err);
    }
}

async function getAccounts(req, res, next){
    try {
        res.send(await AccountService.getAccounts());
        logger.info("GET / account");

    } catch(err){
        next(err);
    }
}

async function getAccount (req, res, next){
    try {
        res.send(await AccountService.getAccount(req.params.id)); //extraindo o ID que foi passado na URL
        logger.info("GET / account/:id");
         
    } catch(err){
        next(err);
    }
}

async function deleteAccount (req, res, next){
    try{
        await AccountService.deleteAccount(req.params.id);//passando como parametro o ID que está na URL
        logger.info(`DELETE /account/:id - ${req.params.id}`);
        res.end();
    } catch(err){
        next(err);
    }
}

async function updateAccount (req, res, next){
    try{
        const account = req.body;

        if (!account.id || !account.name || account.balance == null){ //verifica se existe ID, name e balance
            throw new Error("ID, Name e Balance são obrigatórios.");
        }

        res.send(await AccountService.updateAccount(account));

        logger.info(`PUT /account - ${JSON.stringify(account)}`);
    }catch(err){
        next(err);
    }
}

async function updateBalance(req, res, next){
    try{
        const account = req.body;

        if (!account.id || account.balance == null){ //verifica se existe name e balance
            throw new Error("ID e Balance são obrigatórios.");
        }
        
        res.send(await AccountService.updateBalance(account));

        logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);

    } catch (err){
        next(err);
    }
}

export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    updateAccount,
    updateBalance
};