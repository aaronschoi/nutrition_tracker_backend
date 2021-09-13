const knex = require('../db/connection');

const create = (newFood) => {
    return knex('food_log')
    .insert(newFood, '*')
    .then(created => created[0]);
}

const read = (user_id) => {
    return knex('food_log')
    .where({user_id})
    .first()
}

const update = async (updatedLog) => {
    const { food_log_id } = updatedLog;
    await knex('food_log')
    .where({food_log_id})
    .update(updatedLog, '*');

    return read(food_log_id);
}

const destroy = food_log_id => {
    return knex('food_log')
    .where({food_log_id})
    .del()
}

module.exports = {
    create,
    read,
    update,
    destroy
}