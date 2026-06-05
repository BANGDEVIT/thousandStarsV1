import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth.store";

export function LoginForm({ className }: React.ComponentProps<"form">) {
  const { signIn, loading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn({ email, password });
    if (!useAuthStore.getState().accessToken) return;

    const roles = useAuthStore.getState().roles;
    const redirect = searchParams.get("redirect");
    const safeRedirect =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : null;

    navigate(roles.includes("manager") ? "/admin" : safeRedirect ?? "/profile");
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit}>
      <FieldGroup className="gap-5">
        <div className="text-center">
          <h1 className="font-['Lora'] text-2xl font-bold leading-tight text-[#2f4858]">
            Chào mừng trở lại
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Đăng nhập để quản lý phòng, ưu đãi và thông tin lưu trú của bạn.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email" className="text-sm font-semibold text-[#52483C]">
            Email
          </FieldLabel>
          <Input
            className="h-12 rounded-xl bg-white text-base placeholder:text-slate-400"
            id="email"
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password" className="text-sm font-semibold text-[#52483C]">
            Mật khẩu
          </FieldLabel>
          <Input
            className="h-12 rounded-xl bg-white text-base placeholder:text-slate-400"
            id="password"
            type="password"
            placeholder="Nhập mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex cursor-pointer select-none items-center gap-2 text-[#52483C]">
              <input
                type="checkbox"
                id="remember"
                className="size-4 rounded border-gray-300 accent-[#335F76]"
              />
              Ghi nhớ tôi
            </label>
            <a
              href="#"
              className="font-medium text-[#8f7a57] transition hover:text-[#52483C] hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>
        </Field>

        <Field>
          <Button
            type="submit"
            className="h-12 rounded-xl bg-[#335F76] text-base font-semibold text-white hover:bg-[#294d61]"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Field>

        <FieldSeparator className="text-[#52483C]">Hoặc</FieldSeparator>
        <Field>
          <FieldDescription className="text-center text-sm">
            Không có tài khoản?{" "}
            <a href="/signup" className="font-semibold text-[#335F76] underline underline-offset-4">
              Đăng ký ngay
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
