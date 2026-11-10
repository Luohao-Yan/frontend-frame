import {
	BadgeCheckIcon,
	BriefcaseIcon,
	Building2Icon,
	CheckCircle2Icon,
	MailIcon,
	SaveIcon,
	ShieldCheckIcon,
	UserIcon,
} from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	PageHeader,
	Progress,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Switch,
	Textarea,
} from "@frontend-frame/ui";

import { ContactForm } from "@/components/contact-form";
import { CodeBlock, Section } from "@/components/showcase";

interface ProfileFormValues {
	name: string;
	email: string;
	role: string;
	company: string;
	bio: string;
	notifications: boolean;
}

const roleLabels: Record<string, string> = {
	frontend: "前端工程师",
	designer: "产品设计师",
	backend: "后端工程师",
	pm: "产品经理",
};

const formExample = `const form = useForm<ProfileFormValues>({
  defaultValues: { name: "", email: "" },
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      rules={{ required: "请输入邮箱" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>邮箱</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>`;

export function FormsPage() {
	const [profile, setProfile] = React.useState<ProfileFormValues>({
		name: "林晓",
		email: "lin.xiao@example.com",
		role: "frontend",
		company: "Frontend Frame",
		bio: "负责前端基础设施与设计系统建设。",
		notifications: true,
	});

	const form = useForm<ProfileFormValues>({
		defaultValues: profile,
		mode: "onChange",
	});

	const watched = form.watch();

	const onSubmit = (values: ProfileFormValues) => {
		setProfile(values);
		toast.success("资料已保存", {
			description: "新的个人信息已同步到工作区。",
		});
	};

	const completion =
		[
			watched.name,
			watched.email,
			watched.role,
			watched.company,
			watched.bio,
		].filter(Boolean).length * 20;

	return (
		<div className="space-y-10">
			<PageHeader
				eyebrow="Forms"
				title="表单示例"
				description="基于 React Hook Form 的受控表单模式，统一校验提示、字段布局与提交反馈。右侧实时预览帮助验证数据流。"
				actions={
					<Button variant="outline" onClick={() => form.reset(profile)}>
						重置表单
					</Button>
				}
			/>

			<div className="grid gap-6 lg:grid-cols-5">
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>个人资料</CardTitle>
						<CardDescription>
							用于团队协作与通知，所有字段都会进行客户端校验。
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<div className="grid gap-4 sm:grid-cols-2">
									<FormField
										control={form.control}
										name="name"
										rules={{
											required: "请输入姓名",
											minLength: { value: 2, message: "姓名至少 2 个字符" },
										}}
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
										rules={{
											required: "请输入邮箱",
											pattern: {
												value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
												message: "邮箱格式不正确",
											},
										}}
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
										name="role"
										rules={{ required: "请选择角色" }}
										render={({ field }) => (
											<FormItem>
												<FormLabel>角色</FormLabel>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="选择角色" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="frontend">前端工程师</SelectItem>
														<SelectItem value="backend">后端工程师</SelectItem>
														<SelectItem value="designer">产品设计师</SelectItem>
														<SelectItem value="pm">产品经理</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="company"
										rules={{ required: "请输入公司名称" }}
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
								</div>

								<FormField
									control={form.control}
									name="bio"
									rules={{
										maxLength: { value: 120, message: "最多 120 个字符" },
									}}
									render={({ field }) => (
										<FormItem>
											<FormLabel>个人简介</FormLabel>
											<FormControl>
												<Textarea
													rows={4}
													placeholder="简单介绍你的工作内容..."
													{...field}
												/>
											</FormControl>
											<FormDescription>
												{field.value.length}/120 个字符
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="notifications"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-sm">邮件通知</FormLabel>
												<FormDescription>
													接收评审请求、部署结果与安全告警。
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<Separator />
								<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
									<Button
										type="button"
										variant="outline"
										onClick={() => form.reset()}
									>
										取消
									</Button>
									<Button type="submit" disabled={!form.formState.isValid}>
										<SaveIcon />
										保存资料
									</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>

				<div className="space-y-4 lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>实时预览</CardTitle>
							<CardDescription>表单数据会即时反映在卡片中</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5">
							<div className="flex items-center gap-4">
								<Avatar className="size-16">
									<AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-semibold text-white">
										{(watched.name || "未").slice(0, 1)}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0">
									<div className="flex items-center gap-1.5">
										<p className="truncate text-lg font-semibold">
											{watched.name || "未命名用户"}
										</p>
										<BadgeCheckIcon className="size-4 text-blue-500" />
									</div>
									<p className="text-muted-foreground truncate text-sm">
										{roleLabels[watched.role] ?? "未选择角色"}
									</p>
								</div>
							</div>

							<div className="grid gap-3 text-sm">
								<div className="flex items-center gap-2">
									<MailIcon className="text-muted-foreground size-4" />
									<span className="truncate">
										{watched.email || "未填写邮箱"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Building2Icon className="text-muted-foreground size-4" />
									<span className="truncate">
										{watched.company || "未填写公司"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<BriefcaseIcon className="text-muted-foreground size-4" />
									<span>{roleLabels[watched.role] ?? "未选择角色"}</span>
								</div>
							</div>

							<p className="text-muted-foreground min-h-10 text-sm leading-5">
								{watched.bio || "还没有填写个人简介。"}
							</p>

							<div className="space-y-2">
								<div className="flex items-center justify-between text-xs">
									<span className="text-muted-foreground">资料完整度</span>
									<span className="font-medium">{completion}%</span>
								</div>
								<Progress value={completion} />
							</div>
						</CardContent>
						<CardFooter className="flex flex-wrap gap-2">
							<Badge variant="secondary" className="gap-1">
								<ShieldCheckIcon className="size-3" />
								已验证
							</Badge>
							<Badge variant="outline" className="gap-1">
								<UserIcon className="size-3" />
								{watched.notifications ? "通知开启" : "通知关闭"}
							</Badge>
						</CardFooter>
					</Card>

					<Card className="border-emerald-500/25 bg-emerald-500/5">
						<CardContent className="flex gap-3 p-5">
							<CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-emerald-600" />
							<div className="space-y-1">
								<p className="text-sm font-medium">表单状态已同步</p>
								<p className="text-muted-foreground text-xs leading-5">
									当前表单{" "}
									{Object.keys(form.formState.errors).length === 0
										? "没有"
										: "存在"}
									校验错误， 提交后会通过 Sonner 展示全局反馈。
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<Section
				title="真实提交链路"
				description="Zod 客户端校验 + createAction 服务端校验 + useAction 提交状态 + applyFieldErrors 字段回填。输入 @blocked.test 可验证服务端字段错误。"
			>
				<Card>
					<CardContent className="p-6">
						<ContactForm />
					</CardContent>
				</Card>
			</Section>

			<Section
				title="代码示例"
				description="业务表单推荐统一使用 FormField + FormItem 组合，确保标签、描述与错误信息关联。"
			>
				<CodeBlock code={formExample} />
			</Section>
		</div>
	);
}
