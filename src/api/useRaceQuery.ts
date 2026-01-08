import { useQuery } from "@tanstack/react-query";

export function useRaceQuery(id?: string | number) {
  const url = id
    ? `http://localhost:5000/api/Race/${id}`
    : "http://localhost:5000/api/Race";

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: id ? ["race", id] : ["races"],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  return { data, loading, error };
}
