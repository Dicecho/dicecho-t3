import { type ComponentProps, type FC } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import qs from "qs";

interface QueryablePaginationProps extends ComponentProps<"div"> {
  url: string;
  current: number;
  total: number;
  queryKey?: string;
}

export const QueryablePagination: FC<QueryablePaginationProps> = ({
  current,
  total,
  url,
  queryKey = "page",
  className,
  ...props
}) => {
  const makeUrl = (page: number) => {
    const pathname = url.split("?")[0] ?? "";
    const query = qs.parse(url.split("?")[1] ?? "");
    const q = Object.assign(query, { [queryKey]: page });
    return pathname + "?" + qs.stringify(q);
  };

  return (
    <Pagination>
      <PaginationContent>
        {current !== 1 && (
          <PaginationItem>
            <PaginationPrevious href={makeUrl(current - 1)} />
          </PaginationItem>
        )}

        {current > 2 && (
          <PaginationItem>
            <PaginationLink href={makeUrl(1)}>1</PaginationLink>
          </PaginationItem>
        )}

        {current > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {current > 1 && (
          <PaginationItem>
            <PaginationLink href={makeUrl(current - 1)}>
              {current - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink href={makeUrl(current)} isActive>
            {current}
          </PaginationLink>
        </PaginationItem>

        {total - current > 0 && (
          <PaginationItem>
            <PaginationLink href={makeUrl(current + 1)}>
              {current + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {total - current > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {total - current > 1 && (
          <PaginationItem>
            <PaginationLink href={makeUrl(total)}>{total}</PaginationLink>
          </PaginationItem>
        )}

        {total - current > 0 && (
          <PaginationItem>
            <PaginationNext href={makeUrl(current + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
