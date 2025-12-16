"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import debounce from "lodash/debounce"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const values = props.value || props.defaultValue || [0]
  const thumbCount = Array.isArray(values) ? values.length : 1

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

interface DebouncedSliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    "value" | "onValueChange"
  > {
  value: number[]
  onValueChange: (value: number[]) => void
  debounceMs?: number
}

function DebouncedSlider({
  value,
  onValueChange,
  debounceMs = 300,
  ...props
}: DebouncedSliderProps) {
  const [internalValue, setInternalValue] = React.useState(value)

  const debouncedOnChange = React.useMemo(
    () => debounce(onValueChange, debounceMs),
    [onValueChange, debounceMs],
  )

  // Sync internal state when external value changes
  React.useEffect(() => {
    setInternalValue(value)
  }, [value])

  const handleValueChange = (newValue: number[]) => {
    setInternalValue(newValue)
    debouncedOnChange(newValue)
  }

  return <Slider {...props} value={internalValue} onValueChange={handleValueChange} />
}

export { Slider, DebouncedSlider }
