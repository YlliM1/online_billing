/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('offers', function(table) {
        table.increments('id').primary();
        table.string('project').notNullable();
        table.string('client').notNullable();
        table.string('email').notNullable();
        table.date('offer_date').notNullable(); 
        table.date('due_date').notNullable(); 
        table.text('client_address').notNullable(); 
        // Add your new fields here
        table.text('items').notNullable(); // For storing items (as text or JSON)
        table.integer('quantity').notNullable(); // Quantity of items
        table.decimal('price', 10, 2).notNullable(); 
        table.string('status').defaultTo('Approved').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('offers');
};
