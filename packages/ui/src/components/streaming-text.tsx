// @origin Apache-2.0 / fde-workspace (components/ui/streaming-text.tsx)
import { useState } from "react";
import { ArrowRight, ChevronDown, Globe, Sparkles } from "lucide-react";

import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { PixelGridLoader } from "./pixel-grid-loader";

/** 流式阶段 */
export type StreamingPhase = "idle" | "streaming" | "aborted" | "done";

/** inline 引用（渲染为可点击 chip） */
export interface StreamingCitation {
	label: string;
	href: string;
}

/** 折叠来源列表条目 */
export interface StreamingSource {
	name: string;
	domain: string;
	href: string;
}

export interface StreamingTextProps {
	/** 累积的流式文本（上层 onDelta 累积；思考态时为空） */
	text: string;
	/** 流式阶段 */
	phase: StreamingPhase;
	/** 顶部模型徽标（流式期间显示实际模型，完成后显示持久化模型） */
	model?: string | null;
	/** 错误态文案（phase 仍由调用方控制；非空时红色展示） */
	error?: string | null;
	/** text 为空且 streaming 时显示的思考态，默认 <PixelGridLoader/> */
	thinking?: React.ReactNode;
	/** inline 引用 chip，穿插在文本后 */
	citations?: StreamingCitation[];
	/** 折叠的来源列表（完成后展开） */
	sources?: StreamingSource[];
	/** 完成后的追问建议 */
	followUps?: string[];
	/** 选中追问时回调 */
	onFollowUp?: (text: string, index: number) => void;
	/** 来源列表初始展开 */
	defaultSourcesOpen?: boolean;
	className?: string;
}

const FADE_UP = "fade-up 400ms cubic-bezier(0.23,1,0.32,1) both";

function CitationChip({ citation }: { citation: StreamingCitation }) {
	return (
		<a
			href={citation.href}
			target="_blank"
			rel="noreferrer"
			className="mx-0.5 inline-flex h-[18px] translate-y-[-1px] items-center gap-1 rounded-md bg-muted px-1 align-middle font-mono text-[10.5px] text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
		>
			<Globe className="size-3" />
			<span>{citation.label}</span>
		</a>
	);
}

export function StreamingText({
	text,
	phase,
	model,
	error,
	thinking,
	citations,
	sources,
	followUps,
	onFollowUp,
	defaultSourcesOpen = false,
	className,
}: StreamingTextProps) {
	const [sourcesOpen, setSourcesOpen] = useState(defaultSourcesOpen);
	const isError = Boolean(error);
	const isAborted = phase === "aborted";
	const isStreaming = phase === "streaming";
	const isDone = phase === "done";
	const showThinking = isStreaming && !text;

	// 空闲态不渲染
	if (phase === "idle" && !text) return null;

	const showActions = isDone || isAborted;

	return (
		<div
			className={cn("flex w-full flex-col gap-1.5", className)}
			style={{ animation: FADE_UP }}
		>
			{/* 顶部：角色 + 模型徽标 */}
			<div className="flex items-center gap-1 text-[12px] leading-[1.3]">
				<span className="text-foreground">
					{isError ? "出错了" : isAborted ? "助手 · 已停止" : "助手"}
				</span>
				{model ? (
					<span className="text-muted-foreground">· {model}</span>
				) : null}
			</div>

			{/* 思考态 */}
			{showThinking ? (
				(thinking ?? <PixelGridLoader />)
			) : (
				<p
					className={cn(
						"whitespace-pre-wrap text-[13px] leading-normal",
						isError ? "text-destructive" : "text-foreground",
					)}
				>
					{text}
					{isStreaming ? (
						<span className="ml-0.5 inline-block animate-pulse">▋</span>
					) : null}
					{citations?.map((c) => (
						<CitationChip key={c.href} citation={c} />
					))}
				</p>
			)}

			{/* 错误明细 */}
			{error ? (
				<span className="text-[11px] text-muted-foreground">{error}</span>
			) : null}

			{/* 操作行 + 来源折叠（完成后淡入） */}
			{showActions ? (
				<div
					className="mt-1 flex flex-col gap-2 transition-opacity duration-300"
					style={{ opacity: 1, animation: "fade-in 300ms ease-out both" }}
				>
					{/* 来源折叠 */}
					{sources && sources.length > 0 ? (
						<div>
							<button
								type="button"
								aria-expanded={sourcesOpen}
								onClick={() => setSourcesOpen((v) => !v)}
								className="flex w-fit items-center gap-1.5 rounded-md px-1.5 py-1 text-[12px] text-muted-foreground transition-colors duration-150 hover:bg-accent"
							>
								<ChevronDown
									className="size-3 transition-transform duration-200"
									style={{
										transform: sourcesOpen ? "rotate(0deg)" : "rotate(-90deg)",
									}}
								/>
								<span className="tabular-nums">{sources.length} 个来源</span>
							</button>
							<div
								className="grid transition-[grid-template-rows,opacity] duration-300"
								style={{
									gridTemplateRows: sourcesOpen ? "1fr" : "0fr",
									opacity: sourcesOpen ? 1 : 0,
									transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
								}}
							>
								<div className="overflow-hidden">
									<div className="mt-1 flex flex-col gap-0.5 rounded-lg bg-muted/60 p-1">
										{sources.map((s) => (
											<a
												key={s.domain}
												href={s.href}
												target="_blank"
												rel="noreferrer"
												className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
											>
												<span className="underline decoration-transparent underline-offset-2 hover:decoration-current">
													{s.name}
												</span>
												<span className="ml-auto font-mono text-[10.5px] text-muted-foreground/80">
													{s.domain}
												</span>
											</a>
										))}
									</div>
								</div>
							</div>
						</div>
					) : null}

					{/* 追问建议 */}
					{followUps && followUps.length > 0 ? (
						<div>
							<p className="text-[12px] font-medium text-muted-foreground">
								接下来可以问
							</p>
							<div className="mt-0.5 flex flex-col">
								{followUps.map((q, i) => (
									<button
										key={q}
										type="button"
										onClick={() => onFollowUp?.(q, i)}
										className="-mx-1.5 flex items-center gap-2 rounded-md border-b border-border px-1.5 py-1.5 text-left text-[12.5px] text-foreground transition-colors duration-100 hover:bg-accent"
										style={{
											animation: `fade-in 300ms ease-out ${i * 90}ms both`,
										}}
									>
										<ArrowRight className="size-3 shrink-0 text-muted-foreground/70" />
										{q}
									</button>
								))}
							</div>
						</div>
					) : null}
				</div>
			) : null}

			{/* 模型徽标（流式期间额外标注） */}
			{isStreaming && model ? (
				<Badge variant="outline" className="w-fit gap-1 font-mono text-[11px]">
					<Sparkles className="size-3 text-muted-foreground" />
					{model}
				</Badge>
			) : null}
		</div>
	);
}

export default StreamingText;
