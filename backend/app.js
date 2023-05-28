const express = require("express");
const app = express();
const mongoose = require("mongoose");
const product = require("./models/product")

//lES MIDDLEWARES GENERAUX

//le format JSON
app.use(express.json());

//la gestion des CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//connecter à ta base de données Mongoose
mongoose.connect("mongodb+srv://benjamin123:s4ZACtEy6ATu1Zec@cluster0.jsdslmq.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//CREATION DES MIDDLEWARE SPECIFIQUES 

// la route POST
app.post('/api/products', (req, res, next) => {
    const product = new product({
        ...req.body
    })
    product.save()
        .then(product => res.status(200).json({ product }))
        .catch(error => res.status(400).json({ error }))
});

//les routes GET

//renvoyer tous les produits sous la forme {products : Product[]}
app.get('/api/products', (req, res, next) => {
    product.find()
        .then(product => res.status(200).json(product))
        .catch(error => res.status(404).json({ error }))
});

// Retournera le produit avec le_id fourni sous la forme { product: Product }
app.get('/api/products/:id', (req, res, next) => {
    product.findOne({ _id: req.params.id })
        .then(product => res.status(201).json(product))
        .catch(error => res.status(404).json({ error }));
});

//la route PUT

//retournera le produit le _id fourni selon les données envoyées dans le corps de la requête. 
app.put('/api/stuff/:id', (req, res, next) => {
    product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Modified!" }))
        .catch(error => res.status(200).json({ error }))
});

//supprimera l'id 
app.delete('api/product/:id', (req, res, next) => {
    product.deleteOne({ id: req.params.id })
        .then(() => res.status(200).json({ message: "objet supprimé!" }))
        .catch(error => res.status(200).json({ error }))
});


module.exports = app;