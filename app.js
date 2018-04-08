const express = require('express');
const path = require('path');
const app = express();
const expressValidator = require('express-validator');

const methodOverride = require('method-override')
const bodyParser = require('body-parser')


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to mongodb")
});


//Handles post requests
app.use(bodyParser.json());
//Handles put requests
app.use(methodOverride('X-HTTP-Method-Override'))

app.use(expressValidator());

app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
  })

app.use(express.static('public'));
app.use('/static',express.static(path.join(__dirname,'public')));


app.set('view engine', 'pug')


app.get('/',(req,res)=>{
    res.send("Hello world")
})

app.get('/test', (req,res,next)=> {
    console.log("test request received")    
    next();
})

const Todo = require('./models/todo')
app.get('/todos',(req,res)=>{
    Todo.find(function (err, todos) {
        if (err) return next(err);
        res.json(todos);
      });

   /* res.render('test',{
        title: "test asdasdsdasd"
    }) */
})

app.get('/todos/:id',(req,res,next)=>{
    Todo.findById(req.params.id, function (err, post) {
        if (err) return  next(err);
        res.json(post);
      });
})

app.delete('/todos/:id',(req,res,next)=>{
    Todo.findByIdAndRemove(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json({"message": "Iteam has been deleted!"});
      });
})



app.post('/todos',(req,res,next)=>{
    req.check('task','Task field is required').notEmpty().trim();

    let errors = req.validationErrors();
    if(errors){
        //console.log(errors)
        res.send({
            error: true,
            errors
        });
    }else{
        Todo.create(req.body, function (err, post) {
            if (err) return next(err);
            res.json(post);
          });
    }
    

   /* res.render('test',{
        title: "test asdasdsdasd"
    }) */
})


app.put('/todos/:id',(req,res,next)=>{
    req.check('task','Task field is required').notEmpty().trim();

    let errors = req.validationErrors();
    if(errors){
        //console.log(errors)
        res.send({
            error: true,
            errors
        });
    }else{


    //let todo = new Todo();
    const query = {_id: req.params.id}
    const update = {task: req.body.task, priority: req.body.priority}

    Todo.findOneAndUpdate(query, update, {}, (err,  todo) => {
      if(err){
        res.send(err);
      }
      res.json({'message': 'Updated Successfully!',todo});
    });
    
    }
    

   /* res.render('test',{
        title: "test asdasdsdasd"
    }) */
})

app.listen(3000,()=>{
    console.log("app started")
})