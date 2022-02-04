const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//PORT declaration
const PORT = process.env.PORT || 4001;

//middleware usage 
app.use(cors());
app.use(express.json()); //allows us to access the req.body

//ROUTES 

//Params
app.param('id', async (req, res, next, id) =>{
    try{
        const dbQuery = await pool.query(`SELECT * FROM todo WHERE todo_id = ${id}`);
        if(dbQuery.rows.length === 1){
            req.id = id;
            next();
        }else{
            res.status(404).json({ message: "The todo with the requested id does not exist" });
        }
    }catch(err){
        console.error(err.message);
    }
});

//get all todos
app.get('/todos', async (req, res) =>{
    try{
        const allTodos = await pool.query(`SELECT * FROM todo`);
        res.send(allTodos.rows);
    }catch(err){
        console.error(err.message);
    }
});

//get a single todo
app.get('/todos/:id', async (req, res) =>{
    try{
        const singleTodo = await pool.query(`SELECT * FROM todo WHERE todo_id = ${req.id}`);
        res.send(singleTodo.rows[0]);
    }catch(err){
        console.error(err.message);
    }
});

//create a todo
app.post('/todos', async (req, res) =>{
    try{
        const { description } = req.body;
        const newTodo = await pool.query(`INSERT INTO todo (description) VALUES ('${description}') RETURNING *`);
        res.status(201).send(newTodo.rows[0]);
    }catch(err){
        console.error(err.message);
    }
});

//update a todo
app.put('/todos/:id', async (req, res) =>{
    try {
        const { description } = req.body;
        await pool.query(`UPDATE todo SET description = '${description}' WHERE todo_id = ${req.id}`);
        res.status(205).json({ message: "Update Successfull" });
    }catch (err) {
        console.error(err.message);
    }   
});

// delete a todo 
app.delete('/todos/:id', async (req, res) =>{
    try {
        await pool.query(`DELETE FROM todo WHERE todo_id = ${req.id}`);
        res.json({ message: "Successfully Deleted" });
    } catch (err) {
        console.error(err.message);
    }
});


app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));