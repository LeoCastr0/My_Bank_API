//Responsável por receber a chamada do service e realizar a persistencia com o banco.

import {promises as fs} from "fs";
const {readFile, writeFile} = fs //destructing -> podemos utilizar os metodos sem o fs

async function getAccounts(){
    const data = JSON.parse(await readFile (global.fileName));
    return data.accounts;
}

async function getAccount(id){
    const accounts = await getAccounts();
    const account = accounts.find(account => account.id === parseInt(id));//procura dentro do array accounts o id que foi passado por parametro
    if(account){ // se account == true então retorno
        return account;
    }
    //se não, joga o erro
    throw new Error("Registro não encontrado.");
}

async function insertAccount(account){

    const data = JSON.parse(await readFile (global.fileName));

    account = {
        id: data.nextId ++,
        name: account.name,
        balance: account.balance 
    }; //criando o objeto e incrementando o ID
            
    data.accounts.push(account);

    await writeFile (global.fileName, JSON.stringify(data, null, 2));
    
    return account;
}

async function deleteAccount(id){
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts =  data.accounts.filter(account =>
         account.id !== parseInt(id)) //retorna somente a condção verdadeira
    await writeFile(global.fileName, JSON.stringify(data, null, 2)); 
}

async function updateAccount(account){
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(a => a.id === account.id); //identifica o indice passado no body com o que está no arquivo
    
    if (index === -1){
        throw new Error("Registro não encontrado");
    };

    data.accounts[index].name = account.name; // substitui os valores de accounts pelo contido em account[index]
    data.accounts[index].balance = account.balance; // substitui os valores de accounts pelo contido em account[index]
    await writeFile (global.fileName, JSON.stringify(data, null, 2)); //sobrescreve o arquivo

    return data.accounts[index];
}

export default{
    getAccounts,
    insertAccount,
    getAccount,
    deleteAccount,
    updateAccount
}