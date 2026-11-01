// @origin Apache-2.0 / fde-workspace (components/ui/thinking.tsx)
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
	Check,
	ChevronDown,
	Circle,
	CircleX,
	Code,
	FileText,
	Loader2,
	Search,
} from "lucide-react";

import { cn } from "../lib/utils";
import { useElapsed } from "../hooks/use-elapsed";

export type ThinkingStatus = "streaming" | "done";

export interface ThinkingSource {
	file: string;
	startLine: number;
	endLine: number;
	score?: number;
}

export interface ThinkingStep {
	label: string;
	time?: string;
	dot?: "info" | "warn" | "error" | "done";
}

/** 单行 diff：add 增 / del 删 / ctx 上下文 */
export interface ThinkingDiffLine {
	text: string;
	tone: "add" | "del" | "ctx";
}

/** 一个工具调用涉及的文件级 diff（一个工具可能改多个文件） */
export interface ThinkingDiffFile {
	/** 文件路径（portal 标题） */
	path: string;
	/** diff 行（行级 LCS 最小 hunk，含 ctx 上下文） */
	diff: ThinkingDiffLine[];
	additions: number;
	deletions: number;
}

export interface ThinkingCodingItem {
	title: string;
	kind?: string;
	status: "in_progress" | "completed" | "failed";
	/** 跨所有文件的合计增删行数（行内摘要展示） */
	additions?: number;
	deletions?: number;
	rawInput?: string;
	/** 文件级 diff 列表（hover 工具行时弹出 portal 展示）；为空则不弹 */
	files?: ThinkingDiffFile[];
}

export type ThinkingProps =
	| {
			variant: "reasoning";
			status: ThinkingStatus;
			text: string;
			startedAt?: number;
			defaultOpen?: boolean;
			title?: string;
	  }
	| {
			variant: "search";
			status: ThinkingStatus;
			query: string;
			sources: ThinkingSource[];
			startedAt?: number;
			defaultOpen?: boolean;
			title?: string;
	  }
	| {
			variant: "coding";
			status: ThinkingStatus;
			items: ThinkingCodingItem[];
			startedAt?: number;
			defaultOpen?: boolean;
			title?: string;
	  }
	| {
			variant: "steps";
			status: ThinkingStatus;
			steps: ThinkingStep[];
			startedAt?: number;
			defaultOpen?: boolean;
			title?: string;
	  };

/* 变体默认标题（streaming 态） */
const ACTIVE_LABEL: Record<ThinkingProps["variant"], string> = {
	reasoning: "思考中",
	search: "检索中",
	coding: "调用工具中",
	steps: "运行中",
};

/* 变体动词（done 态「已X N秒」） */
const DONE_VERB: Record<ThinkingProps["variant"], string> = {
	reasoning: "思考",
	search: "检索",
	coding: "调用工具",
	steps: "运行",
};

const STEP_DOT: Record<NonNullable<ThinkingStep["dot"]>, string> = {
	info: "text-sky-500",
	warn: "text-amber-500",
	error: "text-destructive",
	done: "text-emerald-500",
};

