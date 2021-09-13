const knex = require('../db/connection');

const list = () => {
    return knex('user')
    .select('*')
}

const findUser = (username, password) => {
    return knex('user')
    .where({username})
    .andWhere({password})
    .first()
}

const findUserByID = (user_id) => {
    return knex('user')
    .where({user_id})
    .first()
}

const create = (newUser) => {
    return knex('user')
    .insert(newUser, "*")
    .then((created) => created[0])
}

const update = async (updatedUser) => {
    const { user_id } = updatedUser;
    await knex('user')
    .where({user_id})
    .update(updatedUser, '*');
 
    return findUserByID(user_id);
 }

const destroy = user_id => {
    return knex('user')
    .where({ user_id })
    .del()
}

module.exports = {
    list,
    findUser,
    create,
    destroy,
    findUserByID,
    update
}