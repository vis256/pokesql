CREATE FUNCTION updateArenaLeader() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
DECLARE
    vLeaderScoreOld ArenaMembers.score%TYPE;
    vLeaderIdOld Arenas.leader%TYPE;
BEGIN
    SELECT id INTO vLeaderIdOld
    FROM Arenas WHERE name = NEW.name;

    SELECT score INTO vLeaderScoreOld
    FROM ArenaMembers WHERE id = vLeaderIdOld;

    IF vLeaderScoreOld IS NULL OR vLeaderScoreOld < NEW.score THEN
        UPDATE Arenas SET leader = NEW.id WHERE name == NEW.arena;
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER UpdateArenaLeader
AFTER INSERT ON Duels
FOR EACH ROW EXECUTE PROCEDURE updateArenaLeader();

CREATE PROCEDURE addRegionArena(
    pRegionName Regions.name%TYPE,
    pRegionType Regions.type%TYPE,
    pArenaName Arenas.name%TYPE
) LANGUAGE PLPGSQL AS $$
BEGIN
    ALTER TABLE Arenas DISABLE TRIGGER ALL;

    INSERT INTO Arenas (name, region)
    VALUES (pArenaName, pRegionName);

    ALTER TABLE Arenas ENABLE TRIGGER ALL;

    INSERT INTO Regions (name, type, arena)
    VALUES(pRegionName, pRegionType, pArenaName);
END
$$;

CREATE FUNCTION updateArenaScore() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
DECLARE
    vScore ArenaMembers.score%TYPE;
    vWinner ArenaMembers.id%TYPE;
BEGIN
    IF NEW.winner THEN
        vWinner = NEW.user1;
    ELSE
        vWinner = NEW.user2;
    END IF;

    SELECT score
    INTO vScore
    FROM ArenaMembers
    WHERE name == NEW.arena AND id == vWinner;

    vScore := vScore + 1;

    UPDATE ArenaMembers SET score = vScore WHERE name = vWinner;
    
    RETURN NEW;
END
$$;

CREATE TRIGGER c_UpdateArenaScore
BEFORE INSERT ON Duels
FOR EACH ROW EXECUTE PROCEDURE updateArenaScore();

CREATE FUNCTION defaultPokemonName() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
DECLARE
    vPokedexName Pokedex.name%TYPE;
BEGIN
    IF NEW.name IS NULL THEN
        SELECT name
        INTO vPokedexName
        FROM Pokedex
        WHERE number == NEW.pokedex_num;

        NEW.name = vPokedexName;
    END IF;

    RETURN NEW;
END
$$;

CREATE FUNCTION verifyPokemonLevel() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
DECLARE
    vMinLevel Pokedex.min_level%TYPE;
BEGIN
    SELECT min_level
    INTO vMinLevel
    FROM Pokedex
    WHERE number == NEW.pokedex_num;

    IF NEW.level IS NULL THEN
        NEW.level = vMinLevel;
    END IF;

    IF NEW.level < vMinLevel THEN
        RAISE EXCEPTION 'Invalid Pokemon level';
    END IF;
END
$$;

CREATE TRIGGER VerifyPokemonLevel
BEFORE INSERT ON Pokemons
FOR EACH ROW EXECUTE PROCEDURE verifyPokemonLevel();

CREATE TRIGGER DefaultPokemonName
BEFORE INSERT ON Pokemons
FOR EACH ROW EXECUTE PROCEDURE defaultPokemonName();

CREATE FUNCTION verifyDuelTrainers() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
DECLARE
    vArenaMemberArena Arenas.name%TYPE;
BEGIN
    SELECT arena
    INTO vArenaMemberArena
    FROM ArenaMembers
    WHERE id == NEW.user1;

    IF vArenaMemberArena != NEW.arena THEN
        RAISE EXCEPTION 'User1 in a member of a wrong arena';
    END IF;

    SELECT arena
    INTO vArenaMemberArena
    FROM ArenaMembers
    WHERE id == NEW.user2;

    IF vArenaMemberArena != NEW.arena THEN
        RAISE EXCEPTION 'User2 in a member of a wrong arena';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER a_VerifyDuelTrainers
BEFORE INSERT ON Duels
FOR EACH ROW EXECUTE PROCEDURE verifyDuelTrainers();

CREATE FUNCTION verifyDuelPokemons() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
DECLARE
    vUserLogin1 Users.login%TYPE;
    vUserLogin2 Users.login%TYPE;
BEGIN
    SELECT owner
    INTO vUserLogin1
    FROM Pokemons
    WHERE id = NEW.pokemon1;
    
    SELECT usr
    INTO vUserLogin2
    FROM ArenaMembers
    WHERE id == NEW.user1;

    IF vUserLogin1 != vUserLogin2 THEN
        RAISE EXCEPTION 'Pokemon1 does not belong to User1';
    END IF;

    SELECT usr
    INTO vUserLogin1
    FROM ArenaMembers
    WHERE id == NEW.user2;
    
    IF vUserLogin2 == vUserLogin2 THEN
        RAISE EXCEPTION 'Trainer cannot duel himself';
    END IF;

    SELECT owner
    INTO vUserLogin2
    FROM Pokemons
    WHERE id = NEW.pokemon2;

    IF vUserLogin1 != vUserLogin2 THEN
        RAISE EXCEPTION 'Pokemon2 does not belong to User2';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER b_VerifyDuelPokemons
BEFORE INSERT ON Duels
FOR EACH ROW EXECUTE PROCEDURE verifyDuelPokemons();

CREATE FUNCTION verifyPokeball() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
BEGIN
    SELECT *
    FROM PokeballsPokedex
    WHERE pokeball == NEW.pokeball AND pokedex == NEW.pokedex_num;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'This pokemon cannot be caught in this pokeball';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER VerifyPokeball
BEFORE INSERT ON Pokemons
FOR EACH ROW EXECUTE PROCEDURE verifyPokeball();
