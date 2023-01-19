import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';

const constraint_map : any = {
  "users_pkey": "Użytkownik o takim loginie już istnieje",
  "users_username_key": "Użytkownik o takim imieniu już istnieje",
  "types_pkey" : "Typ o takiej nazwie już istnieje",
  "regions_pkey" : "TODO: Dodać komunikat",
  "regions_arena_key" : "TODO: Dodać komunikat",
  "regions_type_fkey" : "TODO: Dodać komunikat",
  "arenas_pkey" : "TODO: Dodać komunikat",
  "arenas_region_key" : "TODO: Dodać komunikat",
  "arenas_leader_key" : "TODO: Dodać komunikat",
  "arenas_region_fkey" : "TODO: Dodać komunikat",
  "arenamembers_pkey" : "TODO: Dodać komunikat",
  "arenamembers_usr_arena_key" : "TODO: Dodać komunikat",
  "arenamembers_usr_fkey" : "TODO: Dodać komunikat",
  "arenamembers_arena_fkey" : "TODO: Dodać komunikat",
  "leaderfk" : "TODO: Dodać komunikat",
  "arenafk" : "TODO: Dodać komunikat",
  "pokeballs_pkey" : "TODO: Dodać komunikat",
  "attackspokedex_attack_fkey" : "TODO: Dodać komunikat",
  "attackspokedex_pokedex_num_fkey" : "TODO: Dodać komunikat",
  "attackspokedex_pkey" : "TODO: Dodać komunikat",
  "pokedex_min_level_check" : "TODO: Dodać komunikat",
  "pokedex_pkey" : "Gatunek o takim numerze już istnieje",
  "pokedex_name_key" : "Gatunek o takiej nazwie już istnieje",
  "pokedex_primary_type_fkey" : "TODO: Dodać komunikat",
  "pokedex_secondary_type_fkey" : "TODO: Dodać komunikat",
  "pokedex_region_fkey" : "TODO: Dodać komunikat",
  "pokemons_pkey" : "TODO: Dodać komunikat",
  "pokemons_owner_fkey" : "TODO: Dodać komunikat",
  "pokemons_pokedex_num_fkey" : "TODO: Dodać komunikat",
  "pokemons_pokeball_fkey" : "TODO: Dodać komunikat",
  "duels_pkey" : "TODO: Dodać komunikat",
  "duels_duel_date_user1_user2_key" : "TODO: Dodać komunikat",
  "duels_user1_fkey" : "TODO: Dodać komunikat",
  "duels_user2_fkey" : "TODO: Dodać komunikat",
  "duels_pokemon1_fkey" : "TODO: Dodać komunikat",
  "duels_pokemon2_fkey" : "TODO: Dodać komunikat",
  "duels_arena_fkey" : "TODO: Dodać komunikat",
  "counters_pkey" : "TODO: Dodać komunikat",
  "counters_better_type_fkey" : "TODO: Dodać komunikat",
  "counters_worse_type_fkey" : "TODO: Dodać komunikat",
  "attacks_pkey": "Atak o takiej nazwie już istnieje",
  "attacks_hit_chance_check": "Szansa trafienia ataku musi być między 0 a 1",
  "attackspokemons_pokemon_id_fkey" : "TODO: Dodać komunikat",
  "attackspokemons_attack_fkey" : "TODO: Dodać komunikat",
  "pokeballspokedex_pkey" : "TODO: Dodać komunikat",
  "pokeballspokedex_pokeball_fkey" : "TODO: Dodać komunikat",
  "pokeballspokedex_pokedex_fkey" : "TODO: Dodać komunikat",
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor() { }

  displayError(err : {
    column? : string | null,
    constraint? : string | null,
    message? : string | null
  }) {
    let msg = '';

    if (err.constraint) {
      msg = constraint_map[err.constraint]
      console.log("contraint pulled: ", err.constraint, " -> ", msg);
      
    }
     else if (err.message) msg = err.message;
    else msg = 'Unknown error'
    notify(msg, "error", 2000);
  }
}
