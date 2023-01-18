export interface Duel {
    id : number;
    duel_date : Date;
    winner : boolean;

    user1 : number;
    pokemon1 : number

    user2 : number;
    pokemon2 : number;

    arena : string
}
