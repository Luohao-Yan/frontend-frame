"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../lib/utils";

/**
 * 统一风格的日期选择器组件（shadcn 风格，Popover + Calendar）。
 * 值为 'YYYY-MM-DD' 字符串，与后端字段格式保持一致。
 *
 * @origin Apache-2.0 / fde-workspace (src/components/ui/date-picker.tsx)
 */

/** 将 'YYYY-MM-DD' 字符串解析为本地 Date，非法输入返回 undefined */
function parseDate(value: string | undefined): Date | undefined {
	if (!value) return undefined;
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) return undefined;
	const [, year, month, day] = match;
	const date = new Date(Number(year), Number(month) - 1, Number(day));
	return !Number.isNaN(date.getTime()) ? date : undefined;
}

/** 将 Date 格式化为 'YYYY-MM-DD' 字符串（本地时区） */
function toDateValue(date: Date | undefined): string {
	if (!date) return "";
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

interface DatePickerProps {
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

function DatePicker({
	value,
	onChange,
	onBlur,
	placeholder = "请选择日期",
	disabled,
	className,
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);
	const selected = parseDate(value);

	const handleOpenChange = React.useCallback(
		(nextOpen: boolean) => {
			setOpen(nextOpen);
			if (!nextOpen) onBlur?.();
		},
		[onBlur],
	);

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="default"
					disabled={disabled}
					className={cn(
						"border-input bg-background text-foreground h-9 w-full justify-start rounded-md border px-3 py-1 text-sm font-normal shadow-sm",
						!selected && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="text-muted-foreground mr-2 size-4" />
					{selected ? toDateValue(selected) : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					initialFocus
					selected={selected}
					onSelect={(date) => {
						onChange(toDateValue(date));
						setOpen(false);
					}}
				/>
				<div className="flex items-center justify-end border-t p-2">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs font-medium"
						onClick={() => {
							onChange(toDateValue(new Date()));
							setOpen(false);
						}}
					>
						今天
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export { DatePicker };
