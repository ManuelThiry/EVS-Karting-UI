import React from "react";
import { Outlet, Link, useLocation, useParams } from "react-router-dom";
import { Races } from "../../api/Data";

const RaceDetail: React.FC = () => {
  const location = useLocation();
  const { id } = useParams();

  // Trouver la course par id dans Races
  const race = Races.find(r => String(r.id) === String(id));
  if (!race) return <div>No data found.</div>;

  return (
    <>
      <div className="p-2 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2>{race.name || "-"}</h2>
          <span>Date: {race.date ? new Date(race.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "TBD"}</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/race-detail/${id}`}
            className={`px-4 py-2 rounded-lg ${
              location.pathname === `/race-detail/${id}`
                ? "bg-[#009FE3] text-white"
                : "bg-[#0A0F1F]/70 text-gray-300 hover:bg-[#009FE3]/30"
            } transition`}
          >
            Circuit Details
          </Link>

          <Link
            to={`/race-detail/${id}/line-ups`}
            className={`px-4 py-2 rounded-lg ${
              location.pathname === `/race-detail/${id}/line-ups`
                ? "bg-[#009FE3] text-white"
                : "bg-[#0A0F1F]/70 text-gray-300 hover:bg-[#009FE3]/30"
            } transition`}
          >
            Line-Ups
          </Link>

          <Link
            to={`/race-detail/${id}/results`}
            className={`px-4 py-2 rounded-lg ${
              location.pathname === `/race-detail/${id}/results`
                ? "bg-[#009FE3] text-white"
                : "bg-[#0A0F1F]/70 text-gray-300 hover:bg-[#009FE3]/30"
            } transition`}
          >
            Results
          </Link>

          <Link
            to="/"
            className="px-4 py-2 bg-[#009FE3] text-white rounded-lg hover:bg-[#00b5ff] transition"
          >
            Back Home
          </Link>
        </div>
      </div>

      <Outlet context={{ race }} />
    </>
  );
};

export default RaceDetail;
