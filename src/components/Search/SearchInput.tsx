"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { trackSearch } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function SearchInput({ placeholder, className, inputClassName }: SearchInputProps) {
  const searchParams = useSearchParams();
  const keywordParam = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState(keywordParam);
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const handleSearch = () => {
    if (keyword.trim()) {
      trackSearch(keyword.trim());
      router.push(`/${i18n.language}/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder ?? t("search_placeholder")}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn("pr-10 text-sm", inputClassName)}
        />
        <Button
          size="sm"
          variant="dim"
          className="absolute right-0 top-0 h-full"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

