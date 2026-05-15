import { useMemo, useState } from "react";
import { Card } from "../common/Card";
import { Table, type Column } from "../common/Table";
import { Tooltip } from "../common/Tooltip";
import { Races, Drivers } from "../api/Data";
import type { Driver } from "../api/Data";


export const POINTS_PER_POSITION = [25, 22, 20, 18, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
export const POINTS_PER_QUALIF = [4, 3, 2, 1];
export const RACE_COUNT =  5;

export const Standing = () => {
  const races = Races;
  const [view, setView] = useState<'driver' | 'team'>('driver');

  const standings = useMemo(() => {
    if (!Array.isArray(races)) {
      return { driverRows: [], raceColumns: [], teamRows: [] };
    }

    // Map driver ID to driver object
    const driverMap = new Map<string, Driver>();
    Drivers.forEach((d: Driver) => driverMap.set(d.id, d));

    // Get all driver IDs from all races
    const allDriverIds = Array.from(new Set(races.flatMap((r: typeof Races[number]) => r.drivers || [])));

    const raceColumns = races.map((race) => {
      let label = "TBD";
      if (race.name && race.name.trim()) {
        label = race.name.substring(0, 3).toUpperCase();
      }
      return {
        key: `race_${race.id}`,
        label,
        align: "center" as const,
        title: race.name || undefined,
      };
    });

    const driverRows = allDriverIds.map((driverId: string) => {
      const driver = driverMap.get(driverId);
      const driverName = driver?.name || driverId;
      const team = driver?.team?.join(" / ") || "-";
      const pointsByRace: Record<string, number | string> = {};
      const pointsArray: { key: string, value: number, raceIdx: number }[] = [];
      races.forEach((race: typeof Races[number], raceIdx: number) => {
        let pts = 0;
        let qualifPts = 0;
        let bestLapBonus = 0;
        // Find race result for this driver
        const raceResult = race.raceResults?.find((r: { driver: string }) => r.driver === driverName);
        const qualifResult = race.qualifResults?.find((q: { driver: string }) => q.driver === driverName);
        const pos = raceResult?.position;
        const qualifPos = qualifResult?.position;
        if (qualifResult && typeof qualifPos === "number" && qualifPos >= 1 && qualifPos <= POINTS_PER_QUALIF.length) {
          qualifPts = POINTS_PER_QUALIF[qualifPos - 1] ?? 0;
        }
        // Best lap bonus
        let bestLapValue = null;
        if (race.raceResults && race.raceResults.length > 0) {
          bestLapValue = race.raceResults.reduce((best: string|null, curr: { bestLap: string }) => {
            if (!curr.bestLap) return best;
            if (!best) return curr.bestLap;
            const toMs = (t: string | undefined): number => {
              if (!t) return Infinity;
              const parts = t.split(":");
              if (parts.length === 2) {
                const [min, sec] = parts;
                const [s, ms] = sec.split(".");
                return parseInt(min) * 60000 + parseInt(s) * 1000 + parseInt((ms || '0').padEnd(3, '0'));
              } else if (parts.length === 1) {
                const [s, ms] = t.split(".");
                return parseInt(s) * 1000 + parseInt((ms || '0').padEnd(3, '0'));
              }
              return Infinity;
            };
            return toMs(curr.bestLap) < toMs(best) ? curr.bestLap : best;
          }, null);
        }
        if (bestLapValue) {
          const bestLapDriver = race.raceResults?.find((r: { bestLap: string, driver: string }) => r.bestLap === bestLapValue);
          if (bestLapDriver && bestLapDriver.driver === driverName) {
            bestLapBonus = 1;
          }
        }
        if (raceResult && typeof pos === "number") {
          const idx = pos - 1;
          pts = POINTS_PER_POSITION[idx] ?? 0;
        }
        let displayValue = "-";
        if (raceResult) {
          if (typeof pos === "number") {
            if (pos >= 1 && pos <= POINTS_PER_POSITION.length) {
              displayValue = pts + qualifPts + bestLapBonus > 0 ? String(pts + qualifPts + bestLapBonus) : "-";
            } else if (pos > POINTS_PER_POSITION.length) {
              displayValue = "0";
            }
          } else {
            displayValue = "0";
          }
        } else {
          displayValue = "-";
        }
        const totalPoints = pts + qualifPts + bestLapBonus;
        pointsByRace[`race_${race.id}`] = displayValue;
        // Ajout pour la projection :
        // Si la course a été disputée (race.raceResults non vide) mais que le pilote n'a pas roulé, on compte 0 pour la projection
        if (race.raceResults && race.raceResults.length > 0) {
          if (raceResult) {
            pointsArray.push({ key: `race_${race.id}`, value: totalPoints, raceIdx });
          } else {
            // Course disputée mais pas de résultat pour ce pilote : 0 pour la projection
            pointsArray.push({ key: `race_${race.id}`, value: 0, raceIdx });
          }
        }
        // Si la course n'a pas été disputée (race.raceResults vide), on ne compte rien
      });
      const bestResults = pointsArray
        .filter((p) => typeof p.value === 'number' && p.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, RACE_COUNT);
      const bestKeys = new Set(bestResults.map((p) => p.key));
      const total = bestResults.reduce((acc, p) => acc + p.value, 0);

      // Projection : tant qu'on n'a pas 6 résultats, on affiche la somme des meilleurs (RACE_COUNT-1) résultats (on retire le plus mauvais)
      let projection: number | null = null;
      if (pointsArray.length > 1 && pointsArray.length <= RACE_COUNT) {
        const values = pointsArray.map((p) => p.value);
        projection = values.reduce((acc, v) => acc + v, 0) - Math.min(...values);
      }

      return {
        name: driverName,
        team,
        ...pointsByRace,
        total,
        projection,
        _bestKeys: bestKeys,
      };
    });

    const teamRacePoints: Record<string, { team: string, key: string, value: number, raceIdx: number }[]> = {};
    races.forEach((race: typeof Races[number], raceIdx: number) => {
      const teamToPoints: Record<string, number[]> = {};
      (race.raceResults || []).forEach((r: { driver: string; position: number; bestLap: string }) => {
        const driver = Drivers.find((d: Driver) => d.name === r.driver);
        if (!driver) return;
        const teams = (driver.team || []) as string[];
        let pts = 0;
        const pos = r.position;
        if (typeof pos === "number") {
          const idx = pos - 1;
          pts = POINTS_PER_POSITION[idx] ?? 0;
        }
        let qualifPts = 0;
        const qualifResult = (race.qualifResults || []).find((q: { driver: string; position: number }) => q.driver === r.driver);
        const qualifPos = qualifResult?.position;
        if (qualifResult && typeof qualifPos === "number" && qualifPos >= 1 && qualifPos <= POINTS_PER_QUALIF.length) {
          qualifPts = POINTS_PER_QUALIF[qualifPos - 1] ?? 0;
        }
        let bestLapBonus = 0;
        let bestLapValue = null;
        if (race.raceResults && race.raceResults.length > 0) {
          bestLapValue = race.raceResults.reduce((best: string|null, curr: { bestLap: string }) => {
            if (!curr.bestLap) return best;
            if (!best) return curr.bestLap;
            const toMs = (t: string | undefined): number => {
              if (!t) return Infinity;
              const parts = t.split(":");
              if (parts.length === 2) {
                const [min, sec] = parts;
                const [s, ms] = sec.split(".");
                return parseInt(min) * 60000 + parseInt(s) * 1000 + parseInt((ms || '0').padEnd(3, '0'));
              } else if (parts.length === 1) {
                const [s, ms] = t.split(".");
                return parseInt(s) * 1000 + parseInt((ms || '0').padEnd(3, '0'));
              }
              return Infinity;
            };
            return toMs(curr.bestLap) < toMs(best) ? curr.bestLap : best;
          }, null);
        }
        if (bestLapValue) {
          const bestLapDriver = race.raceResults?.find((r2: { bestLap: string; driver: string }) => r2.bestLap === bestLapValue);
          if (bestLapDriver && bestLapDriver.driver === r.driver) {
            bestLapBonus = 1;
          }
        }
        const totalPoints = pts + qualifPts + bestLapBonus;
        teams.forEach((singleTeam: string) => {
          if (!teamToPoints[singleTeam]) teamToPoints[singleTeam] = [];
          teamToPoints[singleTeam].push(totalPoints);
        });
      });
      Object.entries(teamToPoints).forEach(([team, arr]) => {
        const avg = arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
        if (!teamRacePoints[team]) teamRacePoints[team] = [];
        teamRacePoints[team].push({ team, key: `race_${race.id}`, value: avg, raceIdx });
      });
    });

    const teamRows = Object.entries(teamRacePoints).map(([team, arr]) => {
      // Pour chaque course disputée, si l'équipe n'a pas de résultat, on ajoute 0
      const allRaceKeys = (raceColumns || []).filter(rc => {
        const race = races.find(r => `race_${r.id}` === rc.key);
        return race && race.raceResults && race.raceResults.length > 0;
      }).map(rc => rc.key);

      // Map des résultats de l'équipe par course
      const arrByKey = Object.fromEntries(arr.map(p => [p.key, p]));
      const fullArr = allRaceKeys.map(key => arrByKey[key] ? arrByKey[key] : { key, value: 0 });

      const bestResults = fullArr
        .filter((p) => typeof p.value === 'number' && p.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, RACE_COUNT);
      const bestKeys = new Set(bestResults.map((p) => p.key));
      const total = bestResults.reduce((acc, p) => acc + p.value, 0);
      // Projection : somme des meilleurs (RACE_COUNT-1) résultats (on retire le plus mauvais)
      let projection: number | null = null;
      if (fullArr.length > 1 && fullArr.length <= RACE_COUNT) {
        const values = fullArr.map((p) => p.value);
        projection = values.reduce((acc, v) => acc + v, 0) - Math.min(...values);
      }
      const pointsByRace: Record<string, number | string> = {};
      // Initialiser toutes les colonnes à '-'
      (raceColumns || []).forEach(col => {
        pointsByRace[col.key] = "-";
      });
      fullArr.forEach((p) => {
        if (p.value === undefined || p.value === null) {
          pointsByRace[p.key] = "-";
        } else if (p.value >= 0) {
          pointsByRace[p.key] = p.value.toFixed(2);
        } else {
          pointsByRace[p.key] = "-";
        }
      });
      return {
        team,
        ...pointsByRace,
        total: total.toFixed(2),
        projection: projection !== null ? projection.toFixed(2) : null,
        _bestKeys: bestKeys,
      };
    });

    return { driverRows, raceColumns, teamRows };
  }, [races]);

  const driverColumns: Column<any>[] = [
    { key: "name", label: "Driver", align: "left", sortable: true },
    { key: "team", label: "Team", align: "center", sortable: true },
    ...((standings.raceColumns || []).map((col) => ({
      ...col,
      sortable: true,
      render: (row: any) => {
        const value = row[col.key];
        if (row._bestKeys && row._bestKeys.has(col.key) && value !== "-") {
          return <span style={{ color: "#009FE3", fontWeight: 600 }}>{value}</span>;
        }
        return value;
      },
    }))),
    // Colonne projection discrète juste avant le total
    {
      key: "projection",
      label: "Proj.",
      align: "center",
      title: "Projection if we drop the worst result",
      width: "5%",
      sortable: true,
      render: (row: any) =>
        typeof row.projection === 'number' ? (
          <span title="Projection si on retire le plus mauvais résultat" >{row.projection}</span>
        ) : null,
    },
    { key: "total", label: "Total", align: "center", sortable: true },
  ];

  const teamColumns: Column<any>[] = [
    { key: "team", label: "Team", align: "left", sortable: true },
    ...((standings.raceColumns || []).map((col) => ({
      ...col,
      sortable: true,
      render: (row: any) => {
        const value = row[col.key];
        if (row._bestKeys && row._bestKeys.has(col.key) && value !== "-") {
          return <span style={{ color: "#009FE3", fontWeight: 600 }}>{value}</span>;
        }
        return value;
      },
    }))),
    {
      key: "projection",
      label: "Proj.",
      align: "center",
      title: "Projection if we drop the worst result",
      width: "5%",
      sortable: true,
      render: (row: any) =>
        typeof row.projection === 'string' ? (
          <span title="Projection si on retire le plus mauvais résultat" >{row.projection}</span>
        ) : null,
    },
    { key: "total", label: "Total", align: "center", sortable: true },
  ];

  // No loading/error with static data
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
    .sort((a, b) => Number(b.total) - Number(a.total))
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
          <Card.Header 
            title={
              <span className="flex items-center gap-2">
                Driver Standings
                <Tooltip content={
                  <div>
                    <b className="text-[#009FE3]">Scoring rules</b><br />
                    <span>The total is the sum of each driver's <b>{RACE_COUNT} best performances</b> (race + qualifying + fastest lap).</span><br /><br />
                    <b className="text-[#009FE3]">Points per race position:</b><br />
                    <span className="block mb-1">{POINTS_PER_POSITION.map((p, i) => `${i+1}: ${p}`).join(' | ')}</span>
                    <b className="text-[#009FE3]">Points per qualifying position:</b><br />
                    <span className="block mb-1">{POINTS_PER_QUALIF.map((p, i) => `${i+1}: ${p}`).join(' | ')}</span>
                    <b className="text-[#009FE3]">Fastest lap bonus:</b> <span>+1 point</span><br /><br />
                    <span className="text-[#009FE3]">Blue columns</span> are those that count for the total.
                  </div>
                }>
                  <span className="text-[#009FE3] text-xl px-2 py-1 cursor-pointer font-bold" style={{display:'inline-block'}}>?</span>
                </Tooltip>
              </span>
            }
          />
          <Card.Content>
            <Table columns={driverColumns} data={sortedDriverRows} />
          </Card.Content>
        </Card>
      )}
      {view === 'team' && (
        <Card>
          <Card.Header 
            title={
              <span className="flex items-center gap-2">
                Team Standings
                <Tooltip content={
                  <div>
                    <b className="text-[#009FE3]">Scoring rules</b><br />
                    <span>The total is the sum of the team's <b>{RACE_COUNT} best averages per race</b> (average of the team's drivers' points for each race).</span><br /><br />
                    <b className="text-[#009FE3]">Points per race position:</b><br />
                    <span className="block mb-1">{POINTS_PER_POSITION.map((p, i) => `${i+1}: ${p}`).join(' | ')}</span>
                    <b className="text-[#009FE3]">Points per qualifying position:</b><br />
                    <span className="block mb-1">{POINTS_PER_QUALIF.map((p, i) => `${i+1}: ${p}`).join(' | ')}</span>
                    <b className="text-[#009FE3]">Fastest lap bonus:</b> <span>+1 point</span><br /><br />
                    <span className="text-[#009FE3]">Blue columns</span> are those that count for the total.
                  </div>
                }>
                  <span className="text-[#009FE3] text-xl px-2 py-1 cursor-pointer font-bold" style={{display:'inline-block'}}>?</span>    </Tooltip>
              </span>
            }
          />
          <Card.Content>
            <Table columns={teamColumns} data={sortedTeamRows} />
          </Card.Content>
        </Card>
      )}
    </>
  );
};

