import { NextFunction, Request, Response } from "express";

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
    const fechaHora = new Date().toISOString();
    console.log(`método ${req.method} a ruta ${req.url}. fecha-hora: ${fechaHora}`);
    next()
}