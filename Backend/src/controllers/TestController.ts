import { JsonController, Get, Authorized, HeaderParam, Render } from "routing-controllers";
import { Service } from "typedi";
import { UserPayload } from "../model/DTO/userPayload.model";
import { EmailService } from "../emailManager/emailService";
const fs = require('fs');
const path = require('path')

@Service()
@JsonController("/test")
export class TestController {
    constructor(private email:EmailService){
        
    }

    @Authorized()
    @Get("/test")
    async test(@HeaderParam("payload") payload: UserPayload) {
        console.log(payload.userId);
        return `User Id: ${payload.userId} - Name: ${payload.name}`;
    }

    @Get("/abc")
    abc() {
        var relativePath = path.resolve(process.cwd(),`templates/verificationEmail.html`);
        var data = fs.readFileSync(`${relativePath}`,'utf8');
        return JSON.stringify(data);
    }
    
    @Get("/path")
    path() {
        return `${process.env.BASE_ROUTE}/api/verifyEmail/`;
    }

    @Get("/version")
    getversion(){
        return "12/20/2018 version deployed with auth bug fixed"
    }
}

