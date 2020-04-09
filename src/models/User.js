
const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./Task.js')
const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    unique:true,
    trim:true,
    lowecase:true,
    validate(value){
      if(!validator.isEmail(value)){
         throw new Error('wrong email')
      }
    }
  },
  password:{
    type:String,
    required:true,
    trim:true,
    minlength:3,
    // validate(value){
    //   if(value.toLowerCase().includes('password')){
    //     throw new Error('password cannot contain "password"')
    //   }
    // }
  },
  age:{
    type:Number,
    default:0
  },

  avatar:{
    type:Buffer
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]
})

userSchema.virtual('tasks',{
  ref:'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id:user._id.toString() }, 'thisisnewshit')

 user.tokens = user.tokens.concat({token})
 await user.save()

  return token
}

userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({email})

  if(!user){
    throw new Error('unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch){
    throw new Error('unable to login')
  }
  return user
}

userSchema.pre('save',async function(next){
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8)
  }

  next()
})

userSchema.pre('remove',async function(next){
  const user = this

  await Task.deleteMany({owner:user._id})

  next()
})

const user = mongoose.model('User',userSchema)

// const me = new user({
//   name:'Anshu',
//   age: 22
// })
//
// me.save().then(()=>{
//   console.log(me)
// }).catch(()=>{
//   console.log(err)
// })

module.exports = user;
