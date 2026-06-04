import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/stores/auth.store";
import { useState } from "react";
import { useNavigate } from "react-router";
export function RegisterForm({
  className,
}: React.ComponentProps<"form">) {

  const { signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp({email, password, firstName, lastName, phone});
    if (useAuthStore.getState().accessToken) {
      navigate("/signin");
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit}>
      <FieldGroup>
        {/* title and description */}
        <div className="flex flex-col items-center gap-2 text-center !pb-8 !mt-2 ">
          <h1 className="text-2xl !font-['Lora'] leading-tight">Chào Mừng Đến Với Chúng Tôi</h1>
          <p className="text-sm text-balance text-muted-foreground !-mt-6">
            Đăng ký để quản lý phòng, ưu đãi và thông tin lưu trú của bạn.
          </p>
        </div>
        <div className="flex items-center gap-4 md:gap-6 w-full mt-2 ">
          <Field className="w-full w-1/2">
            <FieldLabel htmlFor="firstName" className="!text-[20px] font-['Lora'] text-[#52483C]">Họ</FieldLabel>
            <Input className="p-6 bg-white !text-[20px] !placeholder-[#a89b8c] "
              id="firstName"
              type="text"
              required
              placeholder="Trần Văn"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Field>
          <Field className="w-full w-1/2">
            <FieldLabel htmlFor="lastName" className="!text-[20px] font-['Lora'] text-[#52483C]">Tên</FieldLabel>
            <Input className="p-6 bg-white !text-[20px] !placeholder-[#a89b8c] "
              id="lastName"
              type="text"
              required
              placeholder="A"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="phone" className="!text-[20px] font-['Lora'] text-[#52483C]">Số điện thoại</FieldLabel>
          <Input className="p-6 bg-white !text-[20px] !placeholder-[#a89b8c] "
            id="phone"
            type="tel"
            required
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
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
        </Field>
        <Field>
          <Button type="submit" className="p-6 bg-[#101953] !text-[16px]
            hover:bg-[#101953]/90" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </Field>
        <FieldSeparator className="font-['Lora'] !text-[#52483C]">Hoặc</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Đã có tài khoản?{" "}
            <a href="/signin" className="underline underline-offset-4">
              Đăng nhập ngay
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}