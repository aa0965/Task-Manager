const express = require('express')
const Router = new express.Router()
const User = require('../models/User.js')
const auth = require('../middlewares/auth.js')
const multer = require('multer')
const { sendWelcomeEmail,sendByeEmail } = require('../emails/account.js')
// const sharp = require('sharp')
const upload = multer({

  limits: {
      fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('file must be a image'))
    }

    cb(undefined, true)

  }
})

Router.post('/Users',async (req,res)=>{
  const user = new User(req.body)

try{
  await user.save()
  sendWelcomeEmail(user.email,user.name)
  const token = await user.generateAuthToken()
  res.status(200).send(user);
}catch(e){
  res.status(400).send(e)
}

})

Router.get('/Users/me',auth,async (req,res)=>{
 res.status(200).send(req.user)

})

Router.get('/Users/:id',async (req,res)=>{
  try{
    const user =  await User.findById(req.params.id)
    if(!user){
      return res.status(400).send()
    }
    res.send(user)
  }catch(e){
    res.status(500).send(e)
  }

})

Router.patch('/Users/me',auth, async (req,res) => {
  const updates = Object.keys(req.body)
   const allowedUpdates = ['name','email','password','age']
  const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

  if(!isValidOperation){
    return res.status(400).send({error:'Invalid updates'})
  }

  try{
      const user = await User.findById(req.user._id)

      updates.forEach((update)=>user[update]=req.body[update])

    await user.save()

    // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})


    res.status(200).send(user)
  }catch(e){
    res.status(400)
  }
})


Router.delete('/Users/me', auth,async (req,res)=>{
  try{
     await req.user.remove()
     sendByeEmail(req.user.email,req.user.name)
     res.status(200).send(req.user)
  }catch(e){
    res.status(500).send(e)
  }
})

Router.post('/Users/login',async (req,res)=>{
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({user,token})
  }catch(e){
     res.status(400).send(e)
  }
})

Router.post('/Users/logout',auth,async(req,res,next) => {
  try{
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  }catch(e){
    res.status(500).send()
  }
})

Router.post('/Users/logoutAll',auth,async(req,res,next) => {
  try{
    req.user.tokens = []
    await req.user.save()
    res.send()
  }catch(e){
    res.status(500).send()
  }
})

Router.post('/Users/me/avatar', auth ,upload.single('avatar'),async (req,res) => {
  // const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()

  req.user.avatar = req.file.buffer
  await req.user.save()
  res.send()
},(error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

Router.delete('/Users/me/avatar', auth ,upload.single('avatar'),async (req,res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
},(error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

Router.get('/Users/:id/avatar' ,async (req,res) => {
  try{
    const user = await User.findById(req.params.id)

    if(!user || !user.avatar){
      throw new Error()
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)

  }catch(e){
    res.status(400).send()
  }
})

module.exports = Router
