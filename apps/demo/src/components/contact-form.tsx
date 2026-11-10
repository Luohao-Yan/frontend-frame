"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ActionError,
	applyFieldErrors,
	createAction,
	useAction,
} from "@frontend-frame/forms";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Button,
	Checkbox,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea,
} from "@frontend-frame/ui";
import { CheckCircle2Icon, RefreshCwIcon, SendIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactSchema = z.object({
	name: z.string().trim().min(2, "请输入至少 2 个字符"),
	email: z.string().trim().email("邮箱格式不正确"),
	company: z.string().trim().max(80, "公司名称最多 80 个字符").optional(),
	employees: z.string().optional(),
	message: z
		.string()
		.trim()
		.min(10, "请至少输入 10 个字符")
		.max(500, "最多输入 500 个字符"),
	agree: z.boolean().refine((value) => value, {
		message: "请先同意隐私条款",
	}),
});

type ContactInput = z.infer<typeof contactSchema>;

interface ContactReceipt {
	ticketId: string;
	receivedAt: string;
	email: string;
}

function createTicketId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return `FF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
	}
	return `FF-${Date.now().toString(36).toUpperCase()}`;
}

const submitContact = createAction(contactSchema, (input): ContactReceipt => {
	if (input.email.endsWith("@blocked.test")) {
		throw new ActionError("EMAIL_BLOCKED", "该邮箱已被限制", {
			email: ["该邮箱已被限制，请更换邮箱"],
		});
	}

	return {
		ticketId: createTicketId(),
		receivedAt: new Date().toISOString(),
		email: input.email,
	};
});

export function ContactForm() {
	const form = useForm<ContactInput>({
		resolver: zodResolver(contactSchema),
		mode: "onTouched",
		defaultValues: {
			name: "",
			email: "",
			company: "",
			employees: "",
			message: "",
			agree: false,
		},
	});
	const action = useAction(submitContact);

	const onSubmit = form.handleSubmit(async (values) => {
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

	if (action.hasSucceeded && action.data) {
		return (
			<div className="space-y-4">
				<Alert className="border-emerald-500/30 bg-emerald-500/5">
					<CheckCircle2Icon className="text-emerald-600" />
					<AlertTitle>提交成功</AlertTitle>
					<AlertDescription>
						工单号 <code className="font-mono">{action.data.ticketId}</code>
						，我们会通过 {action.data.email} 回复。
					</AlertDescription>
				</Alert>
				<Button
					type="button"
					variant="outline"
					onClick={() => {
						action.reset();
						form.reset();
					}}
				>
					<RefreshCwIcon />
					再提交一次
				</Button>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="space-y-5" noValidate>
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>姓名</FormLabel>
								<FormControl>
									<Input placeholder="请输入姓名" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>邮箱</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="name@company.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="company"
						render={({ field }) => (
							<FormItem>
								<FormLabel>公司</FormLabel>
								<FormControl>
									<Input placeholder="公司或团队名称" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="employees"
						render={({ field }) => (
							<FormItem>
								<FormLabel>团队规模</FormLabel>
								<Select value={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="选择团队规模" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="1-10">1-10 人</SelectItem>
										<SelectItem value="11-50">11-50 人</SelectItem>
										<SelectItem value="51-200">51-200 人</SelectItem>
										<SelectItem value="200+">200 人以上</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem>
							<FormLabel>需求描述</FormLabel>
							<FormControl>
								<Textarea
									rows={5}
									placeholder="请描述你的业务场景、期望接入的模块或遇到的问题..."
									{...field}
								/>
							</FormControl>
							<FormDescription>{field.value.length}/500 个字符</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="agree"
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
								<FormLabel>我已阅读并同意隐私条款</FormLabel>
								<FormMessage />
							</div>
						</FormItem>
					)}
				/>

				{form.formState.errors.root?.message || action.error ? (
					<Alert variant="destructive">
						<AlertTitle>提交失败</AlertTitle>
						<AlertDescription>
							{form.formState.errors.root?.message ?? action.error?.message}
						</AlertDescription>
					</Alert>
				) : null}

				<div className="flex justify-end">
					<Button type="submit" isLoading={action.isExecuting}>
						<SendIcon />
						{action.isExecuting ? "提交中..." : "提交需求"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
