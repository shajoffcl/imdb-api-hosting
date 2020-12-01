
const express=require('express');
const Joi=require('joi');

const app=express();

app.use(express.json());

const port=process.env.PORT || 3000;

const movies=[
    {
        id:1,
        name:"3 Idiots",
        plot:"College friendship"
    },
    {
        id:2,
        name:"The Dark Knight",
        plot:"Joker Revenge."
    },
    {
        id:3,
        name:"Lagan",
        plot:"Villagers vs Gora"
    }
]

app.get('/api/v1/movies', (req, res)=>{
    if(!movies){
        res.status(404).send("Movies not found!");
        return;
    }
    res.send(movies);
});

app.get('/api/v1/movies/:id', (req, res)=>{
    const id=req.params.id;
    const movie=movies.find((movie)=>(movie.id===parseInt(id)));
    if(!movie){
        res.status(404).send("No such match found!");
        return;
    }
    res.send(movie);
});


app.post('/api/v1/movie', (req, res)=>{
    
    const schema=Joi.object({
        name:Joi.string().min(1).required(),
        plot:Joi.string().min(5).required()
    });

    const validationObject=schema.validate(req.body);
    if (validationObject.error) {
        res.status(400).send(validationObject.error.details[0].message);
        return;
    }

    const movie={
        id:movies.length+1,
        name:req.body.name,
        plot:req.body.plot
    }
    movies.push(movie);
    res.send(movie);
});

app.put('/api/v1/movies/:id', (req, res)=>{
    const schema=Joi.object({
        name:Joi.string().min(1).required(),
        plot:Joi.string().min(5).required()
    });

    const validationObject=schema.validate(req.body);
    if (validationObject.error) {
        res.status(400).send(validationObject.error.details[0].message);
        return;
    };
    const id=req.params.id;
    const movieIndex=movies.findIndex((movie)=>(movie.id===parseInt(id)));

    if(movieIndex===-1){
        const movie={
            ...req.body, id:movies.length+1
        }
        movies.push(movie);
        res.send(movie);
        return;
    }

    movies.splice(movieIndex, 1 , {...req.body, id:id});
    res.send(movies[movieIndex]);
});

app.patch('/api/v1/movies/:id', (req, res) => {

    const id = req.params.id;
    //if id does not exist, return 404
    const movieIndex = movies.findIndex(movie => movie.id === parseInt(id));
    if (movieIndex === -1) {
        res.status(404).send("Movie not found");
        return;
    }
    
    //Validation
    if(!req.body.name) {
        res.status(400).send("Not a valid name!");
        return;
    }
    
    //Make the partial update
    movies[movieIndex].name = req.body.name;

    res.send(movies[movieIndex]);
});

app.delete('/api/v1/movies/:id', (req, res) => {
    const id = req.params.id;
    //if id does not exist, return 404
    const movieIndex = movies.findIndex(movie => movie.id === parseInt(id));
    if (movieIndex === -1) {
        res.status(404).send("Movie not found");
        return;
    }

    const movie = movies[movieIndex];
    movies.splice(movieIndex, 1);

    res.send(movie);
});

app.listen(port, ()=>{
    console.log("Server running");
});