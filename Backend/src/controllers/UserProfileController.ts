import { JsonController, Authorized, HeaderParam, Post, Body, Get, UploadedFile } from "routing-controllers";
import { Service } from "typedi";
import { UserPayload } from "../model/DTO/userPayload.model";
import { UserService } from "../services/userService";
import { UserChangePassword } from '../model/request-models/user/userChangePassword.model';
import { UserUpdateProfile } from "../model/request-models/user/userUpdateProfile.model";
import { User } from "../model/DTO/user.model";
import { UserChangePasswordResponse } from "../model/response-models/user/changePassword.response";
import { UserUpdateProfileResponse } from "../model/response-models/user/updateProfile.response";
import { UserFeedBack } from "../model/request-models/user/feedback.model";

@Authorized()
@Service()
@JsonController("/userprofile")
export class UserProfileController {

    constructor(private userService: UserService) {
    }

    @Get("/getProfile")
    async getProfileAsync(@HeaderParam("payload") payload: UserPayload): Promise<User> {
        return await this.userService.getProfileData(payload.userId);
    }

    @Post("/setProfileImage")
    async saveProfileImage(@UploadedFile("profileImage") file: any , @HeaderParam("payload") payload: UserPayload) {
       return await this.userService.setProfileImage(file,payload.userId);
    }

    @Post("/changePassword")
    async changepasswordAsync(@Body() model: UserChangePassword, @HeaderParam("payload") payload: UserPayload): Promise<UserChangePasswordResponse> {
        return await this.userService.changePassword(payload.userId, model);

    }

    @Post("/updateProfile")
    async updateAsync(@Body() model: UserUpdateProfile, @HeaderParam("payload") payload: UserPayload): Promise<UserUpdateProfileResponse> {
        return await this.userService.profileUpdate(payload.userId, model);
    }

    @Post("/feedback")
    async feedbackasync(@Body() model: UserFeedBack, @HeaderParam("payload") payload: UserPayload): Promise<any> {
        return await this.userService.userFeedback(model, payload.userId);
    }
}