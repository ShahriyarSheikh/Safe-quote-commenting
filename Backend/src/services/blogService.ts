import { Service } from "typedi";
import { SettingRepository } from "../repository/settingRepository";
import { Settings } from "../model/DTO/setting.model";
import { BlogRepository } from "../repository/blogRepository";
import { BlogDetails } from "../model/request-models/blog/blogDetails.model";
import { genericApiResponse } from "../model/response-models/genericApiResponse";


@Service()
export class BlogService {

    constructor(private blogRepository: BlogRepository) {

    }

    public async addABlog(blogDetails:BlogDetails): Promise<string | false>{
        
        // Searialize Model
        let blogModel = <BlogDetails> {
            title : blogDetails.title,
            details :blogDetails.details,
            author :blogDetails.author,
            comments :blogDetails.comments
        };


        return await this.blogRepository.saveAsync(blogModel);
        
       
        
    }
}

