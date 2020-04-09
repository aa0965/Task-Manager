const express = require('express')
const Router = new express.Router()

const Task = require('../models/Task.js')
const auth = require('../middlewares/auth.js')


Router.post('/Tasks', auth, async (req,res)=>{
  const task = new Task({...req.body,
    owner:req.user._id
  })


  try{
    await task.save()
    res.status(200).send(task);
  }catch(e){
    res.status(400).send(e)
  }


})



Router.get('/Tasks', auth,async (req,res)=>{

  try{
    const tasks = await Task.find({owner:req.user._id})
    res.send(tasks)
  }catch(e){
    res.status(500).send(e)
  }
})

Router.get('/Tasks/:id', auth,async (req,res)=>{
  const _id = req.params.id
  try{
    // const task =  await Task.findById(req.params.id)
    const task = await Task.findOne({ _id, owner: req.user._id})

    if(!task){
      return res.status(400).send()
    }
    res.send(task)
  }catch(e){
    res.status(500).send(e)
  }
})



Router.patch('/Tasks/:id', auth,async (req,res) => {
 const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description','completed']
  const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

  if(!isValidOperation){
    return res.status(400).send({error:'Invalid updates'})
  }

  try{
      const task = await Task.findOne({ _id, owner: req.user._id})

    updates.forEach((update)=>task[update]=req.body[update])

  await task.save()
    if(!task){
      return res.status(400).send()
    }
    res.status(200).send(task)
  }catch(e){
    res.status(400)
  }
})


Router.delete('/Tasks/:id', auth,async (req,res)=>{
  const _id = req.params.id
  try{
       const task = await Task.findOneAndDelete({ _id, owner: req.user._id})
       
     if(!task){
       return res.status(400).send()
     }
     res.status(200).send(task)
  }catch(e){
    res.status(500).send(e)
  }
})



module.exports=Router
