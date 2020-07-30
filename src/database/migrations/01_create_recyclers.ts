import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('recyclers', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('document').notNullable();
    table.string('password').notNullable();
    table.decimal('latitude').notNullable();
    table.decimal('longitude').notNullable();
    table.boolean('enterprise').defaultTo(false);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('recyclers');
}
