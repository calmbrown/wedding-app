"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const PHOTOS = Array.from({ length: 30 }, (_, i) => {
  const num = String(i + 1).padStart(3, "0");
  const timestamps: Record<string, string> = {
    "001": "2026-04-20-14-01-49",
    "002": "2026-04-20-14-01-49",
    "003": "2026-04-20-14-01-49",
    "004": "2026-04-20-14-01-49",
    "005": "2026-04-20-14-01-50",
    "006": "2026-04-20-14-01-50",
    "007": "2026-04-20-14-01-50",
    "008": "2026-04-20-14-01-51",
    "009": "2026-04-20-14-01-51",
    "010": "2026-04-20-14-01-51",
    "011": "2026-04-20-14-01-52",
    "012": "2026-04-20-14-01-52",
    "013": "2026-04-20-14-01-52",
    "014": "2026-04-20-14-01-52",
    "015": "2026-04-20-14-01-53",
    "016": "2026-04-20-14-01-53",
    "017": "2026-04-20-14-01-53",
    "018": "2026-04-20-14-01-54",
    "019": "2026-04-20-14-01-54",
    "020": "2026-04-20-14-01-54",
    "021": "2026-04-20-14-01-54",
    "022": "2026-04-20-14-01-55",
    "023": "2026-04-20-14-01-55",
    "024": "2026-04-20-14-01-55",
    "025": "2026-04-20-14-01-55",
    "026": "2026-04-20-14-01-56",
    "027": "2026-04-20-14-01-56",
    "028": "2026-04-20-14-01-56",
    "029": "2026-04-20-14-01-56",
    "030": "2026-04-20-14-01-56",
  };
  return `/KakaoTalk_Photo_${timestamps[num]} ${num}.jpeg`;
});

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function FadeSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-10">
      <div className="w-12 h-px bg-stone-200" />
      <div className="text-stone-300 text-xs">✦</div>
      <div className="w-12 h-px bg-stone-200" />
    </div>
  );
}

function DDay() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const wedding = new Date("2026-06-21T15:30:00+09:00");
    const today = new Date();
    const diff = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDays(diff);
  }, []);

  if (days === null) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-stone-50 rounded-2xl px-6 py-3">
      <span className="text-stone-400 text-sm font-light">결혼식까지</span>
      <span className="text-2xl font-light text-stone-800">
        {days > 0 ? `D-${days}` : days === 0 ? "D-DAY" : `D+${Math.abs(days)}`}
      </span>
    </div>
  );
}

