export interface Pokedex {
  ID : number;
  Name : string;
  MinimalLevel : number;
  Region : string;
  Pokeball : string;
  Types : [string, string | null];
  Attacks : string[];
}
