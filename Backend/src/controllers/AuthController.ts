import { Service } from "typedi";
import { UserService } from "../services/userService";
import { UserLogin } from "../model/request-models/user/userLogin.model";
import { UserRegister } from "../model/request-models/user/userRegister.model";
import { UserForgotPassword } from "../model/request-models/user/userForgotPassword.model";
import { UserLoginResponse } from "../model/response-models/user/login.response";
import { UserRegisterResponse } from "../model/response-models/user/register.response";
import { UserForgotPasswordResponse } from "../model/response-models/user/forgotPassword.response";
import { UserPayload } from "../model/DTO/userPayload.model";
import { EmailExistResponse } from "../model/response-models/user/emailExist.response";
import { ThrottleMiddleware } from "../middlewares/throttleMiddleware";
import { Authorized, Body, Get, HeaderParam, JsonController, Param, Post, UseBefore } from "routing-controllers";

//api/auth/login
@Service()
@JsonController("/auth")
export class AuthController {

    constructor(private userService: UserService) {
    }

    @Post("/login")
    async loginAsync(@Body() model: UserLogin): Promise<UserLoginResponse> {
        return await this.userService.loginAsync(model);
    }

    @Post("/register")
    async registerAsync(@Body() model: UserRegister): Promise<UserRegisterResponse> {
        return await this.userService.registerAsync(model);
    }

    @Post("/forgotPassword")
    async forgotpassword(@Body() model: UserForgotPassword): Promise<UserForgotPasswordResponse> {
        return await this.userService.forgotPassword(model);
    }

    @Authorized()
    @Get("/logout")
    async logoutAsync(@HeaderParam("payload") payload: UserPayload): Promise<boolean> {
        return await this.userService.logoutAsync(payload.userId);
    }
    
    @UseBefore(ThrottleMiddleware)
    @Get("/isEmailExist/:emailAddress")
    async isEmailExist(@Param("emailAddress") emailAddress: string): Promise<any> {
        return await this.userService.isEmailExistAsync(emailAddress);
    }
}
