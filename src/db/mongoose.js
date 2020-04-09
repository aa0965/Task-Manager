const mongoose = require('mongoose')
const validator = require('validator')

const url = 'mongodb://taskmanager:Pratapanshu*1@ds143608.mlab.com:43608/task-manager'
mongoose.connect(url, {useNewUrlParser: true ,useCreateIndex:true, useUnifiedTopology: true,useFindAndModify:false })