export default function WeddingPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((p) => (p !== null ? (p + 1) % PHOTOS.length : null));
      if (e.key === "ArrowLeft") setLightbox((p) => (p !== null ? (p - 1 + PHOTOS.length) % PHOTOS.length : null));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  const visiblePhotos = showAllPhotos ? PHOTOS : PHOTOS.slice(0, 9);

  return (
    <main className="max-w-[480px] mx-auto bg-white min-h-screen">

      {/* ── 메인 커버 ── */}
      <section className="relative h-screen flex flex-col items-center justify-end pb-16 overflow-hidden">
        <Image
          src={PHOTOS[0]}
          alt="커버 사진"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
        <div className="relative z-10 text-center text-white">
          <p className="text-xs tracking-[0.35em] mb-5 opacity-75">WEDDING INVITATION</p>
          <h1 className="text-4xl font-light tracking-[0.25em] mb-4">
            태민 <span className="text-2xl opacity-60 mx-1">♥</span> 지현
          </h1>
          <p className="text-sm tracking-[0.2em] opacity-90">2026. 06. 21  Sun  15 : 30</p>
          <p className="text-xs tracking-[0.2em] mt-2 opacity-65">로프트가든344</p>
        </div>
      </section>

      <div className="px-6">

        <Divider />

        {/* ── 인사말 ── */}
        <FadeSection>
          <div className="text-center space-y-6">
            <p className="text-[10px] tracking-[0.35em] text-stone-400">GREETING</p>
            <h2 className="text-xl font-light text-stone-700 tracking-wider">저희 결혼합니다</h2>
            <p className="text-sm leading-[2.2] text-stone-500 font-light">
              서로 다른 길을 걷다 같은 곳을 바라보게 된<br />
              두 사람이 이제 하나의 길을 걷고자 합니다.<br />
              <br />
              소중한 분들을 모시고<br />
              그 첫걸음을 내딛으려 합니다.<br />
              <br />
              기쁜 날 함께해 주시면<br />
              더없는 기쁨이 되겠습니다.
            </p>
            <div className="pt-4">
              <div className="flex justify-center gap-10 text-sm text-stone-600">
                <div className="text-center">
                  <p className="text-[10px] text-stone-400 tracking-wider mb-2">신랑측</p>
                  <p className="font-light text-xs text-stone-400 mb-1">김학정 · 유영임의 아들</p>
                  <p className="text-base font-medium tracking-widest">김 태 민</p>
                </div>
                <div className="text-stone-200 self-center text-xl">|</div>
                <div className="text-center">
                  <p className="text-[10px] text-stone-400 tracking-wider mb-2">신부측</p>
                  <p className="font-light text-xs text-stone-400 mb-1">김용섭 · 강외숙의 딸</p>
                  <p className="text-base font-medium tracking-widest">김 지 현</p>
                </div>
              </div>
            </div>
          </div>
        </FadeSection>

        <Divider />

        {/* ── 날짜/장소 ── */}
        <FadeSection>
          <div className="text-center space-y-6">
            <p className="text-[10px] tracking-[0.35em] text-stone-400">DATE &amp; VENUE</p>
            <div className="space-y-2">
              <p className="text-3xl font-light text-stone-800 tracking-wider">2026. 06. 21</p>
              <p className="text-sm text-stone-500 font-light tracking-wider">일요일 오후 3시 30분</p>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-8 bg-stone-200" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-stone-700 tracking-wider">로프트가든344</p>
              <p className="text-sm text-stone-400 font-light">서울 양천구 오목로 344 청학빌딩 10층</p>
            </div>
            <div className="flex justify-center">
              <DDay />
            </div>
          </div>
        </FadeSection>

        <Divider />

        {/* ── 지도 ── */}
        <FadeSection>
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.35em] text-stone-400 text-center">LOCATION</p>
            <div className="rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=서울+양천구+오목로+344+청학빌딩&output=embed&z=16&hl=ko"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="로프트가든344 위치"
              />
            </div>
            <div className="flex gap-2">
              <a
                href="https://map.kakao.com/link/search/서울 양천구 오목로 344 청학빌딩"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 text-center text-xs bg-yellow-400 text-yellow-900 rounded-xl font-medium hover:bg-yellow-500 transition-colors tracking-wide"
              >
                카카오맵
              </a>
              <a
                href="https://map.naver.com/v5/search/서울 양천구 오목로 344 청학빌딩"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 text-center text-xs bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors tracking-wide"
              >
                네이버지도
              </a>
              <button
                onClick={() => copyToClipboard("서울 양천구 오목로 344 청학빌딩 10층", "address")}
                className="flex-1 py-3 text-center text-xs bg-stone-100 text-stone-600 rounded-xl font-medium hover:bg-stone-200 transition-colors tracking-wide"
              >
                {copied === "address" ? "복사됨 ✓" : "주소 복사"}
              </button>
            </div>
            <div className="bg-stone-50 rounded-2xl p-5 space-y-2.5 text-sm text-stone-500 font-light">
              <p className="text-[10px] font-medium text-stone-400 tracking-[0.2em] mb-3">교통 안내</p>
              <p>🚇 지하철 5호선 오목교역 2번 출구 도보 5분</p>
              <p>🚌 버스 605, 606, 640번 오목교 하차</p>
              <p>🚗 주차 청학빌딩 지하주차장 (2시간 무료)</p>
            </div>
          </div>
        </FadeSection>

        <Divider />

        {/* ── 갤러리 ── */}
        <FadeSection>
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.35em] text-stone-400 text-center">GALLERY</p>
            <div className="grid grid-cols-3 gap-0.5 rounded-xl overflow-hidden">
              {visiblePhotos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(i)}
                  className="aspect-square overflow-hidden relative hover:opacity-90 transition-opacity"
                >
                  <Image
                    src={src}
                    alt={`웨딩 사진 ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 480px) 33vw, 160px"
                  />
                </button>
              ))}
            </div>
            {!showAllPhotos && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="w-full py-3 text-xs text-stone-500 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors tracking-wider"
              >
                사진 더 보기 ({PHOTOS.length - 9}장 더)
              </button>
            )}
          </div>
        </FadeSection>

        <Divider />

        {/* ── 연락하기 ── */}
        <FadeSection>
          <div className="space-y-6 pb-16">
            <p className="text-[10px] tracking-[0.35em] text-stone-400 text-center">CONTACT</p>
            <div className="space-y-3">
              {[
                { label: "신랑", name: "김태민", phone: "010-8944-4228" },
                { label: "신부", name: "김지현", phone: "010-9671-4228" },
              ].map(({ label, name, phone }) => (
                <div key={label} className="flex items-center justify-between bg-stone-50 rounded-2xl px-5 py-4">
                  <div>
                    <p className="text-[10px] text-stone-400 tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-stone-700 tracking-wider">{name}</p>
                    <p className="text-xs text-stone-400 font-light mt-0.5">{phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${phone.replace(/-/g, "")}`}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:bg-stone-100 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.09-1.09a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </a>
                    <a
                      href={`sms:${phone.replace(/-/g, "")}`}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:bg-stone-100 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* 축의금 계좌 */}
            <div className="space-y-3 pt-2">
              <p className="text-[10px] tracking-[0.35em] text-stone-400 text-center">ACCOUNT</p>
              {[
                { label: "신랑", name: "김태민", bank: "카카오뱅크", account: "3333-16-7532049" },
                { label: "신랑 부", name: "김학정", bank: "국민은행", account: "계좌번호 준비 중" },
                { label: "신랑 모", name: "유영임", bank: "국민은행", account: "계좌번호 준비 중" },
                { label: "신부", name: "김지현", bank: "카카오뱅크", account: "3333-25-5432228" },
                { label: "신부 부", name: "김용섭", bank: "국민은행", account: "계좌번호 준비 중" },
                { label: "신부 모", name: "강외숙", bank: "국민은행", account: "계좌번호 준비 중" },
              ].map(({ label, name, bank, account }) => (
                <div key={label} className="flex items-center justify-between border border-stone-100 rounded-2xl px-5 py-3.5">
                  <div>
                    <p className="text-[10px] text-stone-400 tracking-wider">{label} · {name}</p>
                    <p className="text-sm text-stone-600 font-light mt-0.5">{bank}  {account}</p>
                  </div>
                  {!account.includes("준비") && (
                    <button
                      onClick={() => copyToClipboard(account, account)}
                      className="text-[10px] text-stone-400 border border-stone-200 rounded-lg px-3 py-1.5 hover:bg-stone-50 transition-colors whitespace-nowrap tracking-wide"
                    >
                      {copied === account ? "✓" : "복사"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeSection>

        {/* 푸터 */}
        <div className="text-center pb-12 text-[10px] text-stone-300 font-light tracking-[0.2em]">
          <p>김태민  ♥  김지현</p>
          <p className="mt-1">2026. 06. 21</p>
        </div>

      </div>

      {/* ── 라이트박스 ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center text-2xl"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl w-12 h-12 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p! - 1 + PHOTOS.length) % PHOTOS.length); }}
          >
            ‹
          </button>
          <div
            className="relative w-full max-w-sm mx-12 aspect-[3/4]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={PHOTOS[lightbox]}
              alt={`사진 ${lightbox + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl w-12 h-12 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p! + 1) % PHOTOS.length); }}
          >
            ›
          </button>
          <p className="absolute bottom-5 text-white/40 text-xs tracking-widest">
            {lightbox + 1} / {PHOTOS.length}
          </p>
        </div>
      )}
    </main>
  );
}
