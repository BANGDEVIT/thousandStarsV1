import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/authSchema";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    "/admin";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch {
      /* toast handled in store */
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Thousand Stars</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Đăng nhập quản trị</h1>
        <p className="mt-2 text-sm text-slate-400">
          Dùng tài khoản admin, manager hoặc staff để truy cập dashboard.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-amber-400"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-400">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-slate-300">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-amber-400"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </div>
    </div>
  );
}
