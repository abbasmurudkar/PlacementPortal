import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import routerAuth from './Routing/path.js'
import routerPost from './Routing/AddComapny.js'
import StudentRouter from './Routing/StudentData.js'
import AnalyticsRouter from './Routing/Analytics.js'
const PORT = 8000;
const app = express();
app.use(bodyParser.json({limit:"100mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"100mb",extended:true}));

app.use(express.json());
app.use(routerAuth);
app.use(routerPost)
app.use(StudentRouter)
app.use(AnalyticsRouter)
app.use(cors());

const CONNECTION_URL = 'mongodb+srv://abbasmurudkar18:abbas123@cluster0.bbdhf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.listen(PORT,(res,req)=>{
    console.log(`listening on ${PORT}`);
}) 
mongoose.connect(CONNECTION_URL).then(()=>{ 
    console.log(`Database Connected On: ${PORT}`) 
})

 