const express = require('express')
const authRoutes = require('./src/routes/authRoutes.js')
const app = express()

const mongoose = require('mongoose')


app.use(express.json())
app.use((req,res,next) =>{
    console.log(req.path,req.params)
    next()
})
app.use('/api/authRoutes',authRoutes)

mongoose.connect("mongodb+srv://root:R5O4lPtZsjhGczBC@collabcodeeditor.z5wf5.mongodb.net/")
.then(()=>{
    app.listen(4000, () =>{
        console.log("Listening on port 4000")
    })
})
.catch((error)=>{
    console.log(error)
})
