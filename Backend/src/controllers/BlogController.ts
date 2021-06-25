import { JsonController, Post, Body, Get, HeaderParam, Authorized, Param, UseBefore }from "routing-controllers";
import { Service } from "typedi";
import { BlogDetails } from "../model/request-models/blog/blogDetails.model";
import { genericApiResponse } from "../model/response-models/genericApiResponse";
import { BlogService } from "../services/blogService";


//api/blog
@Authorized()
@Service()
@JsonController("/blog")
export class AuthController {

    constructor(private blogService:BlogService) {
    }

    
    @Post("/postblog")
    async loginAsync(@Body() model: BlogDetails): Promise<string | false> {
        return await this.blogService.addABlog(model);
    }

}
