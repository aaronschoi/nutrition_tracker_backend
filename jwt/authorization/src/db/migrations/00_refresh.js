exports.up = function (knex) {
    return knex.schema.createTable('refresh_token', (table) => {
        table.increments('refresh_token_id').primary();
        table.string('refresh_token').notNullable();
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable('refresh_token')
}