exports.up = function (knex) {
    return knex.schema.createTable('user', (table) => {
        table.increments('user_id').primary();
        table.string('username').unique().notNullable();
        table.string('password').notNullable();
        table.string('first').notNullable();
        table.string('last').notNullable();
        table.date('dob').notNullable();
        table.string('sex').notNullable();
        table.string('usda').unique().notNullable();
        table.string('avatar').defaultTo('https://i.pravatar.cc/300');
        table.boolean('admin').defaultTo(false);
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable('user')
}