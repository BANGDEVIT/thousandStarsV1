import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center">
      <h1 className="text-3xl font-semibold text-white">Không có quyền truy cập</h1>
      <p className="max-w-md text-slate-400">
        Tài khoản của bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link to="/admin">Về dashboard</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/signin">Đăng nhập</Link>
        </Button>
        <Button asChild>
          <Link to="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
