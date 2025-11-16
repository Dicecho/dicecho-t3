import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useControllableState } from "@/hooks/useControllableState";

import type { ComponentProps, FC } from "react";

type ButtonProps = ComponentProps<typeof Button>;

interface ControllablePaginationProps
  extends Omit<ComponentProps<"div">, "onChange"> {
  current?: number;
  initialCurrent?: number;
  total: number;
  onChange?: (page: number) => void;
  disabled?: boolean;
  ellipsisLength?: number;
  showPageSize?: boolean;
}

export const ControllablePagination: FC<ControllablePaginationProps> = ({
  current: propsCurrent,
  initialCurrent = 1,
  disabled = false,
  ellipsisLength = 2,
  showPageSize = false,
  total,
  className,
  onChange: propsOnChange,
  ...props
}) => {
  const [current, setCurrent] = useControllableState(
    initialCurrent,
    propsCurrent,
    propsOnChange,
  );

  const PaginationBtn = ({
    page,
    ...props
  }: ButtonProps & { page: number }) => (
    <Button
      disabled={disabled}
      variant="ghost"
      onClick={() => setCurrent(page)}
      {...props}
    >
      {page}
    </Button>
  );

  return (
    <Pagination {...props}>
      <PaginationContent>
        {current - ellipsisLength > 1 && (
          <PaginationItem>
            <PaginationBtn page={1} />
          </PaginationItem>
        )}

        {current - ellipsisLength > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {new Array(2 * ellipsisLength + 1)
          .fill(0)
          .map((_, index) => index + current - ellipsisLength)
          .filter((page) => page > 0 && page <= total)
          .map((page) => (
            <PaginationItem key={page}>
              {page === current ? (
                <Button variant="outline" disabled>
                  {current}
                </Button>
              ) : (
                <PaginationBtn page={page} />
              )}
            </PaginationItem>
          ))}

        {total - current - ellipsisLength > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {total - current - ellipsisLength > 0 && (
          <PaginationItem>
            <PaginationBtn page={total} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
