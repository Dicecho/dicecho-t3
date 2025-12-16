import { useDicecho } from "./useDicecho";
import { useQuery } from "@tanstack/react-query";

export function useScenarioConfig() {
  const { api } = useDicecho();
  return useQuery({
    queryKey: ["scenario", "config"],
    queryFn: () => api.module.config(),
  });
}