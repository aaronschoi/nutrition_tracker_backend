exports.up = function (knex) {
    return knex.schema.createTable('food_log', (table) => {
        table.increments("food_log_id").primary();
        table.string("food")
        table.string("fdcId")
        table.integer("user_id")
        table.string("portion")
        table.timestamps(true, true);
    })
}

exports.down = function (knex) {
    return knex.schema.dropTable('food_log')
}