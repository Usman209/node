import express from 'express';
import morgan from 'morgan';
import StudentRoute from './routes/StudentRoute';
import students from './data/students.json';
import _ from 'lodash';
import bodyParser from 'body-parser';
import https from 'https';
import path from 'path';

const port=3000;

const buildurl=(version,path)=>`/api/${version}/${path}`; 
const STUDENT_BASE_URL=buildurl('v1','students');

const server=express();

server.use(morgan('tiny'));

server.use(bodyParser.urlencoded({ extended: false }))
// server.use(bodyParser.json({ type: 'application/*+json' }));
server.use(bodyParser.json());
server.use('/sta',express.static('public'));   // for virtual path use sta could be any name
server.set('views', path.join('views'));
server.set('view engine','ejs');
server.get('/',(req,res)=>{
res.render('index',{
students:students

})

});
    
server.use(STUDENT_BASE_URL, StudentRoute);
server.get('/download/images/:imageName',(req,res)=>{
    res.download(path.join('public','images',req.params.imageName));
    });


// server.post(STUDENT_BASE_URL,(req,res)=>{
//     console.log("post request");
//     console.log(req.body);
//     students.push(req.body);
//     res.status(200).send("OK");
// });   



server.listen(3000, () => {
    console.log(`server started on port ${port}`);

});



