import React from "react";
import { Card } from "../../common/Card";
import { Table, type Column } from "../../common/Table";
import { useOutletContext } from "react-router-dom";
import { Drivers } from "../../api/Data";

export const LineUps: React.FC = () => {
  const { race } = useOutletContext<any>();
  let data: { name: string; team: string; position: number }[] = [];
  if (Array.isArray(race?.drivers)) {
    data = race.drivers
      .map((driverId: string) => {
        const driver = Drivers.find(d => d.id === driverId);
        return {
          name: driver?.name || driverId,
          team: driver?.team?.join(" / ") || "-"
        };
      })
      .sort((a: { name: string }, b: { name: string }) => {
        const aLast = a.name.split(" ")[1] || a.name;
        const bLast = b.name.split(" ")[1] || b.name;
        return aLast.localeCompare(bLast, "fr", { sensitivity: "base" });
      })
      .map((item: { name: string; team: string }, idx: number) => ({ ...item, position: idx + 1 }));
  }
  const columns: Column<{ position: number; name: string, team: string }>[] = [
    { key: "name", label: "Driver", align: "left", width: 80,sortable: true },
    {
      key: "team",
      label: "Team",
      align: "center",
      width: 500,
      sortable: true,
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
