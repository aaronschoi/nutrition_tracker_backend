const knex = require('../db/connection');

const create = (refreshToken) => {
    return knex('refresh_token')
    .insert(refreshToken, '*')
    .then(created => created[0]);
}

const read = (refresh_token) => {
    return knex('refresh_token')
    .where({refresh_token})
    .first()
}

const destroy = refresh_token_id => {
    return knex('refresh_token')
    .where({ refresh_token_id })
    .del()
}


module.exports = {
    create,
    read,
    destroy,
}