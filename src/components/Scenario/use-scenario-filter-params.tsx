import { useSearchParams } from "next/navigation";
import { getScenarioFilterQuery } from "@/components/Scenario/utils";

export function useScenarioFilterParams() {
  const searchParams = useSearchParams();
  return getScenarioFilterQuery(searchParams.toString());
}
