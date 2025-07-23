import { useQuery } from "@tanstack/react-query";
import { fetchMovers } from "../api";

export default function TopMovers() {
  const { data, isLoading, error } = useQuery({ queryKey: ["movers"], queryFn: fetchMovers });

  if (isLoading) return <p>Loading top movers...</p>;
  if (error) return <p>Error loading top movers</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Top Movers</h3>
      <ul>
        {data.map((mover, index) => (
          <li key={index} className="flex justify-between py-1">
            <span>{mover.symbol}</span>
            <span className={`font-bold ${mover.change > 0 ? "text-green-500" : "text-red-500"}`}>
              {mover.change}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
