// @origin Apache-2.0 / fde-workspace (components/ui/table/data-table-view-options.tsx)
import type { Table } from "@tanstack/react-table";
import { Check, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "./button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../lib/utils";

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>;
}

export function DataTableViewOptions<TData>({
	table,
}: DataTableViewOptionsProps<TData>) {
	const columns = React.useMemo(
		() =>
			table
				.getAllColumns()
				.filter(
					(column) =>
						typeof column.accessorFn !== "undefined" && column.getCanHide(),
				),
		[table],
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					aria-label="列设置"
					variant="outline"
					size="sm"
					className="ml-auto hidden h-8 lg:flex"
				>
					<SlidersHorizontal />
					视图
					<ChevronsUpDown className="ml-auto opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-44 p-0">
				<Command>
					<CommandInput placeholder="搜索列..." />
					<CommandList>
						<CommandEmpty>未找到列。</CommandEmpty>
						<CommandGroup>
							{columns.map((column) => (
								<CommandItem
									key={column.id}
									onSelect={() =>
										column.toggleVisibility(!column.getIsVisible())
									}
								>
									<span className="truncate">
										{column.columnDef.meta?.label ?? column.id}
									</span>
									<Check
										className={cn(
											"ml-auto size-4 shrink-0",
											column.getIsVisible() ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
