

import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Table, type Column } from "../../common/Table";
import { Card } from "../../common/Card";
import { Drivers } from "../../api/Data";

export const Results: React.FC = () => {
  const { race } = useOutletContext<any>();
  const [view, setView] = useState<'qualif' | 'race'>('race');

  // Adapté à la structure statique : race.qualifResults et race.raceResults
  const getTeam = (driverName: string): string => {
    const driver = Drivers.find(d => d.name === driverName);
    return driver?.team?.join(" / ") || "-";
  };

  const qualifData = Array.isArray(race?.qualifResults)
    ? race.qualifResults.map((item: any) => ({
        position: item.position,
        name: item.driver,
        team: getTeam(item.driver),
        time: item.time,
      }))
    : [];

  const raceData = Array.isArray(race?.raceResults)
    ? race.raceResults.map((item: any) => ({
        position: item.position,
        name: item.driver,
        team: getTeam(item.driver),
        gap: item.gap,
        bestLap: item.bestLap,
      }))
    : [];

  const qualifColumns: Column<any>[] = [
    { key: "name", label: "Driver", align: "left", width: 80, sortable: true },
    { key: "team", label: "Team", align: "center", width: 250, sortable: true },
    { key: "time", label: "Time", align: "right", width: 100 },
    {
      key: "gap",
      label: "",
      align: "right",
      width: 15,
      render: (row: any, _idx: number) => {
        if (_idx === 0) return "";
        const bestTime = qualifData[0]?.time;
        const thisTime = row.time;
        if (!bestTime || !thisTime) return "";
        const toMs = (t: string | undefined): number => {
          if (!t) return Infinity;
          const parts = t.split(":");
          if (parts.length === 2) {
            // Format: MM:SS.sss
            const [min, sec] = parts;
            const [s, ms] = sec.split(".");
            return parseInt(min) * 60000 + parseInt(s) * 1000 + parseInt((ms || '0').padEnd(3, '0'));
          } else if (parts.length === 1) {
            // Format: SS.sss (moins d'une minute)
            const [s, ms] = t.split(".");
            return parseInt(s) * 1000 + parseInt((ms || '0').padEnd(3, '0'));
          }
          return Infinity;
        };
        const gapMs = toMs(thisTime) - toMs(bestTime);
        if (gapMs <= 0) return "";
        // Affiche le gap formaté
        const sec = (gapMs / 1000).toFixed(3);
        return <span>+{sec}</span>;
      }
    },
  ];

  const toMs = (t: string | undefined): number => {
    if (!t) return Infinity;
    const parts = t.split(":");
    if (parts.length === 2) {
      // Format: MM:SS.sss
      const [min, sec] = parts;
      const [s, ms] = sec.split(".");
      return parseInt(min) * 60000 + parseInt(s) * 1000 + parseInt((ms || '0').padEnd(3, '0'));
    } else if (parts.length === 1) {
      // Format: SS.sss (moins d'une minute)
      const [s, ms] = t.split(".");
      return parseInt(s) * 1000 + parseInt((ms || '0').padEnd(3, '0'));
    }
    return Infinity;
  };

  const bestLapValue = raceData.reduce((best: string, curr: any) => {
    if (!curr.bestLap) return best;
    if (!best) return curr.bestLap;
    return toMs(curr.bestLap) < toMs(best) ? curr.bestLap : best;
  }, "");

  const raceColumns: Column<any>[] = [
    { key: "name", label: "Driver", align: "left", width: 80, sortable: true },
    { key: "team", label: "Team", align: "center", width: 250, sortable: true },
    {
      key: "bestLap",
      label: "Best Lap",
      align: "center",
      width: 100,
      sortable: true,
      render: (row: any) =>
        row.bestLap === bestLapValue && bestLapValue ? (
          <span style={{ color: "#009FE3", fontWeight: 600 }}>{row.bestLap}</span>
        ) : (
          row.bestLap
        ),
    },
    { key: "gap", label: "Gap", align: "right", width: 60 },
    {
      key: "deltaPos",
      label: "",
      align: "right",
      width: 10,
      sortable: true,
      // Tri numérique réel sur deltaPos, supporte l'ordre asc/desc
      sortFunction: (a: any, b: any, order?: 'asc' | 'desc') => {
        const qa = qualifData.find((q: any) => q.name === a.name);
        const qb = qualifData.find((q: any) => q.name === b.name);
        const deltaA = qa && typeof qa.position === 'number' && typeof a.position === 'number' ? qa.position - a.position : 0;
        const deltaB = qb && typeof qb.position === 'number' && typeof b.position === 'number' ? qb.position - b.position : 0;
        if (order === 'desc') {
          return deltaA - deltaB;
        } else {
          return deltaB - deltaA;
        }
      },
      render: (row: any) => {
        const qualif = qualifData.find((q: any) => q.name === row.name);
        if (!qualif || typeof qualif.position !== 'number' || typeof row.position !== 'number') return "";
        const delta = qualif.position - row.position;
        if (delta === 0) return "=";
        if (delta > 0) return <span style={{ color: '#00FF00' }}>+{delta}</span>;
        return <span style={{ color: '#E30000' }}>{delta}</span>;
      },
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
