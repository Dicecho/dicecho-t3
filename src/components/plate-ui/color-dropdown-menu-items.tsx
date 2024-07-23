'use client';

import React from 'react';

import type { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu';

import { cn } from '@udecode/cn';
import { Check } from 'lucide-react'

import type { TColor } from './color-dropdown-menu';

import { buttonVariants } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ColorDropdownMenuItemProps = {
  isBrightColor: boolean;
  isSelected: boolean;
  name?: string;
  updateColor: (color: string) => void;
  value: string;
} & DropdownMenuItemProps;

export function ColorDropdownMenuItem({
  className,
  isBrightColor,
  isSelected,
  name,
  updateColor,
  value,
  ...props
}: ColorDropdownMenuItemProps) {
  const content = (
    <DropdownMenuItem
      className={cn(
        buttonVariants({
          variant: 'outline',
        }),
        'size-6 border border-solid border-muted p-0 cursor-pointer',
        !isBrightColor && 'border-transparent text-white',
        className
      )}
      onSelect={(e) => {
        e.preventDefault();
        updateColor(value);
      }}
      style={{ backgroundColor: value }}
      {...props}
    >
      {isSelected ? <Check /> : null}
    </DropdownMenuItem>
  );

  return name ? (
    <Tooltip>
      <TooltipTrigger>{content}</TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  ) : (
    content
  );
}

type ColorDropdownMenuItemsProps = {
  color?: string;
  colors: TColor[];
  updateColor: (color: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export function ColorDropdownMenuItems({
  className,
  color,
  colors,
  updateColor,
  ...props
}: ColorDropdownMenuItemsProps) {
  return (
    <div
      className={cn('grid grid-cols-[repeat(10,1fr)] gap-1', className)}
      {...props}
    >
      {colors.map(({ isBrightColor, name, value }) => (
        <ColorDropdownMenuItem
          isBrightColor={isBrightColor}
          isSelected={color === value}
          key={name ?? value}
          name={name}
          updateColor={updateColor}
          value={value}
        />
      ))}
    </div>
  );
}
