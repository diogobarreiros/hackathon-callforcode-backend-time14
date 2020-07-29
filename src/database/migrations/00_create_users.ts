import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.string('password').notNullable();
    table.string('image');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('users');
}
