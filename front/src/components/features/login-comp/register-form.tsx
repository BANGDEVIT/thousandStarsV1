import { useState } from "react";
import { useNavigate } from "react-router";
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

export function RegisterForm({ className }: React.ComponentProps<"form">) {
  const { signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp({ email, password, firstName, lastName, phone });
    if (useAuthStore.getState().accessToken) {
      navigate("/signin");
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit}>
      <FieldGroup className="gap-5">
        <div className="text-center">
          <h1 className="font-['Lora'] text-2xl font-bold leading-tight text-[#2f4858]">
            Tạo tài khoản
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Đăng ký để quản lý phòng, ưu đãi và thông tin lưu trú của bạn.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="firstName" className="text-sm font-semibold text-[#52483C]">
              Họ
            </FieldLabel>
            <Input
              className="h-12 rounded-xl bg-white text-base placeholder:text-slate-400"
              id="firstName"
              type="text"
              required
              placeholder="Trần Văn"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName" className="text-sm font-semibold text-[#52483C]">
              Tên
            </FieldLabel>
            <Input
              className="h-12 rounded-xl bg-white text-base placeholder:text-slate-400"
              id="lastName"
              type="text"
              required
              placeholder="An"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="phone" className="text-sm font-semibold text-[#52483C]">
            Số điện thoại
          </FieldLabel>
          <Input
            className="h-12 rounded-xl bg-white text-base placeholder:text-slate-400"
            id="phone"
            type="tel"
            required
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>

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
        </Field>

        <Field>
          <Button
            type="submit"
            className="h-12 rounded-xl bg-[#335F76] text-base font-semibold text-white hover:bg-[#294d61]"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </Field>

        <FieldSeparator className="text-[#52483C]">Hoặc</FieldSeparator>
        <Field>
          <FieldDescription className="text-center text-sm">
            Đã có tài khoản?{" "}
            <a href="/signin" className="font-semibold text-[#335F76] underline underline-offset-4">
              Đăng nhập ngay
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
