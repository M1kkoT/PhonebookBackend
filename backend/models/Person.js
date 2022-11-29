const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

mongoose.connect(`mongodb+srv://ollivarila:${process.env.PASSW}@crea-discord-bot-db.o8z510q.mongodb.net/personApp?retryWrites=true&w=majority`)
.then(() => console.log('connected to database'))
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})



const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)


module.exports = Person