

import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Table, type Column } from "../../common/Table";
import { Card } from "../../common/Card";

export const Results: React.FC = () => {
  const { race } = useOutletContext<any>();
  const [view, setView] = useState<'qualif' | 'race'>('race');


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

  const qualifData = Array.isArray(parsedResults.Qualif)
    ? parsedResults.Qualif.map((item: any) => ({
        position: item.Position,
        name: item.Name,
        team: item.Team && item.Team.trim() !== "" ? item.Team : "-",
        time: item.Time,
      }))
    : [];
  const raceData = Array.isArray(parsedResults.Race)
    ? parsedResults.Race.map((item: any) => ({
        position: item.Position,
        name: item.Name,
        team: item.Team && item.Team.trim() !== "" ? item.Team : "-",
        gap: item.Gap,
      }))
    : [];

  const qualifColumns: Column<any>[] = [
    { key: "position", label: "#", align: "left" },
    { key: "name", label: "Driver", align: "left" },
    { key: "team", label: "Team", align: "left" },
    { key: "time", label: "Time", align: "right" },
  ];

  const raceColumns: Column<any>[] = [
    { key: "position", label: "#", align: "left" },
    { key: "name", label: "Driver", align: "left" },
    { key: "team", label: "Team", align: "left" },
    { key: "gap", label: "Gap", align: "right" },
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
