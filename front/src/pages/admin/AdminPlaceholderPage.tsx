type Props = {
  title: string;
  description?: string;
};

export default function AdminPlaceholderPage({ title, description }: Props) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm max-w-xl">
      <h2 className="text-2xl font-bold text-[#1a2744]">{title}</h2>
      <p className="text-sm text-slate-500 mt-2">
        {description ?? "Trang đang được phát triển. Bạn có thể nối API sau."}
      </p>
    </div>
  );
}
