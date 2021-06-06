const express = require('express')
const app = express()
const mongoose = require('mongoose')
const FriendModel = require('./models/Friends')
const cors = require('cors')
const dotenv = require('dotenv')
require('dotenv').config()

dotenv.config({ path: './process.env' })

mongoose.connect(`mongodb+srv://${process.env.USR}:${process.env.PASS}@${process.env.DB_CLUSTER}.7fboi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const db = mongoose.connection

db.on('Error', console.error.bind(console, 'Connection Error'))
db.once('open', () => {
    console.log('Database Connection Open');
})

app.use(express.json())
app.use(cors())


app.get('/read', async (req, res) => {
    FriendModel.find({}, (err, result) => {
        if (err) {
            res.send(err)
        } else {
            res.send(result)
        }
    })
})

app.post('/insert', async (req, res) => {
    const name = req.body.name
    const age = req.body.age
    const newFriend = new FriendModel({ name: name, age: age })
    try {
        await newFriend.save()
        res.send('Inserted')
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

app.put('/update', async (req, res) => {
    const id = req.body.id
    const age = req.body.age
    await FriendModel.findById(id, (err, updated) => {
        updated.age = age
        updated.save()
    })
    res.send('Updated')
})

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    await FriendModel.findByIdAndRemove(id).exec()
    res.send('Deleted')
})

app.listen(process.env.PORT || 3001, () => {
    console.log(`http://localhost:3001`);
})