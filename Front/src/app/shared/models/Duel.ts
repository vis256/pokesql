export interface Duel {
    id : number;
    duel_date : any;
    winner : boolean;

    user1 : number;
    pokemon1 : number

    user2 : number;
    pokemon2 : number;

    arena : string
}

export interface MyDuel {
    id : number;
    duel_date : any;

    won : boolean;

    opponent_id : number;
    opponent_pokemon_id : number;

    my_pokemon_id : number;

    arena : string;
}