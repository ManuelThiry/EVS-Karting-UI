import { Card } from "../common/Card";

export const Presentation = () => {
  return (
    <Card>
      <Card.Header
  title="EVS Karting Championship 2026"
  subtitle="Welcome to the adventure!"
/>
      <Card.Content className="space-y-6 px-2 py-4 md:px-8 md:py-6">
        <div className="flex flex-col gap-4 text-base md:text-lg text-gray-200">
          <span className="text-xl font-semibold text-[#009FE3]">🏁 What is it?</span>
          <span>
            The <strong>EVS Karting Championship 2026</strong> is a friendly and thrilling competition organized by the <strong>A7 Core</strong> team, part of the <strong>Green Train</strong> initiative at <strong>EVS</strong>.<br />
            This year, we aim to unite <span className="font-bold text-[#009FE3]">20+ passionate drivers</span> across <span className="font-bold text-[#009FE3]">6 unique circuits</span> throughout 2026.<br />
            Whether you’re a seasoned racer or just here for the fun, everyone is welcome!
          </span>

          <span className="text-xl font-semibold text-[#009FE3]">🎉 Spirit & Format</span>
          <span>
            <strong>No seasonal commitment required</strong>—each race brings together a new mix of drivers, so you can join whenever you want.<br />
            The focus is on <span className="font-bold text-[#009FE3]">enjoyment, camaraderie, and fair play</span>.<br />
            Of course, there will be a ranking and a competitive edge, but above all, it’s about sharing great moments on and off the track.
          </span>

          <span className="text-xl font-semibold text-[#009FE3]">📅 How to join?</span>
          <span>
            Interested in racing or have questions? <br />
            Contact <strong>Manuel Thiry (MATH)</strong> via <strong>Teams</strong>.<br />
            Registration is open for all EVS colleagues—just reach out and get ready to race!
          </span>
        </div>
      </Card.Content>
    </Card>
  );
};
