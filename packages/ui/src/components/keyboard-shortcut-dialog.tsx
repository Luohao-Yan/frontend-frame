"use client";

import * as React from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./dialog";

export interface KeyboardShortcut {
	id?: string;
	keys: string[];
	description: string;
}

export interface KeyboardShortcutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	shortcuts: KeyboardShortcut[];
	title?: string;
	description?: string;
	footer?: React.ReactNode;
}

function ShortcutKey({ children }: { children: string }) {
	return (
		<kbd className="border-border bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[11px]">
			{children}
		</kbd>
	);
}

function KeyboardShortcutDialog({
	open,
	onOpenChange,
	shortcuts,
	title = "键盘快捷键",
	description = "可用键盘快捷键列表",
	footer,
}: KeyboardShortcutDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription className="sr-only">
						{description}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-1">
					{shortcuts.map((shortcut, index) => (
						<div
							key={shortcut.id ?? `${shortcut.description}-${index}`}
							className="flex items-center justify-between gap-4 rounded-md px-2 py-1.5"
						>
							<span className="text-foreground text-sm">
								{shortcut.description}
							</span>
							<div className="flex shrink-0 items-center gap-1">
								{shortcut.keys.map((key, keyIndex) => (
									<React.Fragment key={`${key}-${keyIndex}`}>
										{keyIndex > 0 ? (
											<span className="text-muted-foreground text-[10px]">
												+
											</span>
										) : null}
										<ShortcutKey>{key}</ShortcutKey>
									</React.Fragment>
								))}
							</div>
						</div>
					))}
				</div>
				{footer ? <div className="border-t pt-3">{footer}</div> : null}
			</DialogContent>
		</Dialog>
	);
}

export { KeyboardShortcutDialog, ShortcutKey };
