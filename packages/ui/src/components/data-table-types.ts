// @origin Apache-2.0 / fde-workspace (types/data-table.ts, config/data-table.ts)
// Shared types for the data-table sub-components (column-header, toolbar,
// faceted/date/slider filters, view-options, pagination, skeleton).
import type { RowData } from "@tanstack/react-table";

export type FilterOperator =
	| "iLike"
	| "notILike"
	| "eq"
	| "ne"
	| "inArray"
	| "notInArray"
	| "isEmpty"
	| "isNotEmpty"
	| "lt"
	| "lte"
	| "gt"
	| "gte"
	| "isBetween"
	| "isRelativeToToday";

export type FilterVariant =
	| "text"
	| "number"
	| "range"
	| "date"
	| "dateRange"
	| "boolean"
	| "select"
	| "multiSelect";

export type JoinOperator = "and" | "or";

export interface Option {
	label: string;
	value: string;
	count?: number;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

// Extend @tanstack/react-table's ColumnMeta so column definitions can carry
// the metadata consumed by the data-table sub-components below.
declare module "@tanstack/react-table" {
	/* eslint-disable @typescript-eslint/no-unused-vars -- interface type params required by @tanstack/react-table */
	interface ColumnMeta<TData extends RowData, TValue> {
		label?: string;
		placeholder?: string;
		variant?: FilterVariant;
		options?: Option[];
		range?: [number, number];
		unit?: string;
		icon?: React.FC<React.SVGProps<SVGSVGElement>>;
	}
}
