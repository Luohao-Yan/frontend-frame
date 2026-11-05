import { animate, type AnimationPlaybackControlsWithThen } from "motion";

/* ============================================================
   动效唯一入口（移植自 scaffold-master/scaffold-vue/src/composables/motion.ts，
   后端由 motion v12 的 animate() 驱动，不依赖 GSAP）。
   每条动效都要能说出能量语态：
   蓄 Charge（输入）/ 放 Discharge（开始工作）/ 导 Conduct（进行中）/
   结 Crystallize（交付落定）/ 停摆 Halt（停止、恢复默认）。
   说不出语态的就是装饰，不做。
   ============================================================ */

export const EASE = Object.freeze({
	/** 显现（expo.out） */
	reveal: [0.16, 1, 0.3, 1],
	/** 位移滑行（power4.out） */
	glide: [0.22, 1, 0.36, 1],
	/** 退场（power2.in） */
	exit: [0.4, 0, 1, 1],
	/** 双向交接（power2.inOut） */
	swap: [0.65, 0, 0.35, 1],
	/** 落定确认（back.out(1.6)，带过冲） */
	settle: [0.34, 1.56, 0.64, 1],
} as const);

export const DUR = Object.freeze({
	press: 0.14,
	release: 0.46,
	hoverIn: 0.34,
	hoverOut: 0.42,
	slide: 0.52,
	pageOut: 0.18,
	pageIn: 0.62,
	overlayIn: 0.42,
	overlayOut: 0.2,
} as const);

const reducedQuery =
	typeof window !== "undefined"
		? window.matchMedia("(prefers-reduced-motion: reduce)")
		: null;

export function prefersReducedMotion() {
	return Boolean(reducedQuery?.matches);
}

/** 页面在后台时 rAF 被节流，动画会停在中途：此时直接给终态 */
export function motionSkipped() {
	return (
		prefersReducedMotion() ||
		(typeof document !== "undefined" && document.hidden)
	);
}

/* ── 后台兜底：切到后台时把正在进行的动画走完，回到前台不会看到半路状态 ── */
const activeAnimations = new Set<AnimationPlaybackControlsWithThen>();

function track(controls: AnimationPlaybackControlsWithThen) {
	activeAnimations.add(controls);
	void controls.finished
		.then(() => activeAnimations.delete(controls))
		.catch(() => activeAnimations.delete(controls));
	return controls;
}

if (typeof document !== "undefined") {
	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) return;
		activeAnimations.forEach((controls) => controls.complete());
		activeAnimations.clear();
	});
}

/** 等两帧合成后再起播：避开 backdrop-filter 首次栅格化那一帧 */
export function afterTwoFrames(fn: () => void) {
	requestAnimationFrame(() => requestAnimationFrame(fn));
}

/* ── 按压反馈：事件委托，新控件命中选择器即获得同一手感（放 Discharge） ── */
const PRESSABLE = '[data-slot="button"], .lift';
let pressInstalled = false;

export function installPressFeedback() {
	if (pressInstalled || typeof window === "undefined") return;
	pressInstalled = true;
	const pressed = new Set<Element>();

	const release = () => {
		pressed.forEach((el) =>
			track(
				animate(el, { scale: 1 }, { duration: DUR.release, ease: EASE.settle }),
			),
		);
		pressed.clear();
	};

	document.addEventListener(
		"pointerdown",
		(event) => {
			if (motionSkipped() || event.button !== 0) return;
			const el = (event.target as Element | null)?.closest<HTMLElement>(
				PRESSABLE,
			);
			if (!el || (el as HTMLButtonElement).disabled) return;
			pressed.add(el);
			track(
				animate(
					el,
					{ scale: 0.955 },
					{ duration: DUR.press, ease: EASE.glide },
				),
			);
		},
		{ passive: true },
	);
	window.addEventListener("pointerup", release, { passive: true });
	window.addEventListener("pointercancel", release, { passive: true });
}

/* ── 悬停抬起：只给可点的卡片（hover 写 y，press 写 scale，两条通道互不覆盖） ── */
let hoverInstalled = false;

