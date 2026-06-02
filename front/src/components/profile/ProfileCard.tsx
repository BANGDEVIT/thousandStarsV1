import React from "react";

// Định nghĩa kiểu dữ liệu cho Props để quản lý code chặt chẽ
interface ProfileCardProps {
  user: {
    name: string;
    gender: string;
    nationality: string;
    dob: string;
    phone: string;
    email: string;
    address: string;
    avatarUrl?: string;
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center w-full h-full">
      
      {/* KHỐI AVATAR & THÔNG TIN CHÍNH */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 w-full">
        {/* Khối tròn xanh bọc ngoài avatar giống mockup */}
        <div className="w-28 h-28 rounded-full bg-[#3B82F6] overflow-hidden flex items-center justify-center mb-4 shadow-inner">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            // Fallback nếu không có ảnh
            <span className="text-white text-3xl font-semibold">
              {user.name.charAt(0)}
            </span>
          )}
        </div>
        
        {/* Tên & Quốc tịch */}
        <h3 className="text-xl font-bold text-gray-800 tracking-wide mb-1">
          {user.name}
        </h3>
        <p className="text-xs text-gray-400 font-medium">
          {user.gender} • {user.nationality}
        </p>
      </div>

      {/* KHỐI DANH SÁCH THÔNG TIN CHI TIẾT */}
      <div className="w-full flex-1 flex flex-col justify-center pt-2">
        
        {/* Dòng: Ngày sinh */}
        <div className="flex justify-between items-center py-3.5 border-b border-gray-100 text-sm">
          <span className="text-gray-400 font-normal">Date of Birth</span>
          <span className="text-gray-700 font-medium text-right">{user.dob}</span>
        </div>

        {/* Dòng: Số điện thoại */}
        <div className="flex justify-between items-center py-3.5 border-b border-gray-100 text-sm">
          <span className="text-gray-400 font-normal">Phone Number</span>
          <span className="text-gray-700 font-medium text-right">{user.phone}</span>
        </div>

        {/* Dòng: Email */}
        <div className="flex justify-between items-center py-3.5 border-b border-gray-100 text-sm">
          <span className="text-gray-400 font-normal">Email Address</span>
          <span className="text-gray-700 font-medium text-right break-all max-w-[60%]">
            {user.email}
          </span>
        </div>

        {/* Dòng: Địa chỉ */}
        <div className="flex justify-between items-center py-3.5 text-sm last:border-0">
          <span className="text-gray-400 font-normal">Address</span>
          <span className="text-gray-700 font-medium text-right max-w-[60%]">
            {user.address}
          </span>
        </div>

      </div>
    </div>
  );
}