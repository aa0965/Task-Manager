
const validator = require('validator')
const mongoose = require('mongoose')

const taskSchema=new mongoose.Schema({
  description: {
    type:String,
    required:true,
    trim:true
  },
  completed:{
    type:Boolean,
    default:true,

  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  }

})

taskSchema.pre('save',async function(next){
  const task = this

  // if(task.isModified('password')){
  //   task.password = await bcrypt.hash(task.password,8)
  // }

  next()
})

const Task = mongoose.model('Task',taskSchema)

// const n_task = new Task({
//   description: 'enjoy the trip',
//   completed: true
// })
//
// n_task.save().then(()=>{
//   console.log(n_task)
// }).catch((err)=>{
//   console.log(err)
// })

module.exports = Task;
