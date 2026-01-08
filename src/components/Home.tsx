import React, { useState } from "react";
import { Button } from "../common/Button";
import { Presentation } from "./Presentation";
import { Standing } from "./Standing";
import { FaCalendarAlt, FaInfoCircle, FaTrophy } from "react-icons/fa";
import { Schedule } from "./Schedule";

const Home: React.FC = () => {
  const [selected, setSelected] = useState<
    "default" | "presentation" | "standing"
  >("default");

  return (
    <>
      <div className="flex justify-end gap-3">
        <Button
          selected={selected === "default"}
          color="outline"
          onClick={() => setSelected("default")}
        >
          <FaCalendarAlt />
        </Button>
        <Button
          selected={selected === "presentation"}
          color="outline"
          onClick={() => setSelected("presentation")}
        >
          <FaInfoCircle />
        </Button>
        <Button
          color="outline"
          selected={selected === "standing"}
          onClick={() => setSelected("standing")}
        >
          <FaTrophy />
        </Button>
      </div>
      {selected === "presentation" && <Presentation />}
      {selected === "standing" && <Standing />}
      {selected === "default" && <Schedule />}
    </>
  );
};

export default Home;
