import { UnauthorizedError, BadRequestError } from "routing-controllers";
import { HashHelper } from "../common/hash.helper";
import { Base64Helper } from "../common/base64.helper";
import { UserLogin } from "../model/request-models/user/userLogin.model";
import { UserPayload } from "../model/DTO/userPayload.model";
import { SecurityHelper } from "../common/security.helper";
import { UserRegister } from "../model/request-models/user/userRegister.model";
import { UserRepository } from "../repository/userRepository";
import { Service } from "typedi";
import { User } from "../model/DTO/user.model";
import { UserChangePassword } from '../model/request-models/user/userChangePassword.model';
import { UserUpdateProfile } from "../model/request-models/user/userUpdateProfile.model";
import { UserForgotPassword } from "../model/request-models/user/userForgotPassword.model";
import * as RandExp from "randexp";
import { EmailService } from "../emailManager/emailService";
var Bcrypt = require('bcryptjs');
import { TempEmailVerify } from "../model/DTO/tempUser.model";
import { VerifyRepository } from "../repository/verifyRepository";
import { UserLoginResponse } from "../model/response-models/user/login.response";
import { UserRegisterResponse } from "../model/response-models/user/register.response";
import { UserChangePasswordResponse } from "../model/response-models/user/changePassword.response";
import { UserUpdateProfileResponse } from "../model/response-models/user/updateProfile.response";
import { UserForgotPasswordResponse } from "../model/response-models/user/forgotPassword.response";
import { VerifyEmailResponse } from "../model/response-models/user/verifyEmail.response";
import { TempUserSessionRepository } from "../repository/tempUserSessionRepository";
import { UserFeedBack } from "../model/request-models/user/feedback.model";
import { FeedBack } from "../model/DTO/feedback.model";
import { UserFeedBackResponse } from "../model/response-models/user/feedBack.response";
import { UserStoreImageResponse } from "../model/response-models/user/storeImage.response";
import { EmailExistResponse } from "../model/response-models/user/emailExist.response";
const rp = require('request-promise');


@Service()
export class UserService {

    constructor(private userRepository: UserRepository,
        private emailService: EmailService,
        private verifyRepository: VerifyRepository,
        private tempUserSessionRepository: TempUserSessionRepository,
        ) { }

    public async loginAsync(model: UserLogin): Promise<UserLoginResponse> {

        let response = new UserLoginResponse();

        // Check If user exists in db
        let userDetail = await this.userRepository.findUserByUsernameAsync(model.username);
        if (userDetail == null) {
            response.message = "User does not exist.";
            response.isUserLoggedIn = false;
            return response;
        }
        // UnWrap Salt and hash from base64
        let _salt = Base64Helper.decode(userDetail.userSecrets.salt);
        let _existingHash = Base64Helper.decode(userDetail.userSecrets.hash);

        // Match hash
        let _hash = HashHelper.hash(model.password, _salt);
        if (_existingHash != _hash)
            throw new UnauthorizedError("Unauthorized");

        if (!userDetail.isEmailVerified) {
            response.message = "Your email is not verified, Please check your email and verify it.";
            response.isUserLoggedIn = false;
            return response;
        }
        if (userDetail.isUserBlocked) {
            response.message = "Sorry! Your account has blocked by Admin."
            response.isUserLoggedIn = false;
            return response;
        }

        // Generate JWT Token
        let _payload: UserPayload = {
            userId: userDetail._id,
            name: userDetail.fullname
        };

        response.isUserLoggedIn = true;
        response.token = SecurityHelper.createToken(_payload);

        var expiryDate = new Date();
        this.tempUserSessionRepository.saveUserSessionOrUpdateAsync({
            _id: userDetail._id,
            token: response.token,
            expireAt: expiryDate.setHours(expiryDate.getHours() + Number(process.env.JWT_EXPIRES.match(/\d+/g)[0]))
        });
        return response;
    }

    public async logoutAsync(userId: string): Promise<boolean> {
        return await this.tempUserSessionRepository.deleteUserSessionAsync(userId);
    }