export function Thinking(props: ThinkingProps) {
	const { variant, status, startedAt, defaultOpen = false, title } = props;
	// open 在 render 期间随 status 调整：status streaming→done 自动折叠，
	// 但保留用户在 done 之后的手动展开。
	const [openState, setOpenState] = useState(defaultOpen);
	const [prevStatus, setPrevStatus] = useState(status);
	if (status !== prevStatus) {
		setPrevStatus(status);
		if (status === "done") setOpenState(false);
	}
	const open = openState;
	const setOpen = setOpenState;
	const working = status === "streaming";
	const elapsed = useElapsed(working, startedAt);

	const headerLabel =
		title ??
		(working
			? ACTIVE_LABEL[variant]
			: elapsed.seconds > 0
				? `已${DONE_VERB[variant]} ${elapsed.label}`
				: `已${DONE_VERB[variant]}`);

	return (
		<div className="flex w-full flex-col">
			{/* 触发器头部 */}
			<button
				type="button"
				aria-expanded={open}
				aria-controls={`thinking-body-${variant}`}
				onClick={() => setOpen((v) => !v)}
				className={cn(
					"flex w-fit items-center gap-1.5 rounded-md px-1.5 py-1",
					"transition-colors duration-150 hover:bg-accent",
				)}
			>
				<span
					className={cn(
						"flex shrink-0",
						working ? "text-muted-foreground" : "text-muted-foreground/60",
					)}
				>
					{working ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						<Check className="size-4" />
					)}
				</span>
				<span role="status" className="contents">
					{working ? (
						<span
							className={cn(
								"bg-clip-text whitespace-nowrap text-[13px] font-medium text-transparent",
								"flex items-center gap-1",
							)}
							style={{
								backgroundImage:
									"linear-gradient(90deg, var(--muted-foreground) 35%, var(--foreground) 50%, var(--muted-foreground) 65%)",
								backgroundSize: "200% 100%",
								animation: "shimmer-text 1.4s linear infinite",
							}}
						>
							{headerLabel}
							<span className="font-mono text-[11px] tabular-nums">
								{elapsed.label}
							</span>
						</span>
					) : (
						<span className="whitespace-nowrap text-[13px] font-medium text-muted-foreground">
							{headerLabel}
						</span>
					)}
				</span>
				<ChevronDown
					className={cn(
						"size-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-300",
						open && "rotate-180",
					)}
				/>
			</button>

			{/* 折叠体：grid 1fr/0fr 高度过渡 */}
			<div
				id={`thinking-body-${variant}`}
				className={cn(
					"grid transition-[grid-template-rows] duration-300 ease-out",
					open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
				)}
			>
				<div className="overflow-hidden">
					<div className="relative mt-1 ml-[6px] border-l border-border pl-3">
						<ThinkingBody {...props} />
					</div>
				</div>
			</div>
		</div>
	);
}

function ThinkingBody(props: ThinkingProps) {
	switch (props.variant) {
		case "reasoning":
			return <ReasoningBody text={props.text} status={props.status} />;
		case "search":
			return <SearchBody query={props.query} sources={props.sources} />;
		case "coding":
			return <CodingBody items={props.items} />;
		case "steps":
			return <StepsBody steps={props.steps} />;
	}
}

function ReasoningBody({
	text,
	status,
}: {
	text: string;
	status: ThinkingStatus;
}) {
	return (
		<p
			className={cn(
				"whitespace-pre-wrap break-words text-[13px] leading-relaxed text-muted-foreground",
			)}
		>
			{text}
			{status === "streaming" && (
				<span className="ml-0.5 inline-block animate-pulse">▋</span>
			)}
		</p>
	);
}

