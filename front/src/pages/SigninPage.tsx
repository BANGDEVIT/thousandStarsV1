import { LoginForm } from "@/components/features/login-comp/login-form";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import signinImg from "@/assets/signin.png";

const SigninPage = () => {
  return (
    <main className="grid min-h-svh overflow-hidden bg-[#f5efe3] lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
      <section className="relative hidden min-h-svh lg:block">
        <img
          src={signinImg}
          alt="Không gian khách sạn Thousand Stars"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0d2430]/45" />
        <div className="relative z-10 flex h-full max-w-3xl flex-col justify-center px-12 text-white xl:px-16">
          <div className="flex items-baseline gap-3">
            <span className="font-['Lora'] text-4xl uppercase tracking-[0.12em]">
              Thousand Stars
            </span>
            <span className="text-xs uppercase tracking-[0.28em] text-white/75">
              Hotels
            </span>
          </div>
          <div className="mt-8 max-w-xl font-['Lora'] text-4xl leading-tight">
            <p>Một nơi nghỉ dưỡng,</p>
            <p className="italic text-[#d2a65a]">vạn lần ấn tượng.</p>
          </div>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/80">
            Đăng nhập để tiếp tục đặt phòng, xem lịch sử và quản lý thông tin lưu trú của bạn.
          </p>
        </div>
      </section>

      <section className="flex min-h-svh flex-col px-5 py-6 sm:px-8 lg:px-10">
        <Link
          to="/homepage"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#52483C]/15 bg-white/70 px-4 py-2 text-sm font-semibold text-[#52483C] shadow-sm transition hover:bg-white"
        >
          <ArrowLeft className="size-4" />
          Quay về trang chủ
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-[#52483C]/10 backdrop-blur sm:p-8">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SigninPage;
