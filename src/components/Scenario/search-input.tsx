"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import qs from "qs";
import { ButtonGroup } from "@/components/ui/button-group";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/react";
import { cn } from "@/lib/utils";

export function ScenarioSearchInput({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { t } = useTranslation();

  const keyword = searchParams.get("keyword") || "";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const keyword = (e.target as HTMLFormElement).keyword.value.trim();
    const currentQuery = qs.parse(searchParams.toString());
  
    if (keyword) {
      router.push(`${pathname}?${qs.stringify({ ...currentQuery, keyword })}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center">
      <ButtonGroup orientation="horizontal" className={cn("w-full", className)}>
        <Input
          name="keyword"
          placeholder={t("scenario_search_placeholder")}
          defaultValue={keyword}
        />
        <Button className="capitalize" color="primary" type="submit">
          <Search size={16} />
          {t("search")}
        </Button>
      </ButtonGroup>
    </form>
  );
}
