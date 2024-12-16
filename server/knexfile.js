module.exports = {
development: {
    client: 'mysql', 
    connection: {
    host: '127.0.0.1',       
    user: 'root', 
    password: '', 
    database: 'online_billing', 
    },
    migrations: {
        tableName: 'knex_migrations', 
    },
    seeds: {
    directory: './seeds', 
    },
},

production: {
    client: 'pg', 
    connection: {
    host: 'production_host',  
    user: 'production_user',  
    password: 'production_password', 
    database: 'production_database', 
    },
    migrations: {
        tableName: 'knex_migrations',
    },
    seeds: {
    directory: './seeds', 
    },
},
};
