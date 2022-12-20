/* TODO
 * find out if it would be more reasonable to use integer ids instead of varchars as primary keys
 * add triggers e.g. for counting score or adding default values
 * add script for inserting sample data into the database
 */

CREATE TABLE Users(
    login VARCHAR(32) NOT NULL PRIMARY KEY,
    password VARCHAR(64) NOT NULL, -- sha256sum
    username VARCHAR(32) NOT NULL UNIQUE,
    is_professor BOOLEAN NOT NULL
);

CREATE TABLE Types(
    name VARCHAR(32) NOT NULL PRIMARY KEY
);

CREATE TABLE Regions(
    name VARCHAR(32) NOT NULL PRIMARY KEY,
    type VARCHAR(32) NOT NULL REFERENCES Types(name),
    arena VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE Arenas(
    name VARCHAR(32) NOT NULL PRIMARY KEY,
    region VARCHAR(32) NOT NULL UNIQUE REFERENCES Regions(name),
    leader BIGINT UNIQUE
);

CREATE TABLE ArenaMembers(
    id BIGSERIAL PRIMARY KEY,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    usr VARCHAR(32) NOT NULL REFERENCES Users(login), -- FIXME: change to login
    score INTEGER NOT NULL DEFAULT 0,
    arena VARCHAR(32) NOT NULL REFERENCES Arenas(name),
    UNIQUE(usr, arena)
);

ALTER TABLE Arenas ADD CONSTRAINT leaderfk FOREIGN KEY(leader) REFERENCES ArenaMembers(id);
ALTER TABLE Regions ADD CONSTRAINT arenafk FOREIGN KEY(arena) REFERENCES Arenas(name);

CREATE TABLE Pokeballs(
    name VARCHAR(32) NOT NULL PRIMARY KEY
);

CREATE TABLE Pokedex(
    number SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL UNIQUE,
    min_level SMALLINT NOT NULL DEFAULT 1 CHECK (min_level >= 0 AND min_level <= 100),

    primary_type VARCHAR(32) NOT NULL REFERENCES Types(name),
    secondary_type VARCHAR(32) REFERENCES Types(name),
    region VARCHAR(32) NOT NULL REFERENCES Regions(name)
);

CREATE TABLE Pokemons(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL, -- TODO: Add a default value of a pokemon name in pokedex
    level SMALLINT NOT NULL, -- TODO: Add a default value of the min level for that pokemon in pokedex
    sex BOOLEAN NOT NULL, -- 0 for male, 1 for female

    pokedex_num INTEGER NOT NULL REFERENCES Pokedex(number),
    pokeball VARCHAR(32) NOT NULL REFERENCES Pokeballs(name)
);

CREATE TABLE Duels(
    id BIGSERIAL PRIMARY KEY,
    duel_date DATE NOT NULL DEFAULT CURRENT_DATE,
    winner BOOLEAN NOT NULL,
    user1 BIGINT NOT NULL REFERENCES ArenaMembers(id), -- TODO: check if ArenaMembers are in the right arena
    user2 BIGINT NOT NULL REFERENCES ArenaMembers(id),
    pokemon1 BIGINT NOT NULL REFERENCES Pokemons(id),
    pokemon2 BIGINT NOT NULL REFERENCES Pokemons(id),
    arena VARCHAR(32) NOT NULL REFERENCES Arenas(name),
    UNIQUE(duel_date, user1, user2)
);
 
CREATE TABLE Counters(
    type1 VARCHAR(32) NOT NULL REFERENCES Types(name), -- maybe more verbose names, ie type & countered_type
    type2 VARCHAR(32) NOT NULL REFERENCES Types(name),
    PRIMARY KEY(type1, type2)
);

CREATE TABLE Attacks(
    name VARCHAR(32) NOT NULL PRIMARY KEY,
    power INTEGER NOT NULL, CHECK (power >= 0),
    hit_chance NUMERIC CHECK (hit_chance > 0 AND hit_chance <= 1),
    type VARCHAR(32) NOT NULL REFERENCES Types(name)
);

CREATE TABLE AttacksPokedex(
    attack VARCHAR(32) NOT NULL REFERENCES Attacks(name),
    pokedex_num INTEGER NOT NULL REFERENCES Pokedex(number),
    PRIMARY KEY(attack, pokedex_num)
);

CREATE TABLE AttacksPokemons(
    pokemon_id BIGINT NOT NULL REFERENCES Pokemons(id),
    attack VARCHAR(32) NOT NULL REFERENCES Attacks(name),
    PRIMARY KEY(attack, pokemon_id)
);
