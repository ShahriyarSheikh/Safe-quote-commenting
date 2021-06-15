import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";
const fs = require('fs');

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next: (err: any) => any) {
        let log = `Date: ${new Date()} - `;
        log += `Status: ${error.httpCode || 500} - `;
        log += `Route: ${request.url} - `;
        log += `Name: ${error.name} - `;
        log += `Message: ${error.message} - `;
        log += `Message: ${response.message} - `;
        log += `Stack Trace: ${JSON.stringify(error.errors)} - `;
        log += `Ip Address: ${request.connection.remoteAddress}\n`;
        this.writeLogToFile(log)
        next(error);
    }

    private writeLogToFile(log: string) {
        let path = __dirname + "/../logs.txt";
        fs.appendFile(path, log, (err: any) => err);
    }
}

