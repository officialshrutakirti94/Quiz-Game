const fs=require('fs')
const { json } = require('body-parser')
const express=require('express')
const bodyParser= require('body-parser')
var path=require('Path')
const {v4:uuidv4}=require('uuid')
const session = require('express-session')

const app=express()

const router=require('./router')
// middlewares
//Load static assets

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/assets',express.static(path.join(__dirname,'public/assets')))
app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}))
app.use("/route",router)

app.set('view engine','ejs')
app.get("/Quiz",(req,res)=>{
    fs.readFile("Quiz.json",'utf-8',(err,data)=>{
        if(!err)
        {
            data=JSON.parse(data)
            console.log(data.questions)
            res.render('quiz',{data:data.questions})
        }
    })
})
app.post("/submit",(req,res)=>{
    console.log(req.body)
    fs.readFile("Quiz.json",'utf-8',(err,data)=>{
        if(!err)
        {
            data=JSON.parse(data)
            var index=[]
            arr=data.questions
            console.log(data.questions)
            for(var i=0;i<arr.length;i++)
            {
                index.push(arr[i].correctIndex)
            }
            console.log(index)
            function compareArray(arr,index)
            {
                if(arr.length!=index.length)
                {
                    return false;
                }
                else{
                    for(var i=0;i<arr.length;i++)
                    {
                        if(arr[i]!=index[i])
                        {
                            return false;
                        }
                    }
                    return true;
                }
            }
            var res=compareArray(arr,index)
            if(res){
                console.log("Answer is true")
            }
            else{
                console.log("Answer is false")
            }
            //res.render('quiz',{data:data.questions.correctIndex})
        }
    })
})


// login page route
app.get('/',(req,res)=>{
    res.render('login')
})

app.listen(4500,()=>{
    console.log("Server is running")
})
