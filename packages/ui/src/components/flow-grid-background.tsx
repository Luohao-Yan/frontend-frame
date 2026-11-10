"use client";

import * as React from "react";

import { cn } from "../lib/utils";

const POINT_SPACING = 10;
const MAX_PIXEL_RATIO = 1.5;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const VERTEX_SHADER = `
  precision mediump float;

  attribute vec2 a_position;
  attribute vec4 a_seed;

  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform float u_mouse_active;
  uniform float u_pixel_ratio;
  uniform float u_theme;
  uniform vec3 u_accent;

  varying float v_alpha;
  varying vec3 v_color;

  float verticalColumn(vec2 p, float centerX, float width, float bottom, float top) {
    float xMask = smoothstep(width, width * 0.35, abs(p.x - centerX));
    float bottomMask = smoothstep(bottom - 0.18, bottom, p.y);
    float topMask = 1.0 - smoothstep(top, top + 0.18, p.y);

    return xMask * bottomMask * topMask;
  }

  float fallingBlock(float y, float phase, float speed, float height) {
    float progress = fract((u_time * speed) + phase);
    float centerY = mix(1.22, -1.22, progress);
    float head = smoothstep(height, height * 0.22, abs(y - centerY));
    float trailCenter = centerY + height * 0.48;
    float trail = smoothstep(height * 1.45, height * 0.32, abs(y - trailCenter)) * 0.42;

    return max(head, trail);
  }

  void main() {
    vec2 pos = a_position;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 aspectVector = vec2(aspect, 1.0);
    vec2 toMouse = (pos - u_mouse) * aspectVector;
    float distanceToMouse = length(toMouse);
    float mouseInfluence = smoothstep(0.38, 0.0, distanceToMouse) * u_mouse_active;
    float logoFlow =
      verticalColumn(a_position, -0.56, 0.13, -0.92, 0.32) * fallingBlock(a_position.y, 0.08, 0.105, 0.52) +
      verticalColumn(a_position, -0.22, 0.15, -0.72, 0.86) * fallingBlock(a_position.y, 0.36, 0.088, 0.66) +
      verticalColumn(a_position, 0.15, 0.16, -0.96, 0.10) * fallingBlock(a_position.y, 0.58, 0.096, 0.58) +
      verticalColumn(a_position, 0.54, 0.13, -0.34, 0.92) * fallingBlock(a_position.y, 0.78, 0.078, 0.62);
    float counterFlow =
      verticalColumn(a_position, -0.39, 0.08, 0.16, 0.90) * fallingBlock(a_position.y, 0.21, 0.082, 0.40) +
      verticalColumn(a_position, 0.36, 0.09, -0.92, -0.16) * fallingBlock(a_position.y, 0.64, 0.116, 0.46);
    float flowMask = clamp(logoFlow + counterFlow * 0.72, 0.0, 1.0);
    float stream = sin((a_position.y * 18.0) - (u_time * 2.05) + (a_seed.x * 6.28318));
    float reverseStream = sin((a_position.y * 15.0) + (u_time * 1.62) + (a_seed.y * 6.28318));
    float streamPulse = smoothstep(0.26, 1.0, stream * 0.5 + 0.5);
    float reversePulse = smoothstep(0.34, 1.0, reverseStream * 0.5 + 0.5) * counterFlow;
    float darkPocket = smoothstep(0.42, 0.98, sin((a_position.x * 4.0) + (a_position.y * 3.2) - (u_time * 0.36)) * 0.5 + 0.5) * flowMask;
    vec2 direction = normalize(pos - u_mouse + vec2(0.0001));
    vec2 tangent = vec2(-direction.y, direction.x);

    pos.y += (streamPulse - 0.5) * flowMask * 0.026;
    pos.y -= reversePulse * 0.018;
    pos.x += sin((a_position.y * 10.0) + u_time + a_seed.w * 6.28318) * flowMask * 0.007;
    pos += direction * mouseInfluence * 0.018;
    pos += tangent * mouseInfluence * sin(u_time * 4.2 + a_seed.w * 6.28318) * 0.018;

    float baseAlpha = mix(0.40, 0.30, u_theme);
    float gridAlpha = baseAlpha * (0.96 + a_seed.z * 0.24);
    float streamAlpha = flowMask * (streamPulse * mix(0.78, 0.52, u_theme) + reversePulse * mix(0.56, 0.34, u_theme));
    float dimAlpha = darkPocket * mix(0.0, 0.16, u_theme);
    float hoverAlpha = mouseInfluence * mix(0.56, 0.46, u_theme);

    vec3 lightBase = vec3(0.04, 0.045, 0.045);
    vec3 darkBase = vec3(0.50, 0.54, 0.60);
    vec3 lightLogo = vec3(0.16, 0.18, 0.20);
    vec3 darkLogo = vec3(0.48, 0.52, 0.58);
    vec3 mutedLogo = mix(lightLogo, darkLogo, u_theme);
    vec3 accent = u_accent;

    v_alpha = max(0.025, gridAlpha + streamAlpha + hoverAlpha - dimAlpha);
    v_color = mix(
      mix(lightBase, darkBase, u_theme),
      mix(mutedLogo, accent, streamPulse * 0.42),
      flowMask * (mix(0.58, 0.30, u_theme) + streamPulse * mix(0.34, 0.22, u_theme)) + mouseInfluence * (mix(0.46, 0.30, u_theme) + a_seed.x * 0.34)
    );

    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = (mix(1.95, 1.62, u_theme) + a_seed.y * 0.62 + flowMask * (0.54 + streamPulse * 0.62) + mouseInfluence * 1.7) * u_pixel_ratio;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  varying float v_alpha;
  varying vec3 v_color;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distanceFromCenter = length(coord);
    float pointMask = smoothstep(0.5, 0.18, distanceFromCenter);

    if (pointMask <= 0.01) {
      discard;
    }

    gl_FragColor = vec4(v_color, v_alpha * pointMask);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if (!shader) {
		return null;
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function createProgram(gl: WebGLRenderingContext) {
	const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
	const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
	if (!vertex || !fragment) {
		if (vertex) gl.deleteShader(vertex);
		if (fragment) gl.deleteShader(fragment);
		return null;
	}
	const program = gl.createProgram();
	if (!program) {
		gl.deleteShader(vertex);
		gl.deleteShader(fragment);
		return null;
	}
	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	gl.deleteShader(vertex);
	gl.deleteShader(fragment);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		gl.deleteProgram(program);
		return null;
	}
	return program;
}

function hash(value: number) {
	return Math.abs((Math.sin(value * 12.9898) * 43758.5453) % 1);
}

function createGeometry(width: number, height: number, spacing: number) {
	const columns = Math.max(18, Math.ceil(width / spacing));
	const rows = Math.max(14, Math.ceil(height / spacing));
	const data = new Float32Array(columns * rows * 6);
	let offset = 0;

	for (let row = 0; row < rows; row += 1) {
		for (let column = 0; column < columns; column += 1) {
			const index = row * columns + column;
			const seedX = hash(index + 1.13);
			const seedY = hash(index + 7.71);
			const seedZ = hash(index + 19.27);
			const seedW = hash(index + 29.91);
			const x = columns === 1 ? 0 : (column / (columns - 1)) * 2 - 1;
			const y = rows === 1 ? 0 : 1 - (row / (rows - 1)) * 2;

			data[offset++] = x;
			data[offset++] = y;
			data[offset++] = seedX;
			data[offset++] = seedY;
			data[offset++] = seedZ;
			data[offset++] = seedW;
		}
	}

	return { data, count: columns * rows };
}

function isDarkTheme() {
	return document.documentElement.classList.contains("dark") ? 1 : 0;
}

export interface FlowGridBackgroundProps {
	className?: string;
	spacing?: number;
	maxPixelRatio?: number;
	accent?: [number, number, number];
}

export function FlowGridBackground({
	className,
	spacing = POINT_SPACING,
	maxPixelRatio = MAX_PIXEL_RATIO,
	accent = [0.176, 0.741, 0.722],
}: FlowGridBackgroundProps) {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const [accentR, accentG, accentB] = accent;

	React.useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const gl = canvas.getContext("webgl", {
			alpha: true,
			antialias: false,
			depth: false,
			stencil: false,
			premultipliedAlpha: true,
		});
		if (!gl) {
			return;
		}

		const program = createProgram(gl);
		if (!program) {
			return;
		}

		const buffer = gl.createBuffer();
		if (!buffer) {
			gl.deleteProgram(program);
			return;
		}

		const positionLocation = gl.getAttribLocation(program, "a_position");
		const seedLocation = gl.getAttribLocation(program, "a_seed");
		const timeLocation = gl.getUniformLocation(program, "u_time");
		const mouseLocation = gl.getUniformLocation(program, "u_mouse");
		const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
		const mouseActiveLocation = gl.getUniformLocation(
			program,
			"u_mouse_active",
		);
		const pixelRatioLocation = gl.getUniformLocation(program, "u_pixel_ratio");
		const themeLocation = gl.getUniformLocation(program, "u_theme");
		const accentLocation = gl.getUniformLocation(program, "u_accent");
		const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
		const mouse = { x: 10, y: 10, active: 0, targetActive: 0 };

		let count = 0;
		let frame = 0;
		let disposed = false;
		let visible = true;
		let pixelRatio = 1;

		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 24, 0);
		gl.enableVertexAttribArray(seedLocation);
		gl.vertexAttribPointer(seedLocation, 4, gl.FLOAT, false, 24, 8);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.clearColor(0, 0, 0, 0);

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const width = Math.max(1, Math.floor(rect.width));
			const height = Math.max(1, Math.floor(rect.height));
			pixelRatio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
			const pixelWidth = Math.floor(width * pixelRatio);
			const pixelHeight = Math.floor(height * pixelRatio);

			if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
				canvas.width = pixelWidth;
				canvas.height = pixelHeight;
			}

			const geometry = createGeometry(width, height, spacing);
			count = geometry.count;
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, geometry.data, gl.STATIC_DRAW);
		};

		const render = (time: number) => {
			if (disposed || !visible) {
				frame = 0;
				return;
			}

			mouse.active += (mouse.targetActive - mouse.active) * 0.08;
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.useProgram(program);
			gl.uniform1f(timeLocation, time * 0.001);
			gl.uniform2f(mouseLocation, mouse.x, mouse.y);
			gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
			gl.uniform1f(
				mouseActiveLocation,
				reducedMotion.matches ? 0 : mouse.active,
			);
			gl.uniform1f(pixelRatioLocation, pixelRatio);
			gl.uniform1f(themeLocation, isDarkTheme());
			gl.uniform3f(accentLocation, accentR, accentG, accentB);
			gl.drawArrays(gl.POINTS, 0, count);

			if (!reducedMotion.matches) {
				frame = window.requestAnimationFrame(render);
			} else {
				frame = 0;
			}
		};

		const start = () => {
			if (disposed) {
				return;
			}
			if (reducedMotion.matches) {
				render(performance.now());
				return;
			}
			if (!frame) {
				frame = window.requestAnimationFrame(render);
			}
		};

		const stop = () => {
			if (frame) {
				window.cancelAnimationFrame(frame);
				frame = 0;
			}
		};

		const onPointerMove = (event: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			const inside =
				event.clientX >= rect.left &&
				event.clientX <= rect.right &&
				event.clientY >= rect.top &&
				event.clientY <= rect.bottom;

			if (!inside) {
				mouse.targetActive = 0;
				return;
			}

			mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			mouse.y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
			mouse.targetActive = 1;
		};

		const onPointerLeave = () => {
			mouse.targetActive = 0;
		};

		const intersectionObserver = new IntersectionObserver(([entry]) => {
			visible = Boolean(entry?.isIntersecting);
			if (visible) {
				start();
			} else {
				stop();
			}
		});
		const resizeObserver = new ResizeObserver(() => {
			resize();
			start();
		});
		const mutationObserver = new MutationObserver(() => {
			start();
		});
		const onReducedMotionChange = () => {
			stop();
			start();
		};

		resize();
		start();
		intersectionObserver.observe(canvas);
		resizeObserver.observe(canvas);
		mutationObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
		window.addEventListener("pointermove", onPointerMove, { passive: true });
		window.addEventListener("pointerleave", onPointerLeave);
		reducedMotion.addEventListener?.("change", onReducedMotionChange);

		return () => {
			disposed = true;
			stop();
			intersectionObserver.disconnect();
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerleave", onPointerLeave);
			reducedMotion.removeEventListener?.("change", onReducedMotionChange);
			gl.deleteBuffer(buffer);
			gl.deleteProgram(program);
			gl.getExtension("WEBGL_lose_context")?.loseContext();
		};
	}, [accentB, accentG, accentR, maxPixelRatio, spacing]);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden="true"
			className={cn("pointer-events-none block h-full w-full", className)}
		/>
	);
}
