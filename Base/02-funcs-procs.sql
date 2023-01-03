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

CREATE FUNCTION diff_leader( 
	pScore ArenaMembers.score%TYPE,  
	pArena ArenaMembers.arena%TYPE
)
RETURNS ArenaMembers.score%TYPE
	LANGUAGE SQL
	IMMUTABLE
	RETURNS NULL ON NULL INPUT
	
	RETURN ABS(
		pScore - (
			SELECT MAX(score)
			FROM ArenaMembers
			WHERE arena = pArena
		)
	);
