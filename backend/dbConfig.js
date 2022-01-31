import Sequelize from 'sequelize';
import { database_username, database_password } from './Consts.js';

const db = new Sequelize({
    dialect: 'mysql',
    database: 'Movies',
    host: 'localhost',
    port: 3306,
    username: database_username,
    password: database_password,
    logging: false,
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

export default db;