/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('users',tbl=>{
    tbl.integer('role_id')
        .unsigned()
        .notNullable()
        .references('role_id')
        .inTable('roles')
        .onUpdate('RESTRICT')
        .onDelete('RESTRICT')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
