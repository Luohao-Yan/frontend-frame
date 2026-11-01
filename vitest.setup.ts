import "@testing-library/jest-dom/vitest";

// jsdom mocks required by Radix UI / common browser features
if (!window.matchMedia) {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}),
	});
}

class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}

if (!(globalThis as { ResizeObserver?: unknown }).ResizeObserver) {
	(globalThis as { ResizeObserver: typeof ResizeObserverMock }).ResizeObserver =
		ResizeObserverMock;
}

if (!window.getComputedStyle) {
	Object.defineProperty(window, "getComputedStyle", {
		value: () => ({
			getPropertyValue: () => "",
		}),
	});
}

// Radix Select needs scrollIntoView which jsdom does not implement
if (!window.HTMLElement.prototype.scrollIntoView) {
	Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
		value: () => {},
	});
}
