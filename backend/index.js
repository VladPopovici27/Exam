import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Sequelize from 'sequelize';
import mysql from 'mysql2/promise';
import db from './dbConfig.js';
import { database_password, database_username } from './Consts.js';

let app = express();

app.use(bodyParser.json());
app.use(cors());

let conn;

mysql.createConnection({
    host:'localhost',
    port:3306,
    user: database_username,
    password:database_password
})
.then((connection) => {
    conn = connection
    return connection.query('CREATE DATABASE IF NOT EXISTS Movies');
})
.then(() => {
    return conn.end();
})
.catch((err) => {
    console.warn(err.stack);
})

const Movie = db.define("Movie", {
    MovieId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
    },

    MovieTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        min: 3
    },

    MovieType: {
        type: Sequelize.ENUM("Comedy","Horror","Action"),
        defaultValue:"Pending",
        allowNull: false
    },

    PublicationDate: {
        type: Sequelize.DATE,
        allowNull: false
    }
})


const CrewMember = db.define("CrewMember", {
    CrewMemberId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
    },

    CrewMemberName: {
        type: Sequelize.STRING,
        allowNull: false,
        min: 5
    },

    CrewMemberRole: {
        type: Sequelize.ENUM("Director","Writer","Actor","Extra"),
        allowNull: false
    }
})

Movie.hasMany(CrewMember);
CrewMember.belongsTo(Movie);



app.get('/create', async (req, res, next) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: 'created' })
    } catch (err) {
        next(err)
    }
})


app.get('/movie', async (req, res, next) => {
    const query = {
        where: {}
    }

    try {
        const movie = await Movie.findAll(query)
        res.status(200).json(movie)
    } catch (err) {
        next(err)
    }
})