    public async registerAsync(model: UserRegister): Promise<UserRegisterResponse> {

        let response = new UserRegisterResponse();

        // Check is email already exists
        let isUserExists = await this.userRepository.findUserByEmailAsync(model.email);
        if (isUserExists != null) {
            response.message = "Sorry! Email already registered.";
            response.isRegistered = false;
            return response;
        }

        // Check is username already exists
        isUserExists = await this.userRepository.findUserByUsernameAsync(model.username);
        if (isUserExists != null) {
            response.message = "Sorry! Username already exists.";
            response.isRegistered = false;
            return response;
        }

        // Generate salt and password hash
        let _salt = HashHelper.salt();
        let _hash = HashHelper.hash(model.password, _salt);

        // Searialize Model
        let userModel = <User>{
            email: model.email,
            fullname: model.fullname,
            city: model.city,
            dob: model.dob,
            gender: model.gender,
            isEmailVerified: false,
            isWalletCreated: false,
            isUserBlocked: false,
            phoneNumber: model.phoneNumber,
            username: model.username,
            userSecrets: {
                hash: Base64Helper.encode(_hash),
                salt: Base64Helper.encode(_salt)
            }
        };

        // Save to db
        var userId = await this.userRepository.saveAsync(userModel);

        var fs = require('fs'), bitmap = fs.readFileSync("./images/api/noimage.png");
        var encodedImage = Buffer.from(bitmap, 'binary').toString('base64');
        var ba64 = require("ba64"), base64Data = `data:image/png;base64,${encodedImage}`;
        ba64.writeImageSync(`./images/api/${userId}`, base64Data);

        let user = <User>{
            profileImg: `${userId}.png`
        }
        let _res = await this.userRepository.updateAsync(user, model.username);

        var isEmailSend = await this.sendEmailForVerification(<string>userId, userModel.email, userModel.username);

        response.isRegistered = isEmailSend;
        response.message = "Successfully Registered";

        return response;
    }
    public async isEmailExistAsync(emailAddress: string) {
        let response = new EmailExistResponse();
        let userDetail = await this.userRepository.findUserByEmailAsync(emailAddress);
        if (userDetail == null) {
            response.isExists = false
            response.message = "Email doesnot exist";
            return response;
        }
        response.isExists = true
        response.message = "Same email already exist";

        return response;
    }

    public async changePassword(userId: string, model: UserChangePassword) {
        let response = new UserChangePasswordResponse();

        let userDetail = await this.userRepository.findUserByIdAsync(userId);
        if (userDetail == null)
            throw new BadRequestError("User does not exist.");

        let _salt = Base64Helper.decode(userDetail.userSecrets.salt);
        let _existingHash = Base64Helper.decode(userDetail.userSecrets.hash);

        // Match hash
        let _hash = HashHelper.hash(model.oldPassword, _salt);
        if (_existingHash != _hash)
            throw new BadRequestError("Old password is incorrect.");

        _salt = HashHelper.salt();
        _hash = HashHelper.hash(model.newPassword, _salt);

        let userModel = <User>{
            userSecrets: {
                hash: Base64Helper.encode(_hash),
                salt: Base64Helper.encode(_salt)
            }
        };

        let _res = await this.userRepository.updateAsync(userModel, userDetail.username);
        if (_res) {
            response.message = "Check your email to recover your account.";
            this.emailService.sendEmail({
                to: userDetail.email,
                subject: "Change Password",
                templateName: "default",
                templateKeyValues: [
                    {
                        key: "message",
                        value: " Your password has been changed"
                    },
                    {
                        key: "baseRoute",
                        value: process.env.BASE_ROUTE
                    }
                ]
            });
        }

        response.isChanged = _res;
        response.message = "Successfully Changed";

        return response;
    }
    public async setProfileImage(file: any, userId: string) {
        let userDetail = await this.userRepository.findUserByIdAsync(userId);
        let response = new UserStoreImageResponse();
        var encodedImage = Buffer.from(file.buffer, 'binary').toString('base64');
        var ba64 = require("ba64"), base64Data = `data:${file.mimetype};base64,${encodedImage}`;
        var dateTimeTicks = new Date().getTime();
        ba64.writeImageSync(`./images/api/${userId}_${dateTimeTicks}`, base64Data);
        let user = <User>{
            profileImg: `${userId}_${dateTimeTicks}.${file.mimetype.split("/")[1]}`
        }
        let _res = await this.userRepository.updateAsync(user, userDetail.username);


        response.isSaved = true;
        response.message = "Successfully Updated";
        return response;

    }
    /**
     * async getProfileData
     */
    public async getProfileData(userId: string) {

        let userDetail = await this.userRepository.findUserByIdAsync(userId);
        let userModel = <User>{
            email: userDetail.email,
            fullname: userDetail.fullname,
            city: userDetail.city,
            dob: userDetail.dob,
            isEmailVerified: userDetail.email == userDetail.email,
            profileImg: userDetail.profileImg,
            gender: userDetail.gender,
            phoneNumber: userDetail.phoneNumber,
            username: userDetail.username,
        };

        return userModel;
    }


