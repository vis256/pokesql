import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';

const constraint_map : any = {
  "users_pkey": "Użytkownik o takim loginie już istnieje",
  "users_username_key": "Użytkownik o takim imieniu już istnieje",
  "types_pkey" : "Typ o takiej nazwie już istnieje",
  "regions_pkey" : "Region o takiej nazwie już istnieje",
  "regions_arena_key" : "Istnieje arena o takim regionie",
  "regions_type_fkey" : "Istnieje region o takim typie",
  "arenas_pkey" : "Istnieje już arena o takiej nazwie",
  "arenas_region_key" : "Istnieje już arena o takim regionie",
  "arenas_leader_key" : "Ten użytkownik jest liderem areny",
  "arenas_region_fkey" : "Istnieje arena o takim regionie",
  "arenamembers_pkey" : "Istnieje już taki członek areny",
  "arenamembers_usr_arena_key" : "Taki użytkownik jest już członkiem tej areny",
  "arenamembers_usr_fkey" : "Taki użytkownik jest już członkiem tej areny",
  "arenamembers_arena_fkey" : "Taki użytkownik jest już członkiem tej areny",
  "leaderfk" : "Istnieje już taki lider",
  "arenafk" : "Istnieje już taka arena",
  "pokeballs_pkey" : "Istnieje już Pokeball o tej nazwie",
  "attackspokedex_attack_fkey" : "Ten gatunek ma już taki atak",
  "attackspokedex_pokedex_num_fkey" : "Ten gatunek ma już taki atak",
  "attackspokedex_pkey" : "Ten gatunek ma już taki atak",
  "pokedex_min_level_check" : "Aktualny poziom nie spełnia wymagań minimalnego poziomu",
  "pokedex_pkey" : "Gatunek o takim numerze już istnieje",
  "pokedex_name_key" : "Gatunek o takiej nazwie już istnieje",
  "pokedex_primary_type_fkey" : "Istnieje gatunek Pokemona o takim typie",
  "pokedex_secondary_type_fkey" : "Istnieje gatunek Pokemona o takim typie",
  "pokedex_region_fkey" : "Istnieje gatunek Pokemona wystepujacy w tym regionie",
  "pokemons_pkey" : "Istnieje już taki Pokemon",
  "pokemons_owner_fkey" : "Istnieje już taki Pokemon",
  "pokemons_pokedex_num_fkey" : "Istnieje Pokemon z takim numerem gatunku",
  "pokemons_pokeball_fkey" : "Istnieje Pokemon z takim Pokeballem",
  "duels_pkey" : "Istnieje już taki pojedynek",
  "duels_duel_date_user1_user2_key" : "Stoczyłeś już dziś walkę z tym przeciwnikiem",
  "duels_user1_fkey" : "Użytkownik ten brał udział w walce",
  "duels_user2_fkey" : "Użytkownik ten brał udział w walce",
  "duels_pokemon1_fkey" : "Ten Pokemon brał udział w walce",
  "duels_pokemon2_fkey" : "Ten Pokemon brał udział w walce",
  "duels_arena_fkey" : "Ta arena ma walki stoczone na niej",
  "counters_pkey" : "Ta kontra już istnieje",
  "counters_better_type_fkey" : "Istnieje kontra z tym typem",
  "counters_worse_type_fkey" : "Istnieje kontra z tym typem",
  "attacks_pkey": "Atak o takiej nazwie już istnieje",
  "attacks_hit_chance_check": "Szansa trafienia ataku musi być między 0 a 1",
  "attackspokemons_pokemon_id_fkey" : "Ten Pokemon zna już ten atak",
  "attackspokemons_attack_fkey" : "Pokemon zna ten atak",
  "pokeballspokedex_pkey" : "Ten gatunek może już być złapany w ten Pokeball",
  "pokeballspokedex_pokeball_fkey" : "Ten Pokeball był użyty do złapania Pokemona",
  "pokeballspokedex_pokedex_fkey" : "Ten gatunek był złapany",
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
    else msg = 'Nieznany błąd, sprawdź konsolę'
    notify(msg, "error", 2000);
  }
}
