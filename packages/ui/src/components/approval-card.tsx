// @origin Apache-2.0 / fde-workspace (components/ui/approval-card.tsx)
import {
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type CSSProperties,
} from "react";
import { Check, X } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./button";

export interface ApprovalQuestion {
	q: string;
	type: "radio" | "check";
	options: string[];
}

export interface ApprovalLabels {
	skip: string;
	continue: string;
	send: string;
	customPlaceholder: string;
	sentMessage: string;
}

const DEFAULT_LABELS: ApprovalLabels = {
	skip: "跳过",
	continue: "继续",
	send: "提交",
	customPlaceholder: "其他…",
	sentMessage: "已提交",
};

const ROLL_MS = 400;
const SLIDE = "360ms cubic-bezier(0.22, 1, 0.36, 1)";

/** 里程表数字：每个变化的字符向上（或向下）翻滚 */
function RollingDigits({ value }: { value: string }) {
	const prevRef = useRef(value);
	const [oldVal, setOldVal] = useState(value);
	const [newVal, setNewVal] = useState(value);
	const [rolling, setRolling] = useState(false);
	const [shifted, setShifted] = useState(false);
	const [dir, setDir] = useState<"up" | "down">("up");

	useEffect(() => {
		if (prevRef.current === value) return;
		const from = prevRef.current;
		prevRef.current = value;
		const fromN = parseInt(from, 10);
		const toN = parseInt(value, 10);
		setDir(
			Number.isFinite(fromN) && Number.isFinite(toN) && toN < fromN
				? "down"
				: "up",
		);
		setOldVal(from);
		setNewVal(value);
		setRolling(true);
		setShifted(false);

		let raf2 = 0;
		const raf1 = requestAnimationFrame(() => {
			raf2 = requestAnimationFrame(() => setShifted(true));
		});
		const done = setTimeout(() => {
			setRolling(false);
			setOldVal(value);
			setShifted(false);
		}, ROLL_MS);

		return () => {
			cancelAnimationFrame(raf1);
			cancelAnimationFrame(raf2);
			clearTimeout(done);
		};
	}, [value]);

	const chars = rolling ? newVal : oldVal;

	return (
		<>
			{Array.from({ length: chars.length }, (_, i) => {
				const o = oldVal[i] ?? "";
				const n = chars[i] ?? "";
				if (!rolling || o === n) {
					return <span key={`${i}-${n}`}>{n}</span>;
				}
				const top = dir === "down" ? n : o;
				const bottom = dir === "down" ? o : n;
				const restY = dir === "down" ? "0" : "-1em";
				const startY = dir === "down" ? "-1em" : "0";
				return (
					<span
						key={`${i}-${o}-${n}-${dir}`}
						style={{
							display: "inline-block",
							position: "relative",
							overflow: "hidden",
							height: "1em",
							lineHeight: "1em",
							verticalAlign: "-0.05em",
						}}
					>
						<span
							style={{
								display: "flex",
								flexDirection: "column",
								transition: "transform 350ms cubic-bezier(0.4, 0, 0.2, 1)",
								transform: `translateY(${shifted ? restY : startY})`,
							}}
						>
							<span style={{ height: "1em", lineHeight: "1em" }}>{top}</span>
							<span style={{ height: "1em", lineHeight: "1em" }}>{bottom}</span>
						</span>
					</span>
				);
			})}
		</>
	);
}

function Chevron({ path }: { path: React.ReactNode }) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			{path}
		</svg>
	);
}

export interface ApprovalCardProps {
	questions: ApprovalQuestion[];
	/** 可选标题（如工具名） */
	title?: string;
	/** 提交中：按钮 isLoading + 禁用交互 */
	pending?: boolean;
	/** 错误文案（非空时底部红色展示） */
	error?: string | null;
	/** 已提交态：受控，调用方提交成功后置 true 显示「已提交」 */
	sent?: boolean;
	labels?: Partial<ApprovalLabels>;
	/** 提交：返回每题选中索引数组 + 每题自定义文本 */
	onSubmit?: (
		answers: Record<number, number[]>,
		customs: Record<number, string>,
	) => void;
	/** 跳过当前题 */
	onSkip?: () => void;
	/** 收起（折叠为「打开审批」按钮） */
	onDismiss?: () => void;
	/** 已提交态下「重新开始」回调（不传则不显示该按钮） */
	onReset?: () => void;
	className?: string;
}

