import express from 'express'; 
import _ from 'lodash';
import students from '../data/students.json';
import mongoose from 'mongoose';

const DB_USER='usernode';
const DB_USER_PASSWORD='usernode1';

const DB_URl=`mongodb://${DB_USER}:${DB_USER_PASSWORD}@ds263590.mlab.com:63590/sandboxing`;

mongoose.connect(DB_URl);
const db=mongoose.connection;
db.once('open',()=>{
console.log('connnected to the db');
});
const StudentSchema=mongoose.Schema({
    _id:mongoose.Schema.ObjectId,
    name:String,
    course:String
});

const StudentModel=mongoose.model('Student',StudentSchema);

const router=express.Router();

 let studentsArray =students;



router.get('/:id',(req,res)=>{      //like here replace '/:id'
    // const student=_.find(studentsArray,student=>student.id===req.params.id);
    // if(student){
    //     res.json(student);
    // }
    // else
    // {
    //      res.send(`User with id:${req.params.id} not found`);
    // }
    StudentModel.findById(req.params.id,(err,student)=>{
        if(err) res.status(500).send(err);
        if(student){
            res.json(student);
        }
        else
        {
            res.status(404).send(`user with id ${req.params.id} not found`);
        }
    });
  
});

router.get('/',(req,res)=>{
    // res.json(studentsArray);
    // res.end();
    StudentModel.find((err,students)=>{
        if(err) res.status(500).send(err);
        res.json(students);

    });
    
}); 
router.post('/',(req,res)=>{
    // console.log("post request");
    //  console.log(req.body);
    //  students.push(req.body);
    // res.status(200).send("OK");

    const id=new mongoose.Types.ObjectId();
    const studentToPersist=Object.assign({
        _id: id
    }, req.body); 
    const student=new StudentModel(studentToPersist);
    student.save().then((err,student)=>{
        if(err) res.status(500).send(err);
        res.json(student);
    console.log(JSON.stringify(studentToPersist));
    });
 });   
router.put('/:id',(req,res)=>{
    // console.log("put request") 
    // res.end();
    StudentModel.findById(req.params.id,(err,student)=>{
        if(err) res.status(500).send(err);
        if(student){
            student.name=req.body.name;
            student.course=req.body.course;
            student.save().then((err,student)=>{
                if(err) res.status(500).send(err);
                res.json(student)
            });
        }
            else {
                res.status(404).send(`user with id ${req.params.id} not found`);
            }
        });
    });
router.delete('/:id',(req,res)=>{
    // console.log("Delete request")
    // res.end();
    StudentModel.findByIdAndRemove(req.params.id,(err,student)=>{
        if(err)res.status(500).send(err);
        res.status(200).send(`user with id ${req.params.id} have been deleted `);
    });
    });

// router.param('id',(req,res,next,id)=>{
//         if(isNaN(id)){
//             next(`${id} Not a number`);
//         }
//         next();
//     });    

 module.exports = router;   