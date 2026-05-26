import { useNavigate } from "react-router-dom";
import { Card } from "../common/Card";
import { useEffect, useState } from "react";
import { Races } from "../api/Data";

export const Schedule = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<string>("");

  const now = new Date();
  const racesArray = Races;
  const nextRace = racesArray
    .filter((race) => race.date)
    .map((race) => ({ ...race, dateObj: race.date instanceof Date ? race.date : new Date(race.date as any) }))
    .filter((race) => race.dateObj > now)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())[0];

  const getWinner = (race: typeof Races[number]): string | null => {
    if (!race.raceResults || race.raceResults.length === 0) return null;
    return race.raceResults[0].driver || null;
  };

  useEffect(() => {
    if (!nextRace) return;
    const updateCountdown = () => {
      const now = new Date();
      const diff = nextRace.dateObj.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      const pad = (n: number) => n.toString().padStart(2, "0");
      let str = "";
      if (days > 0) str += `${days}D `;
      str += `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      setCountdown(str);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [nextRace]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {racesArray.map((race, index) => {
          const isNext = nextRace && race.id === nextRace.id;
          // Get track image and name
          const imageUrl = race.imageUrl;
          const trackName = race.name;
          // Get period (or fallback)
          const period = (race.date instanceof Date)
            ? race.date.toLocaleString('default', { month: 'long' })
            : (race.date ? new Date(race.date as any).toLocaleString('default', { month: 'long' }) : '-');
          // Get drivers count
          const driversCount = Array.isArray(race.drivers) ? race.drivers.length : 0;
          return (
            <div
              key={race.id || index}
              className="cursor-pointer group"
              onClick={() => navigate(`/race-detail/${race.id}`)}
              tabIndex={0}
              role="button"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/race-detail/${race.id}`); }}
            >
              <Card
                imageUrl={imageUrl}
                topRight={(() => {
                  const winner = getWinner(race);
                  if (winner) {
                    return (
                      <div className="absolute top-0 right-0 rounded-bl-md px-3 py-1 bg-black/70 min-w-[90px] flex items-center justify-end gap-2" style={{borderTopRightRadius: '0.75rem', borderBottomLeftRadius: '0.5rem'}}>
                          <span role="img" aria-label="trophy">🏆</span>
                        <span className="text-xs text-white font-medium whitespace-nowrap">{winner}</span>
                      </div>
                    );
                  }
                  if (isNext && countdown) {
                    return (
                      <div className="absolute top-0 right-0 rounded-bl-md px-3 py-1 bg-black/70 min-w-[90px] flex items-center justify-end" style={{borderTopRightRadius: '0.75rem', borderBottomLeftRadius: '0.5rem'}}>
                        <span className="font-mono text-xs text-[#009FE3] tracking-widest">{countdown}</span>
                      </div>
                    );
                  }
                  return undefined;
                })()}
                className="group-hover:scale-[1.02] group-hover:shadow-[0_0_30px_#009FE340] transition-transform duration-150"
              >
                <Card.Header title={period || "-"} subtitle={trackName || "-"} />
                <Card.Content className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1 text-gray-300 text-xs">
                    <span>Date</span>
                    <span className="text-lg font-medium">{
                      race.date
                        ? (race.date instanceof Date
                            ? race.date.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })
                            : new Date(race.date as any).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })
                          )
                        : "TBD"
                    }</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 justify-center">
                    <span className="text-lg font-semibold text-white">{driversCount}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#009FE3]">
                      <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM3 16a7 7 0 0114 0v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z" />
                    </svg>
                  </div>
                </Card.Content>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
