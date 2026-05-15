import { Card } from "../../common/Card";
import { useOutletContext } from "react-router-dom";

export const CircuitDetails: React.FC = () => {
  const { race } = useOutletContext<any>();
  if (!race) return <div>No data found.</div>;

  return (
    <Card className="border-[#009FE3]/30">
      <Card.Header title={race.name || "Track Details"} subtitle="Event Information" />
      <Card.Content>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            className="w-full md:w-60 h-60 object-cover rounded-lg border border-[#009FE3]/20"
            src={race.imageUrl || "https://static.vecteezy.com/system/resources/previews/006/526/923/original/unknown-location-concepts-vector.jpg"}
            alt="Track Layout"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 text-sm w-full">
            <Detail label="Date" value={race.date ? (race.date instanceof Date ? race.date : new Date(race.date)).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          }) : "TBD"} />
            <Detail label="Location" value={race.address || "-"} />
            <Detail label="Track Length" value={race.distance || "-"} />
            <Detail label="Race Format" value={race.format || "-"} />
            <Detail label="Price" value={race.price ? race.price + "€" : "-"} />
            <Detail label="Contact" value={race.contact || "-"} />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

type DetailProps = {
  label: string;
  value: string;
};

const Detail: React.FC<DetailProps> = ({ label, value }) => (
  <div className="flex flex-col bg-[#0A0F1F]/40 p-3 rounded-lg border border-[#009FE3]/10">
    <span className="text-xs uppercase tracking-wide text-[#009FE3]/80">
      {label}
    </span>
    <span className="text-base text-white font-medium">{value}</span>
  </div>
);
