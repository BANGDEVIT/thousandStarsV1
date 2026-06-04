import { LoginForm } from "@/components/features/login-comp/login-form";
import { ArrowLeft } from "lucide-react";
import signinImg from "@/assets/signin.png";

const SigninPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-[60%_40%]">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={signinImg}
          alt="Signin"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute top-[25%] left-10 flex flex-col gap-6 text-white">
          {/* Brand name */}
          <div className="flex items-baseline gap-3">
            <span
              className="text-4xl tracking-[0.15em] uppercase"
              style={{ fontFamily: "'Lora', 'Georgia', serif", fontWeight: 400 }}
            >
              Thousand-Star
            </span>
            <span
              className="text-xs tracking-[0.3em] uppercase opacity-75"
              style={{ fontFamily: "sans-serif", fontWeight: 400 }}
            >
              Hotels
            </span>
          </div>

          {/* Tagline */}
          <div
            className="flex flex-col gap-1 leading-snug items-start"
            style={{ fontFamily: "'Lora', 'Georgia', serif" }}
          >
            <span className="text-3xl font-normal">Một nơi nghỉ dưỡng,</span>
            <span
              className="text-3xl italic"
              style={{ color: "#D4A85A" }}
            >
              vạn lần ấn tượng.
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-[#E5DAC2]">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="w-full flex justify-start gap-2">
            <a href="#" className="flex items-center gap-2 font-medium self-start">
              <div className="flex size-6 items-center justify-center rounded-md bg-[#E5DAC2] !text-[#52483C] text-primary-foreground">
                <ArrowLeft className="size-4" />
              </div>
              <span className="font-['Lora'] text-[#52483C]">Quay về trang chủ</span>
            </a>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
};

export default SigninPage;
