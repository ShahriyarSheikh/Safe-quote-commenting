import * as Mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

export class MongoServer {

    private connection: string = <string>process.env.MONGO_CONNECTION;
    private mongoClient: boolean = Boolean(process.env.MONGO_RECONNECT);
    

    constructor() {
        (<any>Mongoose).Promise = global.Promise;
    }

    public async connect(): Promise<Mongoose.Mongoose> {
        Mongoose.set('useCreateIndex', true);
        Mongoose.set('useFindAndModify', false);
        try {
            var result = await Mongoose.connect(this.connection, {
                useNewUrlParser: this.mongoClient
            });
            return result;
        } catch (error) {
            console.log(error.message);
            process.exit();
        }
        
        return null;
    }
}

