CREATE FUNCTION updateArenaLeader() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
DECLARE
    vWinner ArenaMembers.id%TYPE;
    vWinnerScore ArenaMembers.score%TYPE;

    vLeaderIdOld Arenas.leader%TYPE;
	vLeaderScoreOld ArenaMembers.score%TYPE;
BEGIN
    IF NEW.winner THEN
        vWinner = NEW.user1;
    ELSE
        vWinner = NEW.user2;
    END IF;

    SELECT score INTO vWinnerScore
    FROM ArenaMembers WHERE id = vWinner;
    
    SELECT leader INTO vLeaderIdOld
    FROM Arenas;

    SELECT score INTO vLeaderScoreOld
    FROM ArenaMembers WHERE id = vLeaderIdOld;

    IF vLeaderScoreOld IS NULL OR vLeaderScoreOld < vWinnerScore THEN
        UPDATE Arenas SET leader = vWinner WHERE name = NEW.arena;
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER UpdateArenaLeader
AFTER INSERT ON Duels
FOR EACH ROW EXECUTE PROCEDURE updateArenaLeader();

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
    WHERE arena = NEW.arena AND id = vWinner;

    vScore := vScore + 1;

    UPDATE ArenaMembers SET score = vScore WHERE id = vWinner;
    
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
        WHERE number = NEW.pokedex_num;

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
    WHERE number = NEW.pokedex_num;

    IF NEW.level IS NULL THEN
        NEW.level = vMinLevel;
    END IF;

    IF NEW.level < vMinLevel THEN
        RAISE EXCEPTION 'Błędny poziom pokemona';
    END IF;

    RETURN NEW;
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
    WHERE id = NEW.user1;

    IF vArenaMemberArena != NEW.arena THEN
        RAISE EXCEPTION 'Pierwszy użytkownik nie jest członkiem tej areny';
    END IF;

    SELECT arena
    INTO vArenaMemberArena
    FROM ArenaMembers
    WHERE id = NEW.user2;

    IF vArenaMemberArena != NEW.arena THEN
        RAISE EXCEPTION 'Drugi użytkownik nie jest członkiem tej areny';
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
    WHERE id = NEW.user1;

    IF vUserLogin1 != vUserLogin2 THEN
        RAISE EXCEPTION 'Pierwszy pokemon nie należy do pierwszego użytkownika';
    END IF;

    SELECT usr
    INTO vUserLogin1
    FROM ArenaMembers
    WHERE id = NEW.user2;
    
    IF vUserLogin1 = vUserLogin2 THEN
        RAISE EXCEPTION 'Trener nie może pojedynkować się z samym sobą';
    END IF;

    SELECT owner
    INTO vUserLogin2
    FROM Pokemons
    WHERE id = NEW.pokemon2;

    IF vUserLogin1 != vUserLogin2 THEN
        RAISE EXCEPTION 'Drugi pokemon nie należy do drugiego użytkownika';
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
    PERFORM *
    FROM PokeballsPokedex
    WHERE pokeball = NEW.pokeball AND pokedex = NEW.pokedex_num;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tego pokemona nie można złapać w tego pokeballa';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER VerifyPokeball
BEFORE INSERT ON Pokemons
FOR EACH ROW EXECUTE PROCEDURE verifyPokeball();

CREATE FUNCTION verifyPokemonAttacks() RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
DECLARE
    vPokedexNum Pokedex.number%TYPE;
BEGIN
    SELECT pokedex_num
    INTO vPokedexNum
    FROM Pokemons
    WHERE id = NEW.pokemon_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Ten pokemon nie może nauczyć się tego ataku';
    END IF;
    
    PERFORM *
    FROM AttacksPokedex
    WHERE attack = NEW.attack AND pokedex_num = vPokedexNum;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Ten pokemon nie może nauczyć się tego ataku';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER VerifyPokemonAttack
BEFORE INSERT ON AttacksPokemons
FOR EACH ROW EXECUTE PROCEDURE verifyPokemonAttacks();
