const User = require('../models/user.js')
const jwt = require('jsonwebtoken')


const createToken = (_id) =>{
    return jwt.sign({_id},"adlerkhangfemorjaydencsc",{expiresIn: '3d'})
}
// POST Create a User
const createUser =  async (req, res) => {
    const {fname, lname, email, password} = req.body
    try{
        const user = await User.signup(fname,lname,email,password)
        const token = createToken(user._id)
        res.status(200)
        res.json({email,token})
    }
    catch(error){
        res.status(400).json({error : error.message})
    }
}

// POST Login a User
const loginUser = async (req, res) =>{
    const {email, password} = req.body
    try{
        const user = await User.login(email,password)
        const token = createToken(user._id)
        res.status(200)
        res.json({email,token})
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
}


module.exports = {
    createUser,
    loginUser
}

