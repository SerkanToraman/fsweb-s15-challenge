/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
  await knex('users').insert([
    {username: 'Mine', password: '$2a$08$aNVKuOI7N0TtufehumkeUeDLgaURnz0nWXtA8lWq.YtIJZPVnlhEm',role_id:1},
  ]);
};
