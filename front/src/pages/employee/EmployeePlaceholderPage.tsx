type Props = {
  title: string;
};

export default function EmployeePlaceholderPage({ title }: Props) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm max-w-xl">
      <p className="text-xs text-slate-400 mb-1">Nhân viên &gt; {title}</p>
      <h2 className="text-2xl font-bold text-[#1a2744]">{title}</h2>
      <p className="text-sm text-slate-500 mt-2">Trang đang được phát triển.</p>
    </div>
  );
}
