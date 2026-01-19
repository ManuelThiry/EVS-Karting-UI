

import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Table, type Column } from "../../common/Table";
import { Card } from "../../common/Card";

export const Results: React.FC = () => {
  const { race } = useOutletContext<any>();
  const [view, setView] = useState<'qualif' | 'race'>('race');



  // Parse results from the received JSON structure
  let parsedResults: any = {};
  if (race?.results) {
    if (typeof race.results === 'string') {
      try {
        parsedResults = JSON.parse(race.results);
      } catch (e) {
        parsedResults = {};
      }
    } else {
      parsedResults = race.results;
    }
  }

  // Handle both camelCase and PascalCase keys, and fallback to user JSON
  const qualifRaw = parsedResults.qualif || parsedResults.Qualif || parsedResults.qualifying || [];
  const raceRaw = parsedResults.race || parsedResults.Race || [];

  const qualifData = Array.isArray(qualifRaw)
    ? qualifRaw.map((item: any) => ({
        position: item.position ?? item.Position,
        name: item.name ?? item.Name,
        team: item.team && item.team.trim() !== "" ? item.team : (item.Team && item.Team.trim() !== "" ? item.Team : "-"),
        time: item.time ?? item.Time,
      }))
    : [];

  const raceData = Array.isArray(raceRaw)
    ? raceRaw.map((item: any) => ({
        position: item.position ?? item.Position,
        name: item.name ?? item.Name,
        team: item.team && item.team.trim() !== "" ? item.team : (item.Team && item.Team.trim() !== "" ? item.Team : "-"),
        gap: item.gap ?? item.Gap,
        bestLap: item.bestLap ?? item.BestLap ?? item.bestlap ?? "",
      }))
    : [];

  const qualifColumns: Column<any>[] = [
    { key: "position", label: "#", align: "left", width: "1%" },
    { key: "name", label: "Driver", align: "left", width: "5%" },
    { key: "team", label: "Team", align: "center", width: "10%" },
    { key: "time", label: "Time", align: "right", width: "10%" },
  ];

  const bestLapValue = raceData.reduce((best: string, curr: any) => {
    if (!curr.bestLap) return best;
    if (!best) return curr.bestLap;
    const toMs = (t: string) => {
      const [min, sec] = t.split(":");
      const [s, ms] = sec.split(".");
      return parseInt(min) * 60000 + parseInt(s) * 1000 + parseInt(ms.padEnd(3, '0'));
    };
    return toMs(curr.bestLap) < toMs(best) ? curr.bestLap : best;
  }, "");

  const raceColumns: Column<any>[] = [
    { key: "position", label: "#", align: "left", width: "1%" },
    { key: "name", label: "Driver", align: "left", width: "5%" },
    { key: "team", label: "Team", align: "center", width: "10%" },
    {
      key: "bestLap",
      label: "Best Lap",
      align: "right",
      width: "10%",
      render: (row: any) =>
        row.bestLap === bestLapValue && bestLapValue ? (
          <span style={{ color: "#009FE3", fontWeight: 600 }}>{row.bestLap}</span>
        ) : (
          row.bestLap
        ),
    },
    { key: "gap", label: "Gap", align: "right", width: "5%" },
    {
      key: "deltaPos",
      label: "",
      align: "right",
      width: "0.5%",
      render: (row: any) => {
        const qualif = qualifData.find((q: any) => q.name === row.name);
        if (!qualif || typeof qualif.position !== 'number' || typeof row.position !== 'number') return "";
        const delta = qualif.position - row.position;
        if (delta === 0) return "=";
        if (delta > 0) return <span style={{ color: '#00FF00' }}>+{delta}</span>;
        return <span style={{ color: '#E30000' }}>{delta}</span>;
      }
    },
  ];

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-lg transition font-semibold ${view === 'race' ? 'bg-[#009FE3] text-white' : 'bg-[#0A0F1F]/70 text-gray-300 hover:bg-[#009FE3]/30'}`}
          onClick={() => setView('race')}
        >
          Race Results
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition font-semibold ${view === 'qualif' ? 'bg-[#009FE3] text-white' : 'bg-[#0A0F1F]/70 text-gray-300 hover:bg-[#009FE3]/30'}`}
          onClick={() => setView('qualif')}
        >
          Qualifying Results
        </button>
      </div>
      {view === 'race' && (
        <Card>
          <Card.Header title="Race Results" subtitle="Final Ranking" />
          <Card.Content>
            <Table columns={raceColumns} data={raceData} />
          </Card.Content>
        </Card>
      )}
      {view === 'qualif' && (
        <Card>
          <Card.Header title="Qualifying Results" subtitle="Best Lap Times" />
          <Card.Content>
            <Table columns={qualifColumns} data={qualifData} />
          </Card.Content>
        </Card>
      )}
    </>
  );
};
