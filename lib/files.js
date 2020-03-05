const fs = require('fs')
const newFolder = process.argv[2]
const files = {mkFolder: () =>{fs.mkdirSync(newFolder)
fs.mkdirSync(`${newFolder}/src`)
fs.mkdirSync(`${newFolder}/src/models`)
fs.writeFileSync(`${newFolder}/webpack.config.js`, `const path = require('path');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {server:'./src/index.js'},
  target: 'node',
  mode: 'production',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false,   // if you don't put this is, __dirname
    __filename: false,  // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  }
}`)
fs.writeFileSync(`${newFolder}/src/index.js`, `import app from './app'
app.listen(3000, ()=>{
    console.log('App running on port 3000')
})`)
fs.writeFileSync(`${newFolder}/package.json`, `{
    "name": "${newFolder.replace(' ', '-')}",
    "version": "1.0.0",
    "main": "index.js",
    "license": "MIT",
    "scripts": {
      "dev": "nodemon --exec sucrase-node ./src/index.js",
      "build": "webpack",
      "production": "node build/backend.js"
    },
    "devDependencies": {
      "nodemon": "^2.0.2",
      "sucrase": "^3.12.1",
      "webpack": "^4.42.0",
      "webpack-cli": "^3.3.11",
      "webpack-node-externals": "^1.7.2"
    },
    "dependencies": {
      "express": "^4.17.1",
      "mongoose": "^5.9.2"
    }
  }
  `)
  fs.writeFileSync(`${newFolder}/src/routes.js`, `import {Router} from 'express'
  const routes = Router()
  import User from './models/User'
  routes.get('/', (req, res) =>{
      User.find({}, (err, user)=>{
          res.send(user)
      })
  })
  routes.post('/add', (req, res)=>{
      let user = new User()
      user.name = req.body.name
      user.email = req.body.email
      user.password = req.body.pass
      user.save((err, doc)=>{
          if(err) res.json(err)
          else res.send(doc)
      })
  })
  routes.put('/:id', async(req, res)=>{
      const id = req.params.id
      console.log(id)
      const user = await User.findByIdAndUpdate(id, {
          name: req.body.name,
          email: req.body.email,
          password: req.body.pass
      })
      res.send({user})
  })
  routes.delete('/:id', async(req, res) =>{
      const id = req.params.id
      await User.findByIdAndDelete(id)
      res.send('User has been removed')
  })
  export default routes`)
  fs.writeFileSync(`${newFolder}/src/database.js`, `import mongoose from 'mongoose'
  const db = mongoose.connection
  
  const object = {
      connect: mongoose.connect('mongodb://localhost/books', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}),
      once: db.once('open', ()=>{
          console.log('Connected to MongoDB')
      }),
      error: db.on('error', (err)=>{
          console.log(err)
      })
  }
  export default object`)
fs.writeFileSync(`${newFolder}/src/models/User.js`, `import mongoose from 'mongoose'
const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})
export default mongoose.model('User', userSchema)`)
fs.writeFileSync(`${newFolder}/src/app.js`, `import express from 'express'
import data from './database'
import routes from './routes'
const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use('/user', routes)
app.get('/', (req, res)=>{
    res.redirect('/user')
})
data.connect
data.once
data.error

export default app`)
console.log(`Please navigate to ${newFolder} and install your dependencies running npm install or yarn`)}}
module.exports = files
