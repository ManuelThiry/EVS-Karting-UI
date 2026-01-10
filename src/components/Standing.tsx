import { useMemo, useState } from "react";
import { Card } from "../common/Card";
import { Table, type Column } from "../common/Table";
import { useRaceQuery } from "../api/useRaceQuery";

export const POINTS_PER_POSITION = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export const Standing = () => {
  const { data: races, loading, error } = useRaceQuery();
  const [view, setView] = useState<'driver' | 'team'>('driver');

  const standings = useMemo(() => {
    if (!Array.isArray(races)) {
      return { driverRows: [], raceColumns: [] };
    }

    const driverTeamMap = new Map<string, string>();
    races.forEach((race: any) => {
      if (Array.isArray(race.drivers)) {
        if (race.drivers.length > 0 && typeof race.drivers[0] === 'object' && 'name' in race.drivers[0]) {
          race.drivers.forEach((d: any) => {
            driverTeamMap.set(d.name, d.team ?? "");
          });
        } else {
          race.drivers.forEach((d: string) => {
            driverTeamMap.set(d, "");
          });
        }
      } else if (typeof race.drivers === "string") {
        race.drivers.split(",").map((d: string) => d.trim()).filter(Boolean).forEach((d: string) => {
          driverTeamMap.set(d, "");
        });
      }
    });
    const allDrivers = Array.from(driverTeamMap.keys());

    const raceColumns = races.map((race: any) => {
      let label = "TBD";
      if (race.track?.name && race.track.name.trim()) {
        label = race.track.name.substring(0, 3).toUpperCase();
      }
      return {
        key: `race_${race.id}`,
        label,
        align: "center" as const,
      };
    });

    const driverRows = allDrivers.map((driver) => {
      let total = 0;
      const pointsByRace: Record<string, number | string> = {};
      races.forEach((race: any) => {
        let parsedResults: any = {};
        if (race?.results) {
          if (typeof race.results === "string") {
            try {
              parsedResults = JSON.parse(race.results);
            } catch (e) {
              parsedResults = {};
            }
          } else {
            parsedResults = race.results;
          }
        }
        const raceArr = Array.isArray(parsedResults.Race) ? parsedResults.Race : [];
        const posObj = raceArr.find((r: any) => r.Name === driver);
        let pts: number | string = "-";
        if (posObj && typeof posObj.Position === "number") {
          const idx = posObj.Position - 1;
          pts = POINTS_PER_POSITION[idx] ?? 0;
          total += pts;
        }
        pointsByRace[`race_${race.id}`] = pts;
      });
      return {
        name: driver,
        team: driverTeamMap.get(driver) && driverTeamMap.get(driver)?.trim() !== "" ? driverTeamMap.get(driver) : "-",
        ...pointsByRace,
        total,
      };
    });

    const teamPointsMap = new Map<string, { total: number, pointsByRace: Record<string, number | string> }>();
    allDrivers.forEach((driver) => {
      const team = driverTeamMap.get(driver);
      if (team && team.trim() !== "") {
        let teamObj = teamPointsMap.get(team);
        if (!teamObj) {
          teamObj = { total: 0, pointsByRace: {} };
          teamPointsMap.set(team, teamObj);
        }
        races.forEach((race: any) => {
          let parsedResults: any = {};
          if (race?.results) {
            if (typeof race.results === "string") {
              try {
                parsedResults = JSON.parse(race.results);
              } catch (e) {
                parsedResults = {};
              }
            } else {
              parsedResults = race.results;
            }
          }
          const raceArr = Array.isArray(parsedResults.Race) ? parsedResults.Race : [];
          const posObj = raceArr.find((r: any) => r.Name === driver);
          let pts: number | string = 0;
          if (posObj && typeof posObj.Position === "number") {
            const idx = posObj.Position - 1;
            pts = POINTS_PER_POSITION[idx] ?? 0;
          }
          const key = `race_${race.id}`;
          const prev = typeof teamObj.pointsByRace[key] === 'number' ? teamObj.pointsByRace[key] : 0;
          teamObj.pointsByRace[key] = prev + (typeof pts === 'number' ? pts : 0);
        });
      }
    });
    for (const [_, obj] of teamPointsMap.entries()) {
      obj.total = Object.values(obj.pointsByRace)
        .filter((v): v is number => typeof v === 'number')
        .reduce((acc, v) => acc + v, 0);
    }
    const teamRows = Array.from(teamPointsMap.entries()).map(([team, obj]) => ({
      team,
      ...obj.pointsByRace,
      total: Number(obj.total),
    }));

    return { driverRows, raceColumns, teamRows };
  }, [races]);

  const driverColumns: Column<any>[] = [
    { key: "position", label: "#", align: "left" },
    { key: "name", label: "Driver", align: "left" },
    { key: "team", label: "Team", align: "center" },
    ...(standings.raceColumns || []),
    { key: "total", label: "Total", align: "center" },
  ];

  const teamColumns: Column<any>[] = [
    { key: "position", label: "#", align: "left" },
    { key: "team", label: "Team", align: "left" },
    ...(standings.raceColumns || []),
    { key: "total", label: "Total", align: "center" },
  ];

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message || error.toString()}</div>;
  if (!standings.driverRows?.length) return <div>No data found.</div>;

  const sortedDriverRows = [...standings.driverRows]
    .sort((a, b) => b.total - a.total)
    .map((row, idx) => ({
      position: idx + 1,
      name: row.name,
      team: row.team,
      ...Object.fromEntries(Object.entries(row).filter(([k]) => k !== "name" && k !== "team")),
    }));

  const sortedTeamRows = [...(standings.teamRows || [])]
    .sort((a, b) => b.total - a.total)
    .map((row, idx) => ({
      position: idx + 1,
      team: row.team,
      ...Object.fromEntries(Object.entries(row).filter(([k]) => k !== "team")),
    }));

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg transition font-semibold ${view === 'driver' ? 'bg-[#009FE3] text-white' : 'bg-[#0A0F1F]/70 text-gray-300 hover:bg-[#009FE3]/30'}`}
          onClick={() => setView('driver')}
        >
          Driver Standings
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition font-semibold ${view === 'team' ? 'bg-[#009FE3] text-white' : 'bg-[#0A0F1F]/70 text-gray-300 hover:bg-[#009FE3]/30'}`}
          onClick={() => setView('team')}
        >
          Team Standings
        </button>
      </div>
      {view === 'driver' && (
        <Card>
          <Card.Header title="Driver Standings" />
          <Card.Content>
            <Table columns={driverColumns} data={sortedDriverRows} />
          </Card.Content>
        </Card>
      )}
      {view === 'team' && (
        <Card>
          <Card.Header title="Team Standings" />
          <Card.Content>
            <Table columns={teamColumns} data={sortedTeamRows} />
          </Card.Content>
        </Card>
      )}
    </>
  );
};