export function installHoverLift() {
	if (hoverInstalled || typeof window === "undefined") return;
	if (!window.matchMedia("(hover: hover)").matches) return;
	hoverInstalled = true;
	const SELECTOR = ".lift";
	document.addEventListener(
		"pointerover",
		(event) => {
			if (motionSkipped()) return;
			const el = (event.target as Element | null)?.closest(SELECTOR);
			if (!el || el.contains(event.relatedTarget as Node | null)) return;
			track(
				animate(el, { y: -3 }, { duration: DUR.hoverIn, ease: EASE.glide }),
			);
		},
		{ passive: true },
	);
	document.addEventListener(
		"pointerout",
		(event) => {
			const el = (event.target as Element | null)?.closest(SELECTOR);
			if (!el || el.contains(event.relatedTarget as Node | null)) return;
			track(
				animate(el, { y: 0 }, { duration: DUR.hoverOut, ease: EASE.settle }),
			);
		},
		{ passive: true },
	);
}

/* ── 容器级指针光：坐标写在容器自身（叶子），不写在上层 ── */
export function trackGlow(event: PointerEvent) {
	const el = event.currentTarget as HTMLElement;
	const rect = el.getBoundingClientRect();
	el.style.setProperty("--px", `${event.clientX - rect.left}px`);
	el.style.setProperty("--py", `${event.clientY - rect.top}px`);
}

/** 动画结束后的收尾：清掉内联终值，避免影响后续 CSS 过渡 */
function clearInline(...els: Element[]) {
	els.forEach((el) => {
		const style = (el as HTMLElement).style;
		style.opacity = "";
		style.transform = "";
		style.transformOrigin = "";
	});
}

/* ── 页面切换：离场退纵深，进场推进，子元素按阅读序显现 ── */
export function pageLeave(el: Element, done: () => void) {
	if (motionSkipped()) {
		window.setTimeout(done, 0);
		return;
	}
	track(
		animate(
			el,
			{ opacity: 0, scale: 0.988 },
			{ duration: DUR.pageOut, ease: EASE.exit, onComplete: done },
		),
	);
}

export function pageEnter(el: Element, done: () => void) {
	const page = el as HTMLElement;
	if (motionSkipped()) {
		page.classList.add("is-entrance-ready");
		done();
		return;
	}
	const items = Array.from(page.querySelectorAll(".reveal"));
	const cards = Array.from(page.querySelectorAll(".bento"));
	// 隐藏态直接写入，之后只做「推进」，不用 fromTo 语义
	animate(page, { opacity: 1, scale: 0.994 }, { duration: 0 });
	items.forEach((item) =>
		animate(item, { opacity: 0, y: 12 }, { duration: 0 }),
	);
	cards.forEach((card) =>
		animate(card, { opacity: 0, y: 18 }, { duration: 0 }),
	);
	page.classList.add("is-entrance-ready");
	track(
		animate(
			page,
			{ scale: 1 },
			{
				duration: DUR.pageIn,
				ease: EASE.glide,
				onComplete: () => {
					clearInline(page);
					done();
				},
			},
		),
	);
	// 阅读序元素按序显现
	items.forEach((item, index) => {
		track(
			animate(
				item,
				{ opacity: [0, 1], y: [12, 0] },
				{
					duration: DUR.pageIn,
					ease: EASE.reveal,
					delay: 0.04 + index * 0.05,
					onComplete: () => clearInline(item),
				},
			),
		);
	});
	// 并列卡片从中间向两侧展开
	const center = (cards.length - 1) / 2;
	[...cards]
		.map((card, index) => ({ card, distance: Math.abs(index - center) }))
		.sort((a, b) => a.distance - b.distance)
		.forEach(({ card }, index) => {
			track(
				animate(
					card,
					{ opacity: [0, 1], y: [18, 0] },
					{
						duration: 0.72,
						ease: EASE.reveal,
						delay: 0.1 + index * 0.045,
						onComplete: () => clearInline(card),
					},
				),
			);
		});
}

