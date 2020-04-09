const express = require('express');
require('./db/mongoose.js')

const app = express()

const port = process.env.PORT ;



app.use(express.json())
app.use(require('./routes/Users.js'))
app.use(require('./routes/Tasks.js'))




app.listen(port,()=>{
  console.log('listening on port' + port);
})
