export type Hotel = {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: string;
  img: string;
  desc: string;
  amenities: string[];
  noiBat?: boolean;
  badge?: string | null;
};

export const HOTELS: Hotel[] = [
  {
    id: 1,
    name: "NHA TRANG",
    location: "KHÁNH HÒA",
    price: "1.350K",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    desc: "Một thánh đường của sự tĩnh lặng và sang trọng ven biển. Thousand Stars mang đến trải nghiệm nghỉ dưỡng qua những khu vườn hùng vĩ và không gian riêng tư.",
    amenities: ["🏊", "💆", "🌊"],
    badge: "BỘ SƯU TẬP MỚI",
  },
  {
    id: 2,
    name: "ĐÀ NẴNG",
    location: "ĐÀ NẴNG",
    price: "880K",
    rating: "4.7",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    desc: "Trải nghiệm sự yên bình bên bờ biển Miền Trung. Dinh thự boutique sở hữu điểm nhìn đẹp, được bao quanh bởi không gian xanh.",
    amenities: ["🏊", "🍷", "📷"],
    badge: null,
  },
  {
    id: 3,
    name: "HA LONG BAY",
    location: "QUẢNG NINH",
    price: "2.450K",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
    desc: "Tọa lạc giữa vịnh di sản thế giới, khu nghỉ dưỡng mang đến tầm nhìn tuyệt mỹ ra biển. Dinh thự được phục hồi tỉ mỉ với các tiện nghi hiện đại.",
    amenities: ["🏊", "📶", "🍳"],
    noiBat: true,
    badge: null,
  },
];

export function getHotelById(id: string | number | undefined): Hotel | undefined {
  if (id === undefined || id === "") return undefined;
  const n = typeof id === "string" ? Number(id) : id;
  if (Number.isNaN(n)) return undefined;
  return HOTELS.find((h) => h.id === n);
}

export function hotelDetailPath(id: number) {
  return `/hotels/${id}`;
}