app.post('/movie', async (req, res, next) => {
    const errors = [];

    const movie = {
        id: req.body.MovieId,
        title:req.body.MovieTitle,
        movietype: req.body.MovieType,
        publicationdate: req.body.PublicationDate,
    
    }

    const exists_name = await Movie.findOne({ where: { title: req.body.MovieTitle } });
    console.log(exists_title)
    if (exists_title) {
        errors.push("Movie title already in use!");
        await Movie.update(movie, { where: { id: exists_name.dataValues.MovieId } })
        res.status(202).json({ message: 'accepted' })
    }

    if (errors.length === 0) {
        try {
            await Movie.create(movie)
            res.status(201).json({ message: 'movie created' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Movie creation was not successfull failed (Server error)" })
        }
    } else {
        res.status(400).send({ errors })
    }
})



app.get('/movie/:crewmemberid', async (req, res, next) => {
    try {
        const movie = await Movie.findByPk(req.params.CrewMemberId)
        if (movie) {
            res.status(200).json(movie)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})
app.put('/movie/:CrewMemberId', async (req, res, next) => {
    try {
        const movie = await Movie.findByPk(req.params.CrewMemberId)
        console.log(movie)
        if (movie) {
            const errors = [];

            const newMovie = {
                id: req.body.MovieId,
				title:req.body.MovieTitle,
				movietype: req.body.MovieType,
				publicationdate: req.body.PublicationDate,
            }

            if (!req.body.MovieId) {
                newMovie.MovieId = movie.dataValues.MovieId
            }

            if (!req.body.MovieTitle) {
                newTile.MovieTitle = movie.dataValues.MovieTitle
            }

            if (!req.body.MovieType) {
                newType.MovieType = movie.dataValues.MovieType
            }

            if (!req.body.PublicationDate) {
                newPublicationDate.PublicationDate = movie.dataValues.PublicationDate
            }

           

            if (!/^[a-zA-Z0-9]+$/.test(newMovie.MovieTitle)) {
                errors.push("Invalid name!")
            }




            if (req.body.MovieTitle) {
                const exists_movie = await Movie.findOne({ where: { title: newMovie.MovieTitle } });
                if (exists_movie) {
                    errors.push("title already in use!");
                }
            }

            

            if (errors.length === 0) {
                await Movie.update(newMovie, { where: { id: req.params.CrewMemberId } })
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(400).send(errors)
            }

        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})


app.delete('/movie/:CrewMemberId', async (req, res, next) => {
    try {
        const movie = await Movie.findByPk(req.params.CrewMemberId)
        if (movie) {
            await movie.destroy()
            res.status(202).json({ message: 'deleted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.get('/movie/MovieTitle/:CrewMemberId', async (req, res, next) => {
    try {
        const movie = await Movie.findByPk(req.params.CrewMemberId)
        if (movie) {
            res.status(200).json(user.token)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})






app.get('/crewmember', async (req, res, next) => {
    const query = {
        where: {}
    }
    try {
        const crewmember = await CrewMember.findAll(query)
        res.status(200).json(crewmember)
    } catch (err) {
        next(err)
    }
})


app.post('/movie/crewmember/:CrewMemberId', async (req, res, next) => {
    const errors = [];

    const crewmember = {
        id: req.body.CrewMemberId,
        name: req.body.CrewMemberName,
        role: req.body.CrewMemberRole,
        
    }    

    if (errors.length === 0) {
        try {
            var CrewMemberId = await CrewMember.create(crewmember)

            const movieQuery = {
                where: {
                    name: req.params.CrewMemberId
                }
            }
            try {
                const movie = await Movie.findAll(movieQuery)
                var movieCrewmembers;
                if(movie[0].crewmember === null) {
                    movieCrewmembers = "" + crewmemberid.dataValues.CrewMemberId;
                } else {
                    movieCrewmembers = movie[0].crewmember + ',' + rewmemberid.dataValues.CrewMemberId;
                }       
                

                const newMovie = {                    
                    crewmember: movieCrewmembers                  
                }               
                await Movie.update(newMovie, { where: { id: movie[0].MovieId } })       
        
            } catch(e) {
                next(e)
            }

            res.status(201).json({ message: 'created' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "crewmember creation did not work (Server error)" })
        }
    } else {
        res.status(400).send({ errors })
    }
})

app.get('/crewmember/:CrewMemberId', async (req, res, next) => {
    try {
        const crewmember = await CrewMember.findByPk(req.params.CrewMemberId)
        if (crewmember) {
            res.status(200).json(crewmember)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.put('/crewmember/:CrewMemberId', async (req, res, next) => {
    const crewmember = await CrewMember.findByPk(req.params.CrewMemberId)
    if (crewmember) {
        let errors = []

        const newCrewmember = {
            id: req.body.CrewMemberId,
			name: req.body.CrewMemberName,
			role: req.body.CrewMemberRole,
        }

        if (!req.body.CrewMemberId) {
            newCrewmember.id = crewmember.dataValues.CrewMemberId
        }

        if (!req.body.CrewMemberName) {
            newCrewmember.name = crewmember.dataValues.CrewMemberName
        }

        if (!req.body.CrewMemberRole) {
            newNote.role = crewmember.dataValues.CrewMemberRole
        }



        if (errors.length === 0) {
            try {
                await CrewMember.update(newCrewmember, { where: { id: req.params.CrewMemberId } })
                res.status(202).json({ message: 'updated' })
            } catch (error) {
                console.log(error)
                res.status(500).send({ message: "CrewMember update has failed (Server error)" })
            }
        } else {
            res.status(400).send({ errors })
        }

    } else {
        res.status(404).send({ message: "CrewMember not found" })
    }
})

app.delete('/crewmember/:CrewMemberId', async (req, res, next) => {
    try {
        const crewmember = await CrewMember.findByPk(req.params.CrewMemberId)
        if (crewmember) {
            await crewmember.destroy()
            res.status(202).json({ message: 'deleted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})



//#endregion GROUPS

app.use((err, req, res, next) => {
    console.warn(err)
    res.status(500).json({ message: 'server error' })
})
//#endregion GROUPS




app.listen();