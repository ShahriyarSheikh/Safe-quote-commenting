import { Service } from "typedi";
import { BlogDetailsDB } from "../core/blog.schema";
import { BlogDetails } from "../model/request-models/blog/blogDetails.model";

@Service()
export class BlogRepository{
    
        public async saveAsync(model: BlogDetails): Promise<string | false> {
            return await new BlogDetailsDB(model).save().then((res:any) => res._id).catch((err:any) => console.log(err));
        }



}