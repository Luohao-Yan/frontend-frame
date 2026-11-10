"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ActionError,
	applyFieldErrors,
	createAction,
	useAction,
	type ActionResult,
} from "@frontend-frame/forms";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Checkbox,
	FlowGridBackground,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	PasswordInput,
	ThemeToggle,
} from "@frontend-frame/ui";
import { ArrowLeftIcon, LogInIcon, SparklesIcon } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().trim().email("邮箱格式不正确"),
	password: z.string().min(8, "密码至少 8 位"),
	remember: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface LoginSession {
	email: string;
	displayName?: string;
}

export interface LoginPageProps {
	onSubmit?: (input: LoginInput) => Promise<ActionResult<LoginSession>>;
}

const defaultLogin = createAction<typeof loginSchema, LoginSession>(
	loginSchema,
	() => {
		throw new ActionError(
			"AUTH_NOT_CONFIGURED",
			"认证服务尚未接入。请通过 LoginPage 的 onSubmit 接入你的登录接口。",
		);
	},
);

export function LoginPage({ onSubmit }: LoginPageProps) {
	const navigate = useNavigate();
	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		mode: "onTouched",
		defaultValues: {
			email: "",
			password: "",
			remember: true,
		},
	});
	const action = useAction(onSubmit ?? defaultLogin);

	React.useEffect(() => {
		if (action.hasSucceeded) {
			navigate("/", { replace: true });
		}
	}, [action.hasSucceeded, navigate]);

	const submit = form.handleSubmit(async (values) => {
		const result = await action.execute(values);
		if (result.ok) {
			return;
		}

		const applied = applyFieldErrors(form, result.error.fieldErrors);
		if (applied === 0) {
			form.setError("root", {
				type: "server",
				message: result.error.message,
			});
		}
	});

	const rootError = form.formState.errors.root?.message;

	return (
		<main className="bg-background relative isolate min-h-svh overflow-hidden px-4 py-10 sm:px-6">
			<FlowGridBackground className="absolute inset-0 z-0" />

			<div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-md flex-col justify-center">
				<div className="mb-8 flex items-center justify-between">
					<Link
						to="/"
						className="focus-visible:ring-ring/40 flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:outline-none"
						aria-label="Frontend Frame 首页"
					>
						<span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg shadow-sm">
							<SparklesIcon className="size-4" aria-hidden="true" />
						</span>
						<span className="text-sm font-semibold">Frontend Frame</span>
					</Link>
					<ThemeToggle />
				</div>

				<Card className="border-border/70 bg-card/85 shadow-2xl backdrop-blur-xl">
					<CardHeader>
						<CardTitle className="text-2xl">登录工作台</CardTitle>
						<CardDescription>
							使用你的团队账号继续。背景使用与 PortWise Hero 同构的 WebGL
							点阵流场。
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={submit} className="space-y-5" noValidate>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>邮箱</FormLabel>
											<FormControl>
												<Input
													type="email"
													autoComplete="email"
													placeholder="name@company.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>密码</FormLabel>
											<FormControl>
												<PasswordInput
													autoComplete="current-password"
													placeholder="至少 8 位字符"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="remember"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start gap-2 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={(checked) =>
														field.onChange(checked === true)
													}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>保持登录</FormLabel>
												<FormDescription>
													在公共设备上请不要勾选。
												</FormDescription>
											</div>
										</FormItem>
									)}
								/>

								{rootError ? (
									<Alert variant="destructive">
										<AlertTitle>登录失败</AlertTitle>
										<AlertDescription>{rootError}</AlertDescription>
									</Alert>
								) : null}

								<Button
									type="submit"
									className="w-full"
									isLoading={action.isExecuting}
								>
									<LogInIcon />
									{action.isExecuting ? "登录中..." : "登录"}
								</Button>
							</form>
						</Form>
					</CardContent>
					<CardFooter className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs">
						<span>登录页模板 · 认证接口通过 onSubmit 注入</span>
						<Link
							to="/"
							className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
						>
							<ArrowLeftIcon className="size-3.5" />
							返回首页
						</Link>
					</CardFooter>
				</Card>
			</div>
		</main>
	);
}
