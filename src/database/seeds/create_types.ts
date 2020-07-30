import Knex from 'knex';

export async function seed(knex: Knex) {
  await knex('types').insert([
    { title: 'Lâmpadas' },
    { title: 'Pilhas e Baterias' },
    { title: 'Papéis e Papelão' },
    { title: 'Resíduos Eletrônicos' },
    { title: 'Residuos Orgânicos' },
    { title: 'Óleo de Cozinha' },
  ]);
}
