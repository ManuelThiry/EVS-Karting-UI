import { useMemo } from "react";
import { Card } from "../common/Card";
import { Table, type Column } from "../common/Table";
import { useRaceQuery } from "../api/useRaceQuery";

export const POINTS_PER_POSITION = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export const Standing = () => {
  const { data: races, loading, error } = useRaceQuery();

  const standings = useMemo(() => {
    if (!Array.isArray(races)) {
      return { driverRows: [], raceColumns: [] };
    }

    // Trie les courses par id croissant
    const sortedRaces = [...races].sort((a: any, b: any) => (a.id ?? 0) - (b.id ?? 0));

    const allDriversSet = new Set<string>();
    sortedRaces.forEach((race: any) => {
      let drivers: string[] = [];
      if (Array.isArray(race.drivers)) {
        drivers = race.drivers;
      } else if (typeof race.drivers === "string") {
        drivers = race.drivers.split(",").map((d: string) => d.trim()).filter(Boolean);
      }
      drivers.forEach((d) => allDriversSet.add(d));
    });
    const allDrivers = Array.from(allDriversSet);

    const raceColumns = sortedRaces.map((race: any) => {
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
      sortedRaces.forEach((race: any) => {
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
        ...pointsByRace,
        total,
      };
    });

    return { driverRows, raceColumns };
  }, [races]);

  const columns: Column<any>[] = [
    { key: "position", label: "#", align: "left" },
    { key: "name", label: "Driver", align: "left" },
    ...(standings.raceColumns || []),
    { key: "total", label: "Total", align: "right" },
  ];

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message || error.toString()}</div>;
  if (!standings.driverRows?.length) return <div>No data found.</div>;

  const sortedRows = [...standings.driverRows]
    .sort((a, b) => b.total - a.total)
    .map((row, idx) => ({
      position: idx + 1,
      name: row.name,
      ...Object.fromEntries(Object.entries(row).filter(([k]) => k !== "name")),
    }));

  return (
    <Card>
      <Card.Header title="Standing" />
      <Card.Content>
        <Table columns={columns} data={sortedRows} />
      </Card.Content>
    </Card>
  );
};