/* ── 主按钮涟漪：从真正被点到的位置化开（放 Discharge），键盘触发落回中心 ── */
/** 涟漪只给主操作 / 危险按钮（class-variance-authority 生成的类） */
function isPrimaryOrDanger(el: HTMLElement) {
	return (
		el.classList.contains("bg-primary") ||
		el.classList.contains("bg-destructive")
	);
}
let rippleInstalled = false;

export function installRipple() {
	if (rippleInstalled || typeof window === "undefined") return;
	rippleInstalled = true;
	const fire = (button: HTMLElement, x?: number, y?: number) => {
		if (motionSkipped()) return;
		const rect = button.getBoundingClientRect();
		const px = x === undefined ? rect.width / 2 : x - rect.left;
		const py = y === undefined ? rect.height / 2 : y - rect.top;
		const radius = Math.max(
			Math.hypot(px, py),
			Math.hypot(rect.width - px, py),
			Math.hypot(px, rect.height - py),
			Math.hypot(rect.width - px, rect.height - py),
		);
		// 涟漪夹层是绝对定位，需要按钮自身成为定位上下文
		if (getComputedStyle(button).position === "static") {
			button.style.position = "relative";
		}
		let clip = button.querySelector<HTMLElement>(":scope > .ripple-clip");
		if (!clip) {
			clip = document.createElement("span");
			clip.className = "ripple-clip";
			clip.setAttribute("aria-hidden", "true");
			button.appendChild(clip);
		}
		const dot = document.createElement("span");
		dot.className = "ripple-dot";
		clip.appendChild(dot);
		animate(
			dot,
			{ left: px, top: py, x: "-50%", y: "-50%", width: 20, height: 20 },
			{ duration: 0 },
		);
		track(
			animate(
				dot,
				{ scale: (radius * 2.2) / 20 },
				{ duration: 0.62, ease: EASE.reveal },
			),
		);
		track(
			animate(
				dot,
				{ opacity: 0 },
				{
					duration: 0.42,
					ease: [0.55, 0.06, 0.68, 0.19],
					delay: 0.2,
					onComplete: () => dot.remove(),
				},
			),
		);
	};

	document.addEventListener(
		"pointerdown",
		(event) => {
			if (event.button !== 0) return;
			const button = (event.target as Element | null)?.closest<HTMLElement>(
				'[data-slot="button"]',
			);
			if (
				button &&
				!(button as HTMLButtonElement).disabled &&
				isPrimaryOrDanger(button)
			) {
				fire(button, event.clientX, event.clientY);
			}
		},
		{ passive: true },
	);
	document.addEventListener("keydown", (event) => {
		if (event.key !== "Enter" && event.key !== " ") return;
		const button = (event.target as Element | null)?.closest<HTMLElement>(
			'[data-slot="button"]',
		);
		if (
			button &&
			!(button as HTMLButtonElement).disabled &&
			isPrimaryOrDanger(button)
		)
			fire(button);
	});
}

/* ── 群组进场：面板内容 / 列表行按阅读序（结 Crystallize） ── */
export function revealCascade(
	container: Element | null,
	selector = ":scope > *",
	gap = 0.075,
) {
	if (!container || motionSkipped()) return;
	const items = Array.from(container.querySelectorAll(selector)).slice(0, 18);
	if (!items.length) return;
	items.forEach((item, index) => {
		track(
			animate(
				item,
				{ opacity: [0, 1], y: [10, 0] },
				{
					duration: 0.56,
					ease: EASE.reveal,
					delay: index * gap,
					onComplete: () => clearInline(item),
				},
			),
		);
	});
}

export function revealRows(rows: ArrayLike<Element>) {
	if (motionSkipped() || !rows.length) return;
	const list = Array.from(rows).slice(0, 14);
	list.forEach((row, index) => {
		track(
			animate(
				row,
				{ opacity: [0, 1], y: [6, 0] },
				{
					duration: 0.5,
					ease: EASE.reveal,
					delay: index * 0.025,
					onComplete: () => clearInline(row),
				},
			),
		);
	});
}

