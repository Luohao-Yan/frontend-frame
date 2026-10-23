import { CheckIcon, CopyIcon } from "lucide-react";
import * as React from "react";

import { Button, cn } from "@frontend-frame/ui";

export function Section({
	title,
	description,
	actions,
	children,
	className,
}: {
	title: string;
	description?: string;
	actions?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("space-y-4", className)}>
			<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold tracking-tight">{title}</h2>
					{description ? (
						<p className="text-muted-foreground mt-1 text-sm">{description}</p>
					) : null}
				</div>
				{actions}
			</div>
			{children}
		</section>
	);
}

export function CodeBlock({
	code,
	language = "tsx",
	className,
}: {
	code: string;
	language?: string;
	className?: string;
}) {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1600);
	};

	return (
		<div
			className={cn(
				"bg-muted/40 group relative overflow-hidden rounded-xl border",
				className,
			)}
		>
			<div className="text-muted-foreground flex items-center justify-between border-b px-4 py-2 text-xs">
				<span className="font-mono">{language}</span>
				<Button
					variant="ghost"
					size="sm"
					className="h-7 gap-1.5 px-2 text-xs"
					onClick={handleCopy}
				>
					{copied ? (
						<CheckIcon className="size-3.5" />
					) : (
						<CopyIcon className="size-3.5" />
					)}
					{copied ? "已复制" : "复制"}
				</Button>
			</div>
			<pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
				<code>{code}</code>
			</pre>
		</div>
	);
}

export function PropTable({
	rows,
}: {
	rows: Array<{
		name: string;
		type: string;
		defaultValue?: string;
		description: string;
	}>;
}) {
	return (
		<div className="overflow-x-auto rounded-xl border">
			<table className="w-full text-sm">
				<thead className="bg-muted/40 text-muted-foreground text-left text-xs uppercase">
					<tr>
						<th className="px-4 py-2.5 font-medium">属性</th>
						<th className="px-4 py-2.5 font-medium">类型</th>
						<th className="px-4 py-2.5 font-medium">默认值</th>
						<th className="px-4 py-2.5 font-medium">说明</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.name} className="border-t">
							<td className="px-4 py-2.5 font-mono text-xs">{row.name}</td>
							<td className="text-muted-foreground px-4 py-2.5 font-mono text-xs">
								{row.type}
							</td>
							<td className="text-muted-foreground px-4 py-2.5 font-mono text-xs">
								{row.defaultValue ?? "-"}
							</td>
							<td className="text-muted-foreground px-4 py-2.5 text-xs">
								{row.description}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
