import React from "react";
import { Card } from "../../common/Card";
import { Table, type Column } from "../../common/Table";
import { useOutletContext } from "react-router-dom";

export const LineUps: React.FC = () => {
  const { race } = useOutletContext<any>();
  let data: { name: string; team: string; position: number }[] = [];
  if (Array.isArray(race?.drivers)) {
    if (race.drivers.length > 0 && typeof race.drivers[0] === 'object' && 'name' in race.drivers[0]) {
      data = race.drivers
        .map((d: any) => ({ name: d.name, team: d.team ?? "" }))
        .sort((a: any, b: any) => {
          const aLast = a.name.split(" ")[1] || a.name;
          const bLast = b.name.split(" ")[1] || b.name;
          return aLast.localeCompare(bLast, "fr", { sensitivity: "base" });
        })
        .map((item: any, idx: number) => ({ ...item, position: idx + 1 }));
    } else {
      data = race.drivers
        .map((name: string) => ({ name, team: "" }))
        .sort((a: any, b: any) => {
          const aLast = a.name.split(" ")[1] || a.name;
          const bLast = b.name.split(" ")[1] || b.name;
          return aLast.localeCompare(bLast, "fr", { sensitivity: "base" });
        })
        .map((item: any, idx: number) => ({ ...item, position: idx + 1 }));
    }
  } else if (typeof race?.drivers === "string") {
    data = race.drivers
      .split(",")
      .map((d: string) => d.trim())
      .filter(Boolean)
      .map((name: string) => ({ name, team: "" }))
      .sort((a: any, b: any) => {
        const aLast = a.name.split(" ")[1] || a.name;
        const bLast = b.name.split(" ")[1] || b.name;
        return aLast.localeCompare(bLast, "fr", { sensitivity: "base" });
      })
      .map((item: any, idx: number) => ({ ...item, position: idx + 1 }));
  }
  const columns: Column<{ position: number; name: string, team: string }>[] = [
    { key: "position", label: "#", align: "left" },
    { key: "name", label: "Driver", align: "left" },
    {
      key: "team",
      label: "Team",
      align: "center",
      render: (row) => row.team && row.team.trim() !== "" ? row.team : "-",
    },
  ];

  return (
    <Card>
      <Card.Header title="Line-Ups" subtitle="List of all participants" />
      <Card.Content>
        <Table columns={columns} data={data} />
      </Card.Content>
    </Card>
  );
};
