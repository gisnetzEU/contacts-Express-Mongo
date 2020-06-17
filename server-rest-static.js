    const {MongoClient, ObjectID,  ObjectId} = require('mongodb');
    const express = require('express');

    const app = express();
    app.use(express.static('public'));

    const port = process.env.port || 3000;
    app.listen(port, () => console.log(`listen on port ${port}`));

    new MongoClient('mongodb://localhost:27017').connect((error, client) => {
        if (error) {
            console.error(`Pas de connexion à la DB\n${error}`);
            return error;
        }
        console.log('connexion à mongodb OK');
        const userCollection = client.db('dbusers').collection('users');

        //facilité la traduction de HTTP => javascript
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json())

        //HTTP GET localhost:3000/users
        app.get('/users', (req, res) => {
            console.log('GET /users');            
            userCollection.find().toArray((error, users) => {
                if (error) sendError(error, 'Le chargement des users a échoué');
                else {
                    res.status(200);
                    res.json(users);
                }
            });
        });

        app.get('/users/:id', (req, res) => {
            const id = req.params.id;
            userCollection.findOne({_id: ObjectId(id)}, (error, user) => {
                if (error) sendError(error, `Le chargement du document ${id} a échoué`);
                else {
                    res.status(200);
                    res.json(user);
                }
            });
        })

        app.post('/users', (req, res) => {
            console.log('POST /users/ -' + JSON.stringify(req.body));
            const user = getUserFromBody(req.body);
            userCollection.insertOne(user, (error, result) => {
                if (error) sendError('L\'insertion a échoué', error);
                else {
                    res.status(201);
                    res.json(user);
                }
            });
        });

        app.put('/users/:id', (req, res) => {
            console.log('PUT /users/ -' + req.params.id + ' - ' + JSON.stringify(req.body));
            userCollection.updateOne({_id: ObjectId(req.params.id)}, {$set: req.body}, (error, result) => {
                if (error) sendError('L\'update a échoué', error);
                else {
                    res.status(200);
                    res.json(req.body);
                }
            });
        });

        app.delete('/users/:id', (req, res) => {
            console.log('DELETE /users/ ' + req.params.id );
            userCollection.deleteOne({_id: ObjectId(req.params.id)}, (error, result) => {
                if (error) sendError('La suppression a échouée', error);
                else {
                    res.status(200);
                    res.json({id: req.params.id});
                }
            })
        })

        /**
        * Enregistre une erreur et retourne le code 500 au client
        * @param {any} error : l'erreur, typiquement provenant de l'API
        * @param {*} msg : le message de l'application
        */
        function sendError(error, msg) {
            console.log(`${msg}\n${error}`);
            res.status(500);
            res.send();
        }

        /**
        * retourne un utilisateur à partir du body
        * @param {*} body est le body de la requête HTTP
        * @returns un utilisateur
        * @description
        *  cette méthode sert surtout a géré le ObjectID de mongodb
        */
        function getUserFromBody(body) {
            if (body.id) {
                body._id = body.id;
                delete body.id;
            } else {
                body._id = new ObjectID();
            }
            return body;
        }
    });
