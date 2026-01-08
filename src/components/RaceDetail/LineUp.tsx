import React from "react";
import { Card } from "../../common/Card";
import { Table, type Column } from "../../common/Table";
import { useOutletContext } from "react-router-dom";

export const LineUps: React.FC = () => {
  const { race } = useOutletContext<any>();
  let drivers: string[] = [];
  if (Array.isArray(race?.drivers)) {
    drivers = race.drivers;
  } else if (typeof race?.drivers === "string") {
    drivers = race.drivers.split(",").map((d: string) => d.trim()).filter(Boolean);
  }

  const data = drivers
    .map((name) => ({ name }))
    .sort((a, b) => {
      const aLast = a.name.split(" ")[1] || a.name;
      const bLast = b.name.split(" ")[1] || b.name;
      return aLast.localeCompare(bLast, "fr", { sensitivity: "base" });
    })
    .map((item, idx) => ({ ...item, position: idx + 1 }));
  const columns: Column<{ position: number; name: string }>[] = [
    { key: "position", label: "#", align: "left" },
    { key: "name", label: "Driver", align: "left" },
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
