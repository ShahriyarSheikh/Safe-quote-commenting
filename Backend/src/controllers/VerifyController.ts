import { JsonController, Get, Authorized, HeaderParam, Param, Render } from "routing-controllers";
import { Service } from "typedi";
import { UserService } from "../services/userService";

@Service()
@JsonController()
export class VerifyController {

    constructor(private userService: UserService) {

    }

    @Get("/verifyEmail/:token")
    @Render("index")
    async verify(@Param("token") token: string) {
         var response = await this.userService.verifyEmail(token);
         
         return {
            param: response.message,
        };
    }
}