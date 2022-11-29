const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3001;
const Person = require('./models/Person') 
const cors = require('cors')

app.use(cors())

app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        
      return response.status(400).send({ error: 'väärä ID' })
    }
  
    next(error)
  }

  


app.get('/api/persons', async (req, res) => {
    const persons = await Person.find({})
    res.send(persons)  
})

app.get('/info', async (req, res) => {
    const persons = await Person.find({}) 
    const date = new Date(Date.now())
    const string = `<B>Phonebook has info for ${persons.length} people <br>${date.toString()}<B>`;
    res.send(string)
})

app.get('/api/persons/:id', async (req, res, next) => {
    const id = req.params.id;
    try{
        const person = await Person.findById(id)
        if (person) {
            res.send(person)
          } else {
            res.status(404).end()
          }
    }catch(error){
        next(error)
    }

    
        
})

app.delete('/api/persons/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const person = await Person.findByIdAndRemove(id)
        console.log(`poistettiin ${person}`);
        res.status(204).end()
    } catch (error) {
        next(error)
    }
    

    
})

app.put('/api/persons/:id', async (req, res, next) => {
    const id = req.params.id; 
    try {
        const person = await Person.findById(id)
        person.number = req.body.number
        const saved = await person.save()
        console.log(`muokattiin ${person}`);
        res.json(saved)
    } catch (error) {
        next(error)
    }
}) 


app.post('/api/persons', async (req, res) => {
    const body = req.body;

    const generateId = () => {
        return Math.floor(Math.random() * 1000000)
    }

    if (!body.name) {
        return res.status(400).json({ 
          error: 'name missing' 
        })
    }
    if (!body.number) {
        return res.status(400).json({ 
            error: 'number missing' 
        })
    }
    const persons = await Person.find({})
    if(persons.find(p => p.name === body.name)) {
        return res.status(400).json({ 
            error: 'name already in the list' 
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
    })

    const added = await person.save()

    if (added){
        res.status(204).json(added)
    }else {
        res.status(400).send({error: 'error'})
        console.log('error');
    }

    })




app.use(errorHandler)
    
app.listen(port, () => {console.log('listen')})