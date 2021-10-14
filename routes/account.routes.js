//Responsável por direcionar a solicitação para o controller

import express from "express";
import AccountController from "../controllers/account.controller.js"


const router = express.Router();

router.post("/", AccountController.createAccount);//passando função como parametro

router.get("/", AccountController.getAccounts);//passando a função como parametro

router.get("/:id", AccountController.getAccount);//passando a função como parametro

router.delete("/:id", AccountController.deleteAccount);

router.put("/", AccountController.updateAccount);

router.patch("/updateBalance", AccountController.updateBalance);

router.use((err, req, res, next) => {
    global.logger.error(`${req.method} ${req.baseUrl} ${err.message}`);
    res.status(400).send({ error: err.message });
});

export default router;