import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('daily_diet', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.dateTime('date_hour').notNullable()
    table.boolean('on_diet').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.text('user_id')
    table.foreign('user_id').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('daily_diet')
}