    public async profileUpdate(userId: string, model: UserUpdateProfile) {
        let response = new UserUpdateProfileResponse;

        let isEmail = await this.userRepository.findUserByEmailAsync(model.email);
        if (isEmail != null && isEmail._id != userId) {
            response.isChanged = false;
            response.message = "Email is already registered";
            return response;
        }


        let userDetail = await this.userRepository.findUserByIdAsync(userId);

        let userModel = <User>{
            email: model.email,
            fullname: model.fullname,
            city: model.city,
            dob: model.dob,
            isEmailVerified: model.email == userDetail.email,
            gender: model.gender,
            phoneNumber: model.phoneNumber
        };
        let isUserUpdated = await this.userRepository.updateAsync(userModel, userDetail.username);

        if (!userModel.isEmailVerified) {
            await this.sendEmailForVerification(userId, model.email, userDetail.username);
        }

        response.isChanged = isUserUpdated;
        response.message = "Successfully Updated";

        return response;
    }

    public async forgotPassword(model: UserForgotPassword) {
        let response = new UserForgotPasswordResponse();
        let userData = await this.userRepository.findUserByEmailAsync(model.email);
        if (userData == null) {
            response.message = "Sorry! Account doesn't exist.";
            response.isProcessed = false;
            return response;
        }

        const randexp = new RandExp(/([A-Za-z]{4}[%*&$#@^]{2}[0-9]{2})/);
        let newPassword = randexp.gen();
        let _salt = HashHelper.salt();
        let _hash = HashHelper.hash(newPassword, _salt);

        let userModel = <User>{
            userSecrets: {
                hash: Base64Helper.encode(_hash),
                salt: Base64Helper.encode(_salt)
            }
        };

        let _res = await this.userRepository.updateAsync(userModel, userData.username);
        if (_res) {
            response.message = "Check your email to recover your account.";
            this.emailService.sendEmail({
                to: userData.email,
                subject: "Forgot Password",
                templateName: "forgotPassword",
                templateKeyValues: [
                    {
                        key: "newPassword",
                        value: newPassword
                    },
                    {
                        key: "userName",
                        value: userData.username
                    },
                    {
                        key: "baseRoute",
                        value: process.env.BASE_ROUTE
                    }
                ]
            });
        }

        response.isProcessed = _res;
        return response;
    }

    public async verifyEmail(token: string) {
        let response = new VerifyEmailResponse();
        let userData = await this.verifyRepository.findUserByTokenAsync(token);

        let userDetail = await this.userRepository.findUserByUsernameAsync(userData.username);

        if (userDetail.isEmailVerified) {
            response.message = "Your email is already verified";
            return response;
        }

        if (userData == null) {
            response.message = "Sorry! invalid or expired token.";
            return response;
        }

        let userModel = <User>{
            isEmailVerified: true
        };

        //Save wallet credentials in repository
        if (!userDetail.isWalletCreated) {

            userModel.isWalletCreated = true;
        }

        await this.userRepository.updateAsync(userModel, userData.username);

        let tempUserModel = <TempEmailVerify>{

            isTokenVerified: true,
        }

        let _res = await this.verifyRepository.updateAsync(userData.username, tempUserModel);

        if (!_res) {
            response.message = " Try Again";
            return response;
        }

        response.message = "Your email has been verified";
        response.isVerifiedEmail = true;
        return response;

    }

    private async sendEmailForVerification(userId: string, email: string, username: string): Promise<boolean> {
        var data = Base64Helper.encode(Bcrypt.hashSync(`${username}${email}${userId}`, 8));

        var expiryDate = new Date();

        let tempUserModel = <TempEmailVerify>{
            token: data,
            isTokenVerified: false,
            username: username,
            expireAt: expiryDate.setDate(expiryDate.getDate() + Number(process.env.EXPIRE_EMAIL_TOKEN_DAYS))
        }

        let _res = await this.verifyRepository.saveTokenAsync(tempUserModel);

        if (_res) {
            var _path = process.env.BASE_ROUTE;
            this.emailService.sendEmail({
                to: email,
                subject: "Email verification",
                templateName: "verificationEmail",
                templateKeyValues: [
                    {
                        key: "url",
                        value: `${_path}/api/verifyEmail/${data}`
                    },
                    {
                        key: "baseRoute",
                        value: process.env.BASE_ROUTE
                    }
                ]
            });
        }
        return _res;
    }
    public async userFeedback(model: UserFeedBack, userId: string) {
        let response = new UserFeedBackResponse();
        let userDetail = await this.userRepository.findUserByIdAsync(userId);
        if (userDetail == null)
            throw new BadRequestError("User not found");

        let userFeedback = <FeedBack>{
            userId: userId,
            username: userDetail.username,
            fullname: userDetail.fullname,
            email: userDetail.email,
            phone: userDetail.phoneNumber,
            comments: model.comments,
        }
        let _res = await this.userRepository.saveFeedBackAsync(userFeedback);

        if (_res) {
            response.isSaved = _res;
            response.message = "Feedback submitted successfully";
            return response;
        }
    }

}