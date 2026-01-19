import { useQuery } from "@tanstack/react-query";

export function useRaceQuery(id?: string | number) {
  const baseUrl = (window as any).env?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;
  const url = id
    ? `${baseUrl}/api/Race/${id}`
    : `${baseUrl}/api/Race`;

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