function SearchBody({
	query,
	sources,
}: {
	query: string;
	sources: ThinkingSource[];
}) {
	return (
		<div className="flex flex-col gap-1.5 py-1">
			<div className="flex items-center gap-1.5">
				<Search className="size-3.5 shrink-0 text-muted-foreground" />
				<span className="truncate text-[12.5px] text-foreground">{query}</span>
			</div>
			{sources.length === 0 ? (
				<span className="px-1.5 text-[12px] text-muted-foreground/60">
					无检索结果
				</span>
			) : (
				<div className="flex flex-col gap-0.5">
					{sources.map((s, i) => (
						<div
							key={`${s.file}-${s.startLine}-${i}`}
							className="flex items-center gap-1.5 rounded-[6px] px-1.5 py-0.5 transition-colors duration-150 hover:bg-accent"
						>
							<FileText className="size-3.5 shrink-0 text-muted-foreground/60" />
							<span className="min-w-0 truncate font-mono text-[11.5px] text-foreground">
								{s.file}
							</span>
							<span className="shrink-0 font-mono text-[11px] text-muted-foreground/60">
								:{s.startLine}-{s.endLine}
							</span>
							{s.score !== undefined && (
								<span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground/60">
									{s.score.toFixed(2)}
								</span>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function CodingBody({ items }: { items: ThinkingCodingItem[] }) {
	const toolCount = items.length;
	const fileCount = items.reduce((acc, it) => acc + (it.files?.length ?? 0), 0);
	const showSummary = toolCount > 1;

	return (
		<div className="flex flex-col gap-0.5 py-1">
			{showSummary ? (
				<div className="flex items-center gap-1.5 px-1.5 pb-1 text-[11.5px] text-muted-foreground/70">
					<Code className="size-3" />
					<span className="tabular-nums">
						{toolCount} 次工具调用
						{fileCount > 0 ? ` · ${fileCount} 个文件改动` : ""}
					</span>
				</div>
			) : null}
			{items.map((item, i) => (
				<CodingRow key={`${item.title}-${i}`} item={item} />
			))}
		</div>
	);
}

function CodingRow({ item }: { item: ThinkingCodingItem }) {
	const rowRef = useRef<HTMLDivElement>(null);
	const [preview, setPreview] = useState<{
		x: number;
		top?: number;
		bottom?: number;
	} | null>(null);
	const hasDiff = Boolean(item.files && item.files.length > 0);
	const totalDiffLines =
		item.files?.reduce((acc, f) => acc + f.diff.length, 0) ?? 0;

	// 悬停/聚焦行时计算 diff portal 定位（下方放不下则上方）
	const openPreview = () => {
		if (!hasDiff) return;
		const rect = rowRef.current?.getBoundingClientRect();
		if (!rect) return;
		// portal 最大 60vh，定位按 60vh 估算是否放得下
		const previewHeight = Math.min(
			window.innerHeight * 0.6,
			38 + totalDiffLines * 19,
		);
		const fitsBelow =
			rect.bottom + 6 + previewHeight <= window.innerHeight - 12;
		setPreview({
			x: Math.max(12, Math.min(rect.left, window.innerWidth - 320)),
			...(fitsBelow
				? { top: rect.bottom + 6 }
				: { bottom: window.innerHeight - rect.top + 6 }),
		});
	};
	const closePreview = () => setPreview(null);

	return (
		<div
			ref={rowRef}
			className={cn(
				"flex flex-col gap-0.5 rounded-[6px] px-1.5 py-1 transition-colors duration-150",
				hasDiff ? "cursor-pointer" : "",
				"hover:bg-accent",
			)}
			onMouseEnter={openPreview}
			onMouseLeave={closePreview}
			onFocus={hasDiff ? openPreview : undefined}
			onBlur={closePreview}
			tabIndex={hasDiff ? 0 : undefined}
			role={hasDiff ? "button" : undefined}
			aria-label={hasDiff ? `查看 ${item.title} 的 diff` : undefined}
		>
			<div className="flex items-center gap-1.5">
				{item.status === "in_progress" ? (
					<Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />
				) : item.status === "completed" ? (
					<Check className="size-3.5 shrink-0 text-emerald-500" />
				) : (
					<CircleX className="size-3.5 shrink-0 text-destructive" />
				)}
				<Code className="size-3.5 shrink-0 text-muted-foreground/60" />
				<span className="min-w-0 truncate text-[12.5px] font-medium text-foreground">
					{item.title}
				</span>
				{item.kind && (
					<span className="shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">
						{item.kind}
					</span>
				)}
				{item.additions !== undefined && item.deletions !== undefined && (
					<span className="ml-auto flex shrink-0 items-center gap-1 font-mono text-[11px] tabular-nums">
						<span className="text-emerald-600 dark:text-emerald-400">
							+{item.additions}
						</span>
						<span className="text-rose-600 dark:text-rose-400">
							-{item.deletions}
						</span>
					</span>
				)}
				{hasDiff && (
					<ChevronDown
						className={cn(
							"size-3 shrink-0 text-muted-foreground/50 transition-transform duration-150",
							preview && "rotate-180",
						)}
					/>
				)}
			</div>
			{item.rawInput && (
				<pre className="mt-0.5 overflow-x-auto rounded bg-muted/50 p-1.5 text-[11px] text-muted-foreground">
					{item.rawInput}
				</pre>
			)}

			{/* diff portal：hover 工具行时弹出文件 diff 详情 */}
			{preview && hasDiff && typeof document !== "undefined"
				? createPortal(
						<div
							className="fixed z-50 w-80 overflow-hidden rounded-lg border border-border bg-popover shadow-md"
							style={{
								left: preview.x,
								top: preview.top,
								bottom: preview.bottom,
								animation: "fade-in 160ms ease-out both",
								transformOrigin:
									preview.top === undefined ? "bottom left" : "top left",
							}}
						>
							<div className="flex items-center justify-between border-b border-border px-2.5 py-1.5 font-mono text-[11px]">
								<span className="min-w-0 truncate text-muted-foreground">
									{item.title}
								</span>
								{item.additions !== undefined &&
									item.deletions !== undefined && (
										<span className="shrink-0 tabular-nums">
											<span className="text-emerald-600 dark:text-emerald-400">
												+{item.additions}
											</span>{" "}
											<span className="text-rose-600 dark:text-rose-400">
												-{item.deletions}
											</span>
										</span>
									)}
							</div>
							<div className="max-h-[60vh] overflow-y-auto py-1 font-mono text-[11px] leading-[1.8]">
								{(item.files ?? []).map((file, fi) => (
									<div key={`${file.path}-${fi}`}>
										{item.files!.length > 1 && (
											<div className="sticky top-0 flex items-center gap-1.5 border-b border-border/50 bg-popover px-2.5 py-1 text-[10.5px] text-muted-foreground">
												<FileText className="size-3 shrink-0" />
												<span className="min-w-0 truncate">{file.path}</span>
												<span className="ml-auto shrink-0 tabular-nums">
													<span className="text-emerald-600 dark:text-emerald-400">
														+{file.additions}
													</span>{" "}
													<span className="text-rose-600 dark:text-rose-400">
														-{file.deletions}
													</span>
												</span>
											</div>
										)}
										{file.diff.map((line, index) => (
											<div
												key={index}
												className={cn(
													"flex gap-2 whitespace-pre px-2.5",
													line.tone === "add"
														? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
														: line.tone === "del"
															? "bg-rose-500/10 text-rose-700 dark:text-rose-300"
															: "text-muted-foreground",
												)}
											>
												<span className="w-3 shrink-0 select-none">
													{line.tone === "add"
														? "+"
														: line.tone === "del"
															? "-"
															: " "}
												</span>
												<span className="min-w-0 truncate">{line.text}</span>
											</div>
										))}
									</div>
								))}
							</div>
						</div>,
						document.body,
					)
				: null}
		</div>
	);
}

function StepsBody({ steps }: { steps: ThinkingStep[] }) {
	return (
		<div className="flex flex-col gap-0.5 py-1">
			{steps.map((step, i) => (
				<div
					key={`${step.label}-${i}`}
					className="flex items-center gap-1.5 rounded-[6px] px-1.5 py-0.5 transition-colors duration-150 hover:bg-accent"
				>
					<Circle
						className={cn(
							"size-3 shrink-0",
							step.dot ? STEP_DOT[step.dot] : "text-muted-foreground",
						)}
					/>
					<span className="min-w-0 flex-1 truncate text-[12.5px] text-foreground">
						{step.label}
					</span>
					{step.time && (
						<span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground/60">
							{step.time}
						</span>
					)}
				</div>
			))}
		</div>
	);
}
