import express, {Application} from 'express';
import router from './api/routes/CoreRoutes';
const port: number = 3333;
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EndPoints for consumption --------------------------------

app.use('/api',router);



//Start server --------------------------------
try {
    app.listen(port,() => console.log(`Server started on port ${port}`) );
} catch (error) {
    console.log(error);
}

