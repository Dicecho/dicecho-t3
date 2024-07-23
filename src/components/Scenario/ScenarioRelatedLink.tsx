import clsx from "clsx";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";

import type { ComponentProps, FC } from "react";
import type { IModDto } from "@dicecho/types";
import Link from "next/link";

interface ScenarioRelatedLink extends ComponentProps<"div"> {
  relatedLinks: IModDto["relatedLinks"];
}

export const ScenarioRelatedLink: FC<ScenarioRelatedLink> = ({
  relatedLinks,
  className,
  ref,
  ...props
}) => {
  return (
    <Card className={clsx(className, "p-4")} {...props}>
      <div className="flex flex-col">
        {relatedLinks.map((link, i) => (
          <div
            key={link.url}
            className={clsx(
              "mb-2 flex items-center border-b border-dashed pb-2 last:mb-0 last:border-b-0 last:pb-0",
            )}
          >
            <span>{link.name}</span>
            <Link className="ml-auto" href={link.url} target="_blank">
              <Button
                color="primary"
                className="w-8 h-8"
                size='icon'
              >
                <LinkIcon size={14} />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
};
