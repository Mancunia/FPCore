
import express, {Application} from 'express';
import router from './api/routes/index';

import { SequelizeInstance } from './utilities/config';
import dbInit from './db/init';

const port: number = 3333;
const app: Application = express();


//express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EndPoints for consumption --------------------------------

app.use('/api',router);

//Database --------------------------------
SequelizeInstance.connectToDBs().then(() => {
    dbInit()
    app.emit("ready")
}).catch(err => {
    console.error(err)
    app.emit("error")
})




//Start server --------------------------------
app.on("ready", () => {
try {
    app.listen(port,() => console.log(`Server started on port ${port}`) );
} catch (error) {
    console.log(error);
}
})

