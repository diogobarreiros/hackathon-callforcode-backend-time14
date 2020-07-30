import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('recycler_types', (table) => {
    table.increments('id').primary();

    table.integer('recycler_id').notNullable().references('id').inTable('recyclers');
    table.integer('type_id').notNullable().references('id').inTable('types');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('recycler_types');
}
