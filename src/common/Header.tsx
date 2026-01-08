
import { Link } from "react-router-dom";
import evs from "../assets/EVS.png";

export const Header = () => {
  return (
    <nav className="w-full h-20 bg-[#0A0F1F]/80 border-b border-[#009FE3]/20 backdrop-blur-md px-8 flex items-center gap-4">
      <Link to="/" className="flex items-center gap-4">
        <img src={evs} alt="EVS Logo" className="h-24 w-auto object-contain" />
        <h2 className="text-xl font-semibold tracking-wide text-[#009FE3]">
          Karting Championship 2026
        </h2>
      </Link>
    </nav>
  );
};
