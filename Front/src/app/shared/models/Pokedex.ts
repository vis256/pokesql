export interface Pokedex {
  number : number;
  name : string;
  min_level : number;
  region : string;
  pokeball? : string;
  primary_type : string;
  secondary_type? : string;
  Attacks? : string[];
}
