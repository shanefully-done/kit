"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
	const _values = React.useMemo(
		() =>
			Array.isArray(value)
				? value
				: Array.isArray(defaultValue)
					? defaultValue
					: [min, max],
		[value, defaultValue, min, max],
	);

	return (
		<SliderPrimitive.Root
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			className={cn(
				"relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
				className,
			)}
			{...props}
		>
			<SliderPrimitive.Track
				data-slot="slider-track"
				className={cn(
					"relative h-[2px] w-full grow bg-ink data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[2px]",
				)}
			>
				<SliderPrimitive.Range
					data-slot="slider-range"
					className={cn(
						"absolute h-full bg-hazard data-[orientation=vertical]:w-full",
					)}
				/>
			</SliderPrimitive.Track>
			{Array.from({ length: _values.length }, (_, index) => (
				<SliderPrimitive.Thumb
					data-slot="slider-thumb"
					key={index}
					className={cn(
						"block size-3 border border-ink bg-card shadow-none ring-0 transition-colors hover:bg-hazard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hazard focus-visible:border-hazard disabled:pointer-events-none disabled:opacity-50",
					)}
				/>
			))}
		</SliderPrimitive.Root>
	);
}

export { Slider };
