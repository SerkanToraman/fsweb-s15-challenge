/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('bilmeceler').truncate()
  await knex('bilmeceler').insert([
    {id: "123Dh34TyTn", bilmece: "Bir kamyonu kim tek eliyle durdurabilir?"
    },
    {
      id: "34EE0543eSk",
      bilmece: "Yürür iz etmez, hızlansa toz etmez"
    },
    {
      id: "Mlt54Tm598l",
      bilmece: "Dört ayağı olsa da adım atamaz"
    },
  ]);
};