export function ApprovalCard({
	questions,
	title,
	pending = false,
	error = null,
	sent = false,
	labels,
	onSubmit,
	onSkip,
	onDismiss,
	onReset,
	className,
}: ApprovalCardProps) {
	const t = { ...DEFAULT_LABELS, ...labels };
	const [qi, setQi] = useState(0);
	const [answers, setAnswers] = useState<Record<number, number[]>>({});
	const [custom, setCustom] = useState<Record<number, string>>({});
	const [open, setOpen] = useState(true);

	const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
	const measured = useRef(false);
	const [viewportH, setViewportH] = useState<number | undefined>(undefined);
	const [trackY, setTrackY] = useState(0);
	const [animate, setAnimate] = useState(false);
	// 首次测量前只渲染当前题，避免初始高度闪到全高再缩
	const [ready, setReady] = useState(false);

	const last = qi === questions.length - 1;
	const selected = answers[qi] ?? [];
	const hasAnswer = selected.length > 0 || Boolean(custom[qi]?.trim());

	const sync = (withAnim: boolean) => {
		const item = questionRefs.current[qi];
		if (!item) return;
		const reduce =
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		setViewportH(item.offsetHeight);
		setTrackY(item.offsetTop);
		setAnimate(withAnim && !reduce);
	};

	useLayoutEffect(() => {
		const withAnim = measured.current;
		measured.current = true;
		sync(withAnim);
		setReady(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [qi, answers, custom, open, sent]);

	useEffect(() => {
		const id = requestAnimationFrame(() => sync(measured.current));
		return () => cancelAnimationFrame(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [qi]);

	useEffect(
		() => () => {
			if (advanceTimer.current) clearTimeout(advanceTimer.current);
		},
		[],
	);

	const goTo = (next: number) => {
		if (advanceTimer.current) clearTimeout(advanceTimer.current);
		setQi(Math.min(Math.max(next, 0), questions.length - 1));
	};

	const send = () => {
		if (advanceTimer.current) clearTimeout(advanceTimer.current);
		onSubmit?.(answers, custom);
	};

	const advance = () => {
		if (last) send();
		else goTo(qi + 1);
	};

	const toggle = (index: number) => {
		const type = questions[qi].type;
		setAnswers((current) => {
			const picked = current[qi] ?? [];
			const next =
				type === "radio"
					? [index]
					: picked.includes(index)
						? picked.filter((item) => item !== index)
						: [...picked, index];
			return { ...current, [qi]: next };
		});
		if (type === "radio") {
			setCustom((current) => ({ ...current, [qi]: "" }));
			if (advanceTimer.current) clearTimeout(advanceTimer.current);
			advanceTimer.current = setTimeout(() => {
				if (last) send();
				else setQi((current) => Math.min(questions.length - 1, current + 1));
			}, 480);
		}
	};

	if (!open) {
		return (
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="rounded-md bg-card px-3 py-2 text-[12.5px] font-medium text-foreground shadow-xs transition-colors duration-150 hover:bg-accent"
			>
				打开审批
			</button>
		);
	}

	if (sent) {
		return (
			<div
				className={cn("flex w-full max-w-sm items-center gap-3", className)}
				style={{ animation: "fade-in 260ms ease-out both" }}
			>
				<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 py-1 pr-2.5 pl-1 text-[12.5px] font-medium text-emerald-600 dark:text-emerald-400">
					<span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white">
						<Check className="size-2.5" strokeWidth={3} />
					</span>
					{t.sentMessage}
				</span>
				{onReset ? (
					<button
						type="button"
						onClick={onReset}
						className="text-[12px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
					>
						重新开始
					</button>
				) : null}
			</div>
		);
	}

	return (
		<div className={cn("w-full max-w-sm", className)}>
			<div
				className="relative overflow-hidden rounded-xl bg-card shadow-sm"
				style={{ animation: "fade-up 380ms cubic-bezier(0.23,1,0.32,1) both" }}
			>
				{onDismiss ? (
					<button
						type="button"
						aria-label="收起"
						onClick={onDismiss}
						className="absolute right-2.5 top-2.5 z-10 flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-100 hover:bg-accent hover:text-foreground"
					>
						<X className="size-3.5" />
					</button>
				) : null}

				{title ? (
					<div className="px-4 pt-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
						{title}
					</div>
				) : null}

				<div className="px-4 pb-2 pt-2">
					{/* 问题本身就是标题 */}
					<div
						className="overflow-hidden"
						style={{
							height: viewportH,
							transition: animate ? `height ${SLIDE}` : undefined,
						}}
						aria-live="polite"
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: 26,
								transform: `translate3d(0, ${-trackY}px, 0)`,
								transition: animate ? `transform ${SLIDE}` : undefined,
								willChange: "transform",
							}}
						>
							{questions.map((question, qIdx) => {
								const active = qIdx === qi;
								if (!ready && !active) return null;
								const picked = answers[qIdx] ?? [];
								const questionStyle: CSSProperties = {
									opacity: active ? 1 : 0,
									transition: animate ? `opacity ${SLIDE}` : undefined,
									pointerEvents: active ? undefined : "none",
								};
								return (
									<div
										key={qIdx}
										ref={(el) => {
											questionRefs.current[qIdx] = el;
										}}
										aria-hidden={active ? undefined : true}
										style={questionStyle}
									>
										<div className="pr-7 text-[14px] font-medium text-foreground">
											{question.q}
										</div>
										<div className="mt-2.5 flex flex-col gap-1">
											{question.options.map((option, i) => {
												const on = picked.includes(i);
												return (
													<button
														key={option}
														type="button"
														aria-pressed={on}
														tabIndex={active ? 0 : -1}
														disabled={pending}
														onClick={() => {
															if (active && !pending) toggle(i);
														}}
														className={cn(
															"relative z-10 flex items-center gap-1.5 rounded-md px-1 py-1 text-left transition-colors duration-100",
															active && "hover:bg-accent",
														)}
													>
														<span
															className={cn(
																"flex size-4 shrink-0 items-center justify-center transition-colors duration-200",
																question.type === "radio"
																	? "rounded-full"
																	: "rounded-[5px]",
																on
																	? "bg-primary text-primary-foreground"
																	: "shadow-[inset_0_0_0_1.5px_var(--input)] text-transparent",
															)}
														>
															{question.type === "radio" ? (
																<span
																	className="size-1.5 rounded-full bg-primary-foreground transition-transform duration-200"
																	style={{
																		transform: on ? "scale(1)" : "scale(0)",
																	}}
																/>
															) : (
																<Check className="size-3" strokeWidth={3} />
															)}
														</span>
														<span
															className={cn(
																"text-[13px] leading-none transition-colors duration-200",
																on
																	? "text-foreground"
																	: "text-muted-foreground",
															)}
														>
															{option}
														</span>
													</button>
												);
											})}
											<label className="relative z-10 flex items-center gap-1.5 rounded-md px-1 py-1">
												<input
													value={custom[qIdx] ?? ""}
													tabIndex={active ? 0 : -1}
													disabled={pending}
													onChange={(event) => {
														if (!active) return;
														setCustom((current) => ({
															...current,
															[qIdx]: event.target.value,
														}));
														if (question.type === "radio")
															setAnswers((current) => ({
																...current,
																[qIdx]: [],
															}));
													}}
													onKeyDown={(event) => {
														if (
															event.key === "Enter" &&
															hasAnswer &&
															!pending
														) {
															event.preventDefault();
															advance();
														}
													}}
													placeholder={t.customPlaceholder}
													aria-label="自定义答案"
													className="min-w-0 flex-1 bg-transparent pl-1.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/60"
												/>
											</label>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{error ? (
					<div className="px-4 pb-2 text-[11.5px] text-destructive">
						{error}
					</div>
				) : null}

				{/* 底部：步骤导航（里程表计数器）+ 胶囊操作 */}
				<div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5">
					<div className="flex items-center gap-1 text-muted-foreground">
						<button
							type="button"
							aria-label="上一题"
							disabled={qi <= 0 || pending}
							onClick={() => goTo(qi - 1)}
							className="flex size-[18px] items-center justify-center rounded-[5px] transition-colors duration-100 enabled:hover:text-foreground disabled:opacity-30"
						>
							<Chevron path={<path d="M18 15l-6-6-6 6" />} />
						</button>
						<span
							className="inline-flex items-center text-[12px] font-medium tabular-nums text-muted-foreground"
							style={{ letterSpacing: "-0.1px", lineHeight: 1 }}
						>
							<RollingDigits value={`${qi + 1} / ${questions.length}`} />
						</span>
						<button
							type="button"
							aria-label="下一题"
							disabled={last || pending}
							onClick={() => goTo(qi + 1)}
							className="flex size-[18px] items-center justify-center rounded-[5px] transition-colors duration-100 enabled:hover:text-foreground disabled:opacity-30"
						>
							<Chevron path={<path d="M6 9l6 6 6-6" />} />
						</button>
					</div>

					<div className="-mr-0.5 flex items-center gap-1.5">
						<Button
							variant="ghost"
							size="sm"
							disabled={pending}
							onClick={() =>
								last
									? onDismiss
										? onDismiss()
										: goTo(qi + 1)
									: (onSkip ?? goTo(qi + 1))
							}
						>
							{t.skip}
						</Button>
						<Button
							variant="default"
							size="sm"
							disabled={!hasAnswer || pending}
							isLoading={pending}
							onClick={advance}
						>
							{last ? t.send : t.continue}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ApprovalCard;
