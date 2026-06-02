import { cn } from "@/lib/utils"
import { Button } from "@/components/login-comp/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/login-comp/field"
import { Input } from "@/components/login-comp/input"
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { useNavigate } from "react-router";
export function LoginForm({
  className,
}: React.ComponentProps<"form">) {

  const { signIn, loading } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    if (useAuthStore.getState().accessToken) {
      navigate("/profile");
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit}>
      <FieldGroup>
        {/* title and description */}
        <div className="flex flex-col items-center gap-2 text-center !pb-16 !mt-6 ">
          <h1 className="text-2xl !font-['Lora'] leading-tight">Chào Mừng Trở Lại</h1>
          <p className="text-sm text-balance text-muted-foreground !-mt-6">
            Đăng nhập để quản lý phòng, ưu đãi và thông tin lưu trú của bạn.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email" className="!text-[20px] font-['Lora'] text-[#52483C]">Email</FieldLabel>
          <Input className="p-6 bg-white !text-[20px] !placeholder-[#a89b8c] "
            id="email"
            type="email"
            required
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="!text-[20px] font-['Lora'] text-[#52483C]">Password</FieldLabel>
          </div>
          <Input className="p-6 bg-white !text-[20px] !placeholder-[#a89b8c]"
            id="password"
            type="password"
            placeholder="Nhập mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center justify-between w-full mt-2 !pb-8">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-gray-300 accent-[#52483C] cursor-pointer"
              />
              <span className="text-[16px] font-['Lora'] text-[#52483C]">
                Ghi nhớ tôi
              </span>
            </label>
            <a
              href="#"
              className="text-[16px] font-['Lora'] text-[#a89b8c] hover:text-[#52483C] hover:underline underline-offset-4"
            >
              Quên mật khẩu ?
            </a>
          </div>
        </Field>
        <Field>
          <Button type="submit" className="p-6 bg-[#101953] !text-[16px]
            hover:bg-[#101953]/90" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Field>
        <FieldSeparator className="font-['Lora'] !text-[#52483C]">Hoặc</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Không có tài khoản?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Đăng ký ngay
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}