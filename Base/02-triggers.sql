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

    IF vLeaderScoreOld == NULL OR vLeaderScoreOld < NEW.score THEN
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

CREATE TRIGGER UpdateArenaScore
BEFORE INSERT ON Duels
FOR EACH ROW EXECUTE PROCEDURE updateArenaScore();

CREATE FUNCTION defaultPokemonName() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
DECLARE
    vPokedexName Pokedex.name%TYPE;
BEGIN
    IF NEW.name == NULL THEN
        SELECT name
        INTO vPokedexName
        FROM Pokedex
        WHERE number == NEW.pokedex_num;

        NEW.name = vPokedexName;
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER verifyPokemonLevel() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
DECLARE
    vMinLevel Pokedex.min_level%TYPE;
BEGIN
    SELECT min_level
    INTO vMinLevel
    FROM Pokedex
    WHERE number == NEW.pokedex_num;

    IF NEW.level == NULL THEN
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
