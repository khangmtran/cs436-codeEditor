const User = require('../models/user.js')

// POST create a user
const createUser =  async (req, res) => {
    const {fname, lname, email, password} = req.body
    try{
        const user = await User.signup(fname,lname,email,password)
        res.status(200)
        res.json({email,user})
    }
    catch(error){
        res.status(400).json({error : error.message})
    }
}
const loginUser = async (req, res) =>{
    res.json({msg: "login user"})
}
// login user

module.exports = {
    createUser,
    loginUser
}

