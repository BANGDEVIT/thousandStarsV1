import { useAuthStore } from "@/stores/useAuthStore"
import { useProfileStore } from "@/stores/useProfileStore"

export function LoadingOverlay() {
  const authLoading = useAuthStore((s) => s.loading)
  const profileLoading = useProfileStore((s) => s.loading)

  const isLoading = authLoading || profileLoading

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="w-10 h-10 rounded-full border-4 border-[#E5DAC2] border-t-[#101953] animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Đang xử lý...</p>
      </div>
    </div>
  )
}