/** 状态确认：一次 back.out 的 scale 弹入，不用 opacity 脉冲 */
export function settlePop(el: Element | null) {
	if (!el || motionSkipped()) return;
	track(
		animate(
			el,
			{ scale: [0.6, 1] },
			{ duration: 0.42, ease: EASE.settle, onComplete: () => clearInline(el) },
		),
	);
}

/** 折线描绘：数据沿路径推进（导 Conduct） */
export function drawPath(
	path: SVGPathElement | null,
	area?: SVGPathElement | null,
) {
	if (!path || motionSkipped()) return;
	const length = path.getTotalLength();
	track(
		animate(
			path,
			{ strokeDasharray: `${length} ${length}`, strokeDashoffset: [length, 0] },
			{
				duration: 1.1,
				ease: EASE.swap,
				onComplete: () => {
					path.style.strokeDasharray = "";
					path.style.strokeDashoffset = "";
				},
			},
		),
	);
	if (area) {
		track(
			animate(
				area,
				{ opacity: [0, 1] },
				{
					duration: 0.8,
					delay: 0.5,
					ease: [0.55, 0.06, 0.68, 0.19],
					onComplete: () => clearInline(area),
				},
			),
		);
	}
}

/* ── 常驻动画的物理底座 ─────────────────────────────────────────── */

/** 弹簧状态：x 当前值，v 速度 */
export interface SpringState {
	x: number;
	v: number;
}

export const springOf = (x: number): SpringState => ({ x, v: 0 });

/** 临界阻尼弹簧：每帧把 state 推向 target，返回新值。k 越大越硬（62 ≈ 0.5s 落定） */
export function spring(state: SpringState, target: number, dt: number, k = 62) {
	const c = 2 * Math.sqrt(k);
	state.v += (-k * (state.x - target) - c * state.v) * dt;
	state.x += state.v * dt;
	return state.x;
}

/** 三次贝塞尔上 u 处的坐标分量 */
export function bezierAt(
	p0: number,
	p1: number,
	p2: number,
	p3: number,
	u: number,
) {
	const m = 1 - u;
	return (
		m * m * m * p0 + 3 * m * m * u * p1 + 3 * m * u * u * p2 + u * u * u * p3
	);
}

/**
 * 常驻帧循环：页面隐藏或元素离开视口时停帧（导 Conduct）。
 * 回调拿到 dt（秒，限制在 1/30 内）与累计时间 t；单帧出错只报一次，不让循环停摆。
 */
export function createFrameLoop(step: (dt: number, t: number) => void) {
	let target: Element | null = null;
	let offscreen = false;
	let frames = 0;
	let running = false;
	let last = 0;
	let time = 0;
	let warned = false;
	let raf = 0;

	const run = (force: boolean) => {
		raf = 0;
		if (document.hidden && !force) {
			last = 0;
			return;
		}
		// 每 20 帧量一次位置：离开视口就停帧（比 IntersectionObserver 更不受过渡与隐藏祖先影响）
		if (target && (offscreen || frames++ % 20 === 0)) {
			const r = target.getBoundingClientRect();
			offscreen = r.width === 0 || r.bottom < 0 || r.top > window.innerHeight;
		}
		if (offscreen && !force) {
			last = 0;
			return;
		}
		const now = performance.now();
		const dt = last
			? Math.max(0, Math.min(1 / 30, (now - last) / 1000))
			: 1 / 60;
		last = now;
		time += dt;
		try {
			step(dt, time);
		} catch (error) {
			if (!warned) {
				warned = true;
				console.error(error);
			}
		}
		if (running) {
			raf = requestAnimationFrame(() => run(false));
		}
	};

	return {
		start(el?: Element | null) {
			if (running) return;
			running = true;
			last = 0;
			target = el ?? null;
			raf = requestAnimationFrame(() => run(false));
		},
		stop() {
			running = false;
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
			target = null;
		},
		/** 立即执行一帧（减少动态效果时用来直接画到终态） */
		flush() {
			run(true);
		},
		get time() {
			return time;
		},
	};
}

/** 打字机：逐字写出 text，结束回调 done；减少动态效果时一次写完。返回取消函数 */
export function typeOut(
	text: string,
	write: (value: string) => void,
	done?: () => void,
	speed = 42,
) {
	if (motionSkipped()) {
		write(text);
		done?.();
		return () => {};
	}
	let i = 0;
	write("");
	const timer = window.setInterval(() => {
		i += 1;
		write(text.slice(0, i));
		if (i >= text.length) {
			window.clearInterval(timer);
			window.setTimeout(() => done?.(), 180);
		}
	}, speed);
	return () => window.clearInterval(timer);
}

/** 本会话是否首次出现某段开场（开场只播一次，刷新后同会话不再重播） */
export function firstTimeInSession(key: string) {
	try {
		const storageKey = `frontend-frame.intro.${key}`;
		if (sessionStorage.getItem(storageKey)) return false;
		sessionStorage.setItem(storageKey, "1");
		return true;
	} catch {
		return false;
	}
}

/**
 * 共享布局变形（FLIP）：先记下 targets 的位置，执行 mutate（改 class / 数据并等 DOM 更新），
 * 再从旧位置平滑过渡到新布局。样本册卡片展开、看板重排共用。
 */
export async function flipLayout(
	targets: Element[] | NodeListOf<Element>,
	mutate: () => void | Promise<void>,
) {
	const list = Array.from(targets);
	if (motionSkipped() || !list.length) {
		await mutate();
		return;
	}
	const first = list.map((el) => el.getBoundingClientRect());
	await mutate();
	requestAnimationFrame(() => {
		list.forEach((el, index) => {
			const last = el.getBoundingClientRect();
			const dx = first[index].left - last.left;
			const dy = first[index].top - last.top;
			const sx = first[index].width / last.width;
			const sy = first[index].height / last.height;
			if (dx === 0 && dy === 0 && sx === 1 && sy === 1) return;
			track(
				animate(
					el,
					{ x: [dx, 0], y: [dy, 0], scaleX: [sx, 1], scaleY: [sy, 1] },
					{
						duration: 0.62,
						ease: EASE.glide,
						onComplete: () => clearInline(el),
					},
				),
			);
		});
	});
}

/* ── 滑动玻璃块：导航选中、分段滑块共用（transform 归 motion） ── */
export function slideThumb(
	thumb: HTMLElement | null,
	target: HTMLElement | null,
	axis: "x" | "y",
	instant = false,
) {
	const parent = thumb?.offsetParent as HTMLElement | null;
	if (!thumb || !target || !parent) return;
	// 用几何差值定位：目标与滑块不必是同一个定位父级。
	// 祖先若正在缩放（弹窗 / 命令面板从触发点展开），包围盒带着缩放比例，需折算回布局像素，
	// 否则首帧量到的位置与宽度偏小，滑块错位直到下次切换才纠正
	const pr = parent.getBoundingClientRect();
	const tr = target.getBoundingClientRect();
	const sx = parent.offsetWidth ? pr.width / parent.offsetWidth : 1;
	const sy = parent.offsetHeight ? pr.height / parent.offsetHeight : 1;
	const kx = sx > 0.01 ? sx : 1;
	const ky = sy > 0.01 ? sy : 1;
	const props =
		axis === "y"
			? {
					y: (tr.top - pr.top) / ky - parent.clientTop + parent.scrollTop,
					height: tr.height / ky,
				}
			: {
					x: (tr.left - pr.left) / kx - parent.clientLeft + parent.scrollLeft,
					width: tr.width / kx,
				};
	if (instant || motionSkipped()) {
		animate(thumb, props, { duration: 0 });
		return;
	}
	track(animate(thumb, props, { duration: DUR.slide, ease: EASE.glide }));
}

/* ── 最近一次指针按下的位置：弹窗据此从触发点展开（键盘打开时为 null，回落中心） ── */
export const lastPointer: { x: number; y: number; at: number } = {
	x: 0,
	y: 0,
	at: 0,
};
let pointerTracked = false;

function trackPointer() {
	if (pointerTracked || typeof document === "undefined") return;
	pointerTracked = true;
	document.addEventListener(
		"pointerdown",
		(event) => {
			lastPointer.x = event.clientX;
			lastPointer.y = event.clientY;
			lastPointer.at = performance.now();
		},
		{ capture: true, passive: true },
	);
	document.addEventListener(
		"keydown",
		(event) => {
			if (event.key === "Enter" || event.key === " ") lastPointer.at = 0;
		},
		{ capture: true, passive: true },
	);
}
trackPointer();

/** 刚刚（600ms 内）由指针触发的打开动作才有「来处」 */
function recentPointer() {
	return lastPointer.at && performance.now() - lastPointer.at < 600
		? lastPointer
		: null;
}

/** 最近一次指针按下位置下方、匹配选择器的元素（共享元素的「来处」）；键盘触发时为 null */
export function originAtPointer(selector: string) {
	const point = recentPointer();
	if (!point) return null;
	return document.elementFromPoint(point.x, point.y)?.closest(selector) ?? null;
}

/** 弹窗原点：触发点相对面板的位置，限制在面板外扩一圈内，避免从屏幕角落飞入 */
function originOf(panel: Element) {
	const point = recentPointer();
	if (!point) return "50% 50%";
	const r = panel.getBoundingClientRect();
	const x = Math.min(
		Math.max(point.x - r.left, -r.width * 0.25),
		r.width * 1.25,
	);
	const y = Math.min(
		Math.max(point.y - r.top, -r.height * 0.25),
		r.height * 1.25,
	);
	return `${x}px ${y}px`;
}

/* ── 浮层：弹窗 / 抽屉 / 下拉 ── */
export function overlayEnter(
	el: Element,
	done: () => void,
	kind: "modal" | "drawer" | "pop" = "modal",
	origin?: Element | null,
) {
	const panel = el.querySelector(".modal, .drawer") ?? el;
	if (motionSkipped()) {
		done();
		return;
	}
	if (kind === "pop") {
		track(
			animate(
				el,
				{ opacity: [0, 1], y: [-6, 0], scale: [0.98, 1] },
				{
					duration: 0.32,
					ease: EASE.reveal,
					onComplete: () => {
						clearInline(el);
						done();
					},
				},
			),
		);
		return;
	}
	track(
		animate(
			el,
			{ opacity: [0, 1] },
			{ duration: 0.22, ease: [0.55, 0.06, 0.68, 0.19], onComplete: done },
		),
	);
	if (kind === "drawer") {
		// 共享元素：一块玻璃从被点的行生长成抽屉，内容随后显现（放 Discharge）
		if (origin && document.contains(origin)) {
			morphGhost(origin.getBoundingClientRect(), panel.getBoundingClientRect());
			animate(panel, { opacity: 0 }, { duration: 0 });
			track(
				animate(
					panel,
					{ opacity: 1 },
					{ duration: 0.26, ease: [0.55, 0.06, 0.68, 0.19], delay: 0.3 },
				),
			);
			const inner = panel.querySelectorAll(
				".drawer-head, .drawer-body > *, .drawer-foot",
			);
			Array.from(inner).forEach((item, index) => {
				track(
					animate(
						item,
						{ opacity: [0, 1], y: [8, 0] },
						{
							duration: 0.42,
							ease: EASE.reveal,
							delay: 0.34 + index * 0.03,
							onComplete: () => clearInline(item),
						},
					),
				);
			});
			return;
		}
		track(
			animate(
				panel,
				{ x: [36, 0], opacity: [0, 1] },
				{
					duration: DUR.overlayIn + 0.1,
					ease: EASE.glide,
					onComplete: () => clearInline(panel),
				},
			),
		);
	} else {
		(panel as HTMLElement).style.transformOrigin = originOf(panel);
		const point = recentPointer();
		const from = point
			? { scale: 0.86, opacity: 0, y: 0 }
			: { y: 14, scale: 0.975, opacity: 0 };
		track(
			animate(
				panel,
				{ y: [from.y, 0], scale: [from.scale, 1], opacity: [from.opacity, 1] },
				{
					duration: DUR.overlayIn + 0.06,
					ease: EASE.reveal,
					delay: 0.02,
					onComplete: () => clearInline(panel),
				},
			),
		);
	}
}

