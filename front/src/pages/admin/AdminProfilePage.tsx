import { useState } from "react";
import { FileText, Eye, EyeOff, CheckCircle } from "lucide-react";

interface ProfileData {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
}

const defaultProfile: ProfileData = {
  lastName: "Bùi Công",
  firstName: "Bằng",
  email: "hotel@gmail.com",
  phone: "0123456789",
  gender: "Nam",
  dob: "01/02/2005",
  address: "123 Đường Lê Lợi, Quận 1, TP. HCM",
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwEmail, setPwEmail] = useState("hotel@gmail.com");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSavePw = () => {
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2000);
    setCurrentPw("");
    setNewPw("");
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <span>🏠</span>
        <span>Bảng điều khiển</span>
        <span>&gt;</span>
        <span className="text-slate-600 font-medium">Hồ sơ cá nhân</span>
      </nav>

      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold">
          <span className="text-[#1a2744]">Hồ sơ </span>
          <span className="text-[#c9a227]">cá nhân</span>
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.
        </p>
      </div>

      {/* Cover / Avatar card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Gradient banner */}
        <div className="h-28 bg-gradient-to-r from-[#1a2744] via-[#2d4a7a] to-[#c9a227]" />
        <div className="px-6 pb-5 relative">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#c9a227] flex items-center justify-center text-white text-2xl font-bold border-4 border-white absolute -top-8 left-6 shadow-md">
            B
          </div>
          <div className="pl-20 pt-2 flex items-center gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-bold text-[#1a2744]">
                {profile.lastName} {profile.firstName}
              </h3>
              <div className="flex items-center gap-4 mt-0.5">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  ✉️ {profile.email}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  📞 {profile.phone}
                </span>
              </div>
            </div>
            <span className="ml-auto border border-[#c9a227] text-[#c9a227] text-xs px-3 py-1 rounded-full font-medium">
              Quản trị viên
            </span>
          </div>
        </div>
      </div>

      {/* Two-column form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold text-[#1a2744] mb-0.5">Thông tin cái nhân</h4>
          <p className="text-xs text-slate-400 mb-5">
            Cập nhật chi tiết hồ sơ. Mã nhân viên và quyền truy cập không thể tự thay đổi.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Họ</label>
              <input
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Tên</label>
              <input
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Email</label>
              <input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Số điện thoại</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Giới tính</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className={inputCls}
              >
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Ngày sinh</label>
              <input
                type="text"
                value={profile.dob}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                className={inputCls}
                placeholder="DD/MM/YYYY"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs text-slate-500 mb-1">Địa chỉ</label>
            <input
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className={inputCls}
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-[#1a2744] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#243156] transition-colors flex items-center justify-center gap-2"
          >
            {profileSaved ? (
              <><CheckCircle size={15} className="text-green-400" /> Đã lưu!</>
            ) : (
              <><FileText size={15} /> Lưu thông tin</>
            )}
          </button>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-lg">🔑</span>
            <h4 className="font-semibold text-[#1a2744]">Đổi mật khẩu</h4>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Sử dụng mật khẩu mạnh, tối thiểu 8 ký tự, có ký tự in hoa, thường, đặc biệt, số.
          </p>

          <div className="mb-3">
            <label className="block text-xs text-slate-500 mb-1">Email</label>
            <input
              value={pwEmail}
              onChange={(e) => setPwEmail(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs text-slate-500 mb-1">Mật khẩu hiện</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className={inputCls + " pr-10"}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs text-slate-500 mb-1">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className={inputCls + " pr-10"}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSavePw}
            className="w-full bg-[#1a2744] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#243156] transition-colors flex items-center justify-center gap-2"
          >
            {pwSaved ? (
              <><CheckCircle size={15} className="text-green-400" /> Đã đổi!</>
            ) : (
              "Đổi lại mật khẩu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4a90d9]/30 focus:border-[#4a90d9] transition-all";
