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
        UPDATE Arenas SET leader = NEW.id WHERE name == NEW.name;
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER UpdateArenaLeader
AFTER INSERT ON Duels
FOR EACH ROW EXECUTE PROCEDURE updateArenaLeader();
