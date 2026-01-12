import { useMemo, useState } from "react";
import { Card } from "../common/Card";
import { Table, type Column } from "../common/Table";
import { useRaceQuery } from "../api/useRaceQuery";


export const POINTS_PER_POSITION = [25, 22, 20, 18, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
export const POINTS_PER_QUALIF = [4, 3, 2, 1];

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
        if (race.drivers.length > 0 && typeof race.drivers[0] === 'object' && ('name' in race.drivers[0] || 'Name' in race.drivers[0])) {
          race.drivers.forEach((d: any) => {
            const name = d.name ?? d.Name;
            const team = d.team ?? d.Team ?? "";
            driverTeamMap.set(name, team);
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
      const pointsByRace: Record<string, number | string> = {};
      const pointsArray: { key: string, value: number, raceIdx: number }[] = [];
      races.forEach((race: any, raceIdx: number) => {
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
        const raceArr = Array.isArray(parsedResults.race) ? parsedResults.race : (Array.isArray(parsedResults.Race) ? parsedResults.Race : []);
        const qualifArr = Array.isArray(parsedResults.qualif) ? parsedResults.qualif : (Array.isArray(parsedResults.Qualif) ? parsedResults.Qualif : []);

        const posObj = raceArr.find((r: any) => (r.Name ?? r.name) === driver);
        let pts = 0;
        const pos = posObj?.Position ?? posObj?.position;
        if (posObj && typeof pos === "number") {
          const idx = pos - 1;
          pts = POINTS_PER_POSITION[idx] ?? 0;
        }

        const qualifObj = qualifArr.find((q: any) => (q.Name ?? q.name) === driver);
        const qualifPos = qualifObj?.Position ?? qualifObj?.position;
        let qualifPts = 0;
        if (qualifObj && typeof qualifPos === "number" && qualifPos >= 1 && qualifPos <= POINTS_PER_QUALIF.length) {
          qualifPts = POINTS_PER_QUALIF[qualifPos - 1] ?? 0;
        }

        let bestLapBonus = 0;
        let bestLapValue = null;
        if (raceArr.length > 0) {
          bestLapValue = raceArr.reduce((best: string|null, curr: any) => {
            if (!curr.bestLap) return best;
            if (!best) return curr.bestLap;
            const toMs = (t: string) => {
              const [min, sec] = t.split(":");
              const [s, ms] = sec.split(".");
              return parseInt(min) * 60000 + parseInt(s) * 1000 + parseInt(ms.padEnd(3, '0'));
            };
            return toMs(curr.bestLap) < toMs(best) ? curr.bestLap : best;
          }, null);
        }
        if (bestLapValue) {
          const bestLapDriver = raceArr.find((r: any) => r.bestLap === bestLapValue);
          if (bestLapDriver && (bestLapDriver.Name ?? bestLapDriver.name) === driver) {
            bestLapBonus = 1;
          }
        }

        const totalPoints = pts + qualifPts + bestLapBonus;
        pointsByRace[`race_${race.id}`] = totalPoints > 0 ? totalPoints : "-";
        pointsArray.push({ key: `race_${race.id}`, value: totalPoints, raceIdx });
      });
      const bestResults = pointsArray
        .filter((p) => typeof p.value === 'number' && p.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 4);
      const bestKeys = new Set(bestResults.map((p) => p.key));
      const total = bestResults.reduce((acc, p) => acc + p.value, 0);
      return {
        name: driver,
        team: driverTeamMap.get(driver) && driverTeamMap.get(driver)?.trim() !== "" ? driverTeamMap.get(driver) : "-",
        ...pointsByRace,
        total,
        _bestKeys: bestKeys,
      };
    });

    const teamRacePoints: Record<string, { team: string, key: string, value: number, raceIdx: number }[]> = {};
    races.forEach((race: any, raceIdx: number) => {
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
      const raceArr = Array.isArray(parsedResults.race) ? parsedResults.race : (Array.isArray(parsedResults.Race) ? parsedResults.Race : []);
      // Pour chaque équipe, on collecte les points des pilotes sur cette course
      const teamToPoints: Record<string, number[]> = {};
      raceArr.forEach((r: any) => {
        const name = r.Name ?? r.name;
        const team = driverTeamMap.get(name);
        if (team && team.trim() !== "") {
          // Points course
          let pts = 0;
          const pos = r.Position ?? r.position;
          if (typeof pos === "number") {
            const idx = pos - 1;
            pts = POINTS_PER_POSITION[idx] ?? 0;
          }
          // Points qualif
          let qualifPts = 0;
          const qualifArr = Array.isArray(parsedResults.qualif) ? parsedResults.qualif : (Array.isArray(parsedResults.Qualif) ? parsedResults.Qualif : []);
          const qualifObj = qualifArr.find((q: any) => (q.Name ?? q.name) === name);
          const qualifPos = qualifObj?.Position ?? qualifObj?.position;
          if (qualifObj && typeof qualifPos === "number" && qualifPos >= 1 && qualifPos <= POINTS_PER_QUALIF.length) {
            qualifPts = POINTS_PER_QUALIF[qualifPos - 1] ?? 0;
          }
          // Bonus best lap
          let bestLapBonus = 0;
          let bestLapValue = null;
          if (raceArr.length > 0) {
            bestLapValue = raceArr.reduce((best: string|null, curr: any) => {
              if (!curr.bestLap) return best;
              if (!best) return curr.bestLap;
              const toMs = (t: string) => {
                const [min, sec] = t.split(":");
                const [s, ms] = sec.split(".");
                return parseInt(min) * 60000 + parseInt(s) * 1000 + parseInt(ms.padEnd(3, '0'));
              };
              return toMs(curr.bestLap) < toMs(best) ? curr.bestLap : best;
            }, null);
          }
          if (bestLapValue) {
            const bestLapDriver = raceArr.find((r2: any) => r2.bestLap === bestLapValue);
            if (bestLapDriver && (bestLapDriver.Name ?? bestLapDriver.name) === name) {
              bestLapBonus = 1;
            }
          }
          const totalPoints = pts + qualifPts + bestLapBonus;
          if (!teamToPoints[team]) teamToPoints[team] = [];
          teamToPoints[team].push(totalPoints);
        }
      });
      // Pour chaque équipe, on calcule la moyenne sur cette course
      Object.entries(teamToPoints).forEach(([team, arr]) => {
        const avg = arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        if (!teamRacePoints[team]) teamRacePoints[team] = [];
        teamRacePoints[team].push({ team, key: `race_${race.id}`, value: avg, raceIdx });
      });
    });

    // Pour chaque équipe, on prend les 4 meilleures moyennes
    const teamRows = Object.entries(teamRacePoints).map(([team, arr]) => {
      const bestResults = arr
        .filter((p) => typeof p.value === 'number' && p.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 4);
      const bestKeys = new Set(bestResults.map((p) => p.key));
      const total = bestResults.reduce((acc, p) => acc + p.value, 0);
      // On construit l'objet pour le tableau
      const pointsByRace: Record<string, number | string> = {};
      arr.forEach((p) => {
        pointsByRace[p.key] = p.value > 0 ? Math.round(p.value * 100) / 100 : "-";
      });
      return {
        team,
        ...pointsByRace,
        total: Math.round(total * 100) / 100,
        _bestKeys: bestKeys,
      };
    });

    return { driverRows, raceColumns, teamRows };
  }, [races]);

  // Custom render pour mettre en bleu les courses qui comptent
  const driverColumns: Column<any>[] = [
    { key: "position", label: "#", align: "left" },
    { key: "name", label: "Driver", align: "left" },
    { key: "team", label: "Team", align: "center" },
    ...((standings.raceColumns || []).map((col) => ({
      ...col,
      render: (row: any) => {
        const value = row[col.key];
        if (row._bestKeys && row._bestKeys.has(col.key) && value !== "-") {
          return <span style={{ color: "#009FE3", fontWeight: 600 }}>{value}</span>;
        }
        return value;
      },
    }))),
    { key: "total", label: "Total", align: "center" },
  ];

  // Custom render pour mettre en bleu les courses qui comptent pour l'équipe
  const teamColumns: Column<any>[] = [
    { key: "position", label: "#", align: "left" },
    { key: "team", label: "Team", align: "left" },
    ...((standings.raceColumns || []).map((col) => ({
      ...col,
      render: (row: any) => {
        const value = row[col.key];
        if (row._bestKeys && row._bestKeys.has(col.key) && value !== "-") {
          return <span style={{ color: "#009FE3", fontWeight: 600 }}>{value}</span>;
        }
        return value;
      },
    }))),
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

