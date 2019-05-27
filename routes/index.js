const express = require('express');
const app = express();
const port = 3000;

const connection = require('./config');

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

// GET - Récupération de l'ensemble des données de la table destinations //

app.get('/api/destinations', (req, res) => {
    connection.query('SELECT * FROM destination', (err, results) => {
        if (err) {
            res.status(500).send('An error occured whilst trying to obtain your destinations');
        } else {
            res.json(results);
        }
    });
});

// Start ==>  GET (light) - Récupération de quelques champs spécifiques 

// ID 
app.get('/api/destinations/id', (req, res) => {
    connection.query('SELECT id_destination FROM destination', (err, results) => {
        if (err) {
            res.status(500).send('An error occured whilst trying to obtain the id of your destinations');
        } else {
            res.json(results);
        }
    });
});

// Name
app.get('/api/destinations/name', (req, res) => {
    connection.query('SELECT name_destination FROM destination', (err, results) => {
        if (err) {
            res.status(500).send('An error occured whilst trying to obtain the names of your destinations');
        } else {
            res.json(results);
        }
    });
});

// Date
app.get('/api/destinations/date', (req, res) => {
    connection.query('SELECT DATE_FORMAT(date_of_visit,"%d %M %Y") FROM destination', (err, results) => {
        if (err) {
            res.status(500).send('An error occured whilst trying to obtain the dates of visit of your destinations');
        } else {
            res.json(results);
        }
    });
});
// End ==>  GET (light)

// Un filtre qui contient les lettres 'on' 

app.get('/api/destinations/filter/contains', (req, res) => {
    connection.query('SELECT name_destination FROM destination WHERE name_destination LIKE \'%on%\'', (err, results) => {
        if (err) {
            res.status(500).send('An error occured whilst trying to obtain the containing letters for your destinations');
        } else {
            res.json(results);
        }
    });
});
// Un filtre qui commence par 'P' 

app.get('/api/destinations/filter/starts', (req, res) => {
    connection.query('SELECT name_destination FROM destination WHERE name_destination LIKE \'p%\'', (err, results) => {
        if (err) {
            res.status(500).send('An error occured whilst trying to obtain the starting with for your destinations');
        } else {
            res.json(results);
        }
    });
});
// Un filtre date supérieure à 01/10/2018
app.get('/api/destinations/filter/date', (req, res) => {
    connection.query('SELECT name_destination, date_of_visit FROM destination WHERE date_of_visit >\'2018-10-01\'', (err, results) => {
        if (err) {
            res.status(500).send('An error occured whilst trying to obtain the dates for your destinations');
        } else {
            res.json(results);
        }
    });
});

// // Un filtre sur la date pour la récupération de données ordonnées (ascendant, descendant) nom
app.get('/api/destinations/name/:order', (req, res) => {
    const order = req.params.order;

    connection.query(`SELECT name_destination FROM destination ORDER BY name_destination ${order}`, (err, results) => {
        if (err) {
            res.status(500).send('An error occured whilst trying to obtain the dates filtered for your destinations');
        } else {
            res.json(results);
        }
    });
});

// Un filtre sur la date pour la récupération de données ordonnées (ascendant, descendant) date
app.get('/api/destinations/filter/date/:order', (req, res) => {
    let order = req.params.order;

    connection.query(`SELECT name_destination, DATE_FORMAT(date_of_visit,"%d %M %Y") FROM destination ORDER BY date_of_visit ${order}`, (err, results) => {
        if (err) {
            res.status(500).send('An error occured whilst trying to obtain the dates filtered for your destinations');
        } else {
            res.json(results);
        }
    });
});

//  Sauvegarde d'une nouvelle destination

app.post('/api/destinations/add', (req, res) => {

    // récupération des données envoyées
    const formData = req.body;

    // connexion à la base de données, et insertion d'une destination
    connection.query('INSERT INTO destination SET ?', formData, (err, results) => {

        if (err) {
            console.log(err);
            res.status(500).send("An error occured whilst saving your destination");
        } else {
            res.sendStatus(200);
        }
    });
});

// PUT - Modification d'une nouvelle destination

// l'ID est passé en tant que paramètre
app.put('/api/destinations/update/:id', (req, res) => {
    // récupération des données envoyées
    const idDestination = req.params.id;
    const formData = req.body;

    // connection à la base de données, et insertion d'une destination
    connection.query('UPDATE destination SET ? WHERE id_destination = ?', [formData, idDestination], err => {

        if (err) {
            console.log(err);
            res.status(500).send("An error occured whilst modifying your destination");
        } else {
            res.sendStatus(200);
        }
    });
});

// PUT - Toggle du booléen recommendation

app.put('/api/destinations/update/:id/status-change', (req, res) => {
    // récupération des données envoyées
    const idDestination = req.params.id;

    // connection à la base de données, et insertion d'une destination
    connection.query('UPDATE destination SET recommendation = !recommendation WHERE id_destination = ?', [idDestination], err => {

        if (err) {
            console.log(err);
            res.status(500).send("An error occured whilst modifying your destination");
        } else {
            res.status(200).send("Your recommandation status has been successfully changed");

        }
    });
});

// DELETE - Suppression d'une entité

// l'ID est passé en tant que paramètre
app.delete('/api/destinations/delete/:id', (req, res) => {

    // récupération des données envoyées
    const idDestination = req.params.id;

    // connexion à la base de données, et suppression d'une destination
    connection.query('DELETE FROM destination WHERE id_destination = ?', [idDestination], err => {

        if (err) {
            console.log(err);
            res.status(500).send("An error occured whilst trying to delete your destination");
        } else {
            res.sendStatus(200);
        }
    });
});

// DELETE - Suppression de toutes les entités dont le booléen est false

app.delete('/api/destinations/delete/recommendation/:status', (req, res) => {

    let status = req.params.status;


    // connexion à la base de données, et suppression d'une destination
    connection.query('DELETE FROM destination WHERE recommendation = ?', [status], err => {

        if (err) {
            console.log(err);
            res.status(500).send("An error occured whilst trying to delete all your selected status recommendation");
        } else {
            res.sendStatus(200);
        }
    });
});

app.listen(port, (err) => {
    if (err) {
        throw new Error('Something bad happened...');
    }

    console.log(`Server is listening on ${port}`);
});
