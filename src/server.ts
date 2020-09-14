import * as bodyParser from 'body-parser';

import { Server } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import session from 'express-session';

class BackendServer extends Server {
    public app = express()
    private readonly SERVER_STARTED = 'Example server started on port: ';

    constructor () {
        super();

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(session({ secret: 'S3CRE7', resave: true, saveUninitialized: true }));

        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());



    }

    public start(port: string): void {

        this.app.get("/", (req: express.Request, res: express.Response) => {
            res.status(200).json({"msg": "Hello, World"})
        });

        this.app.listen(port, () => {
            console.log(this.SERVER_STARTED + port);
        });

    }
}

export { BackendServer }