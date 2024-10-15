import { useEffect, useState } from "react";
import Moment from "moment";

export default function LoginHead() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full flex flex-col fixed bg-gradient-to-b from-sky-400 to-sky-500 z-50">
      <div className="w-full flex justify-between items-center px-8 py-1">
        <div className="flex flex-row items-center space-x-2">
          <div className="text-white text-xl font-medium tracking-wide">
            <span className="font-bold">Jira</span>
          </div>
        </div>
        <div className="text-white text-base font-semibold">
          {Moment(date).format("MMMM Do YYYY, h:mm:ss a")}
        </div>
      </div>
    </div>
  );
}
