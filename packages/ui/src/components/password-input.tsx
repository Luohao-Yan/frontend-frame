"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Input } from "./input";

function PasswordInput({
	className,
	type = "password",
	...props
}: React.ComponentProps<"input">) {
	const [showPassword, setShowPassword] = React.useState(false);

	return (
		<div className="relative flex">
			<Input
				data-slot="password-input"
				type={showPassword ? "text" : type}
				className={cn("pr-10", className)}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 h-full w-9 rounded-l-none hover:bg-transparent"
				onClick={() => setShowPassword((visible) => !visible)}
				aria-label={showPassword ? "隐藏密码" : "显示密码"}
			>
				{showPassword ? (
					<EyeOffIcon className="size-4" />
				) : (
					<EyeIcon className="size-4" />
				)}
			</Button>
		</div>
	);
}

export { PasswordInput };