export function overlayLeave(
	el: Element,
	done: () => void,
	kind: "modal" | "drawer" | "pop" = "modal",
	origin?: Element | null,
) {
	if (motionSkipped()) {
		done();
		return;
	}
	const panel = el.querySelector(".modal, .drawer") ?? el;
	if (kind === "pop") {
		track(
			animate(
				el,
				{ opacity: 0, y: -4 },
				{ duration: 0.14, ease: EASE.exit, onComplete: done },
			),
		);
		return;
	}
	if (kind === "drawer" && origin && document.contains(origin)) {
		// 收回原行（停摆 Halt）：内容先退，玻璃再缩回来处
		track(
			animate(
				panel,
				{ opacity: 0 },
				{ duration: 0.14, ease: EASE.exit, onComplete: done },
			),
		);
		morphGhost(
			panel.getBoundingClientRect(),
			origin.getBoundingClientRect(),
			true,
		);
		track(
			animate(
				el,
				{ opacity: 0 },
				{ duration: 0.3, ease: EASE.exit, delay: 0.08 },
			),
		);
		return;
	}
	if (kind === "drawer") {
		track(
			animate(
				panel,
				{ x: 24, opacity: 0 },
				{ duration: DUR.overlayOut, ease: EASE.exit, onComplete: done },
			),
		);
	} else {
		track(
			animate(
				panel,
				{ scale: 0.94, opacity: 0 },
				{ duration: DUR.overlayOut, ease: EASE.exit, onComplete: done },
			),
		);
	}
	track(
		animate(el, { opacity: 0 }, { duration: DUR.overlayOut, ease: EASE.exit }),
	);
}

/** 一块独立的玻璃从 from 矩形变形到 to 矩形，结束即移除；只服务于抽屉共享元素 */
function morphGhost(from: DOMRect, to: DOMRect, closing = false) {
	const ghost = document.createElement("div");
	ghost.className = "morph-ghost";
	document.body.appendChild(ghost);
	animate(
		ghost,
		{
			left: 0,
			top: 0,
			x: from.left,
			y: from.top,
			width: from.width,
			height: from.height,
			opacity: closing ? 1 : 0.9,
		},
		{ duration: 0 },
	);
	track(
		animate(
			ghost,
			{ x: to.left, y: to.top, width: to.width, height: to.height },
			{
				duration: closing ? 0.36 : 0.5,
				ease: closing ? EASE.swap : EASE.glide,
			},
		),
	);
	track(
		animate(
			ghost,
			{ opacity: 0 },
			{
				duration: closing ? 0.16 : 0.22,
				ease: [0.55, 0.06, 0.68, 0.19],
				delay: closing ? 0.24 : 0.32,
				onComplete: () => ghost.remove(),
			},
		),
	);
}

/* ── 底部浮条（批量操作、未保存变更）：从底部升起（放），收回时下沉（停摆） ── */
export function floatBarEnter(el: Element, done: () => void) {
	if (motionSkipped()) {
		done();
		return;
	}
	track(
		animate(
			el,
			{ y: [40, 0], opacity: [0, 1], scale: [0.96, 1] },
			{
				duration: 0.56,
				ease: EASE.settle,
				onComplete: () => {
					clearInline(el);
					done();
				},
			},
		),
	);
}

export function floatBarLeave(el: Element, done: () => void) {
	if (motionSkipped()) {
		done();
		return;
	}
	track(
		animate(
			el,
			{ y: 30, opacity: 0 },
			{ duration: 0.22, ease: EASE.exit, onComplete: done },
		),
	);
}

/* 组件统一从本入口取 animate，不再直接依赖 motion 包 */
export { animate } from "motion";
