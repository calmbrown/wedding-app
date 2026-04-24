"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const BASE_PATH = process.env.NODE_ENV === "production" ? "/wedding-app" : "";

const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL ?? "";

const PHOTOS = [
  "KakaoTalk_Photo_2026-04-24-09-32-25 001.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-27 002.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-29 003.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-30 004.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-31 005.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-31 006.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-31 007.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-33 007.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-33 008.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-34 009.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-36 010.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-37 011.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-39 012.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-40 013.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-43 016.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-44 017.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-46 018.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-47 019.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-47 020.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-48 021.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-49 024.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-50 022.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-51 014.jpeg",
  "KakaoTalk_Photo_2026-04-24-09-32-52 015.jpeg",
].map((f) => `${BASE_PATH}/${f}`);

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
    const weddingDay = new Date(2026, 5, 21);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((weddingDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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

function RsvpForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [side, setSide] = useState<"groom" | "bride" | "">("");
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !side || !attending) return;
    setStatus("loading");
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ name, phone, side: side === "groom" ? "신랑측" : "신부측", attending, guests: attending === "yes" ? guests : 0, message }),
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-2xl">🤍</p>
        <p className="text-sm text-stone-600 font-light">참석 여부가 전달되었습니다.</p>
        <p className="text-xs text-stone-400">감사합니다, {name}님.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-[10px] text-stone-400 tracking-wider block mb-1.5">성함</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해주세요"
          required
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 outline-none focus:border-stone-400"
        />
      </div>

      <div>
        <label className="text-[10px] text-stone-400 tracking-wider block mb-1.5">연락처</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
            if (digits.length <= 3) setPhone(digits);
            else if (digits.length <= 7) setPhone(`${digits.slice(0, 3)}-${digits.slice(3)}`);
            else setPhone(`${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`);
          }}
          placeholder="010-0000-0000"
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 outline-none focus:border-stone-400"
        />
      </div>

      <div>
        <label className="text-[10px] text-stone-400 tracking-wider block mb-1.5">구분</label>
        <div className="grid grid-cols-2 gap-2">
          {(["groom", "bride"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setSide(v)}
              className={`py-3 rounded-xl text-sm border transition-colors ${
                side === v
                  ? "bg-stone-800 text-white border-stone-800"
                  : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
              }`}
            >
              {v === "groom" ? "신랑측" : "신부측"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-stone-400 tracking-wider block mb-1.5">참석 여부</label>
        <div className="grid grid-cols-2 gap-2">
          {(["yes", "no"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAttending(v)}
              className={`py-3 rounded-xl text-sm border transition-colors ${
                attending === v
                  ? "bg-stone-800 text-white border-stone-800"
                  : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
              }`}
            >
              {v === "yes" ? "참석합니다" : "불참합니다"}
            </button>
          ))}
        </div>
      </div>

      {attending === "yes" && (
        <div>
          <label className="text-[10px] text-stone-400 tracking-wider block mb-1.5">참석 인원</label>
          <div className="flex items-center gap-4 border border-stone-200 rounded-xl px-4 py-3">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 text-lg leading-none"
            >−</button>
            <span className="flex-1 text-center text-sm text-stone-700">{guests}명</span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(10, g + 1))}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 text-lg leading-none"
            >+</button>
          </div>
        </div>
      )}

      <div>
        <label className="text-[10px] text-stone-400 tracking-wider block mb-1.5">축하 메시지 (선택)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="따뜻한 한 마디를 남겨주세요"
          rows={3}
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 placeholder:text-stone-300 outline-none focus:border-stone-400 resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400 text-center">전송 중 오류가 발생했습니다. 다시 시도해주세요.</p>
      )}

      <button
        type="submit"
        disabled={!name || !attending || status === "loading"}
        className="w-full py-3.5 rounded-xl bg-stone-800 text-white text-sm tracking-wider hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "전송 중…" : "전달하기"}
      </button>
    </form>
  );
}

function Lightbox({ photos, index, onClose }: {
  photos: string[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setCurrent((c) => Math.min(c + 1, photos.length - 1));
      if (e.key === "ArrowUp") setCurrent((c) => Math.max(c - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, photos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 1) { e.preventDefault(); return; }
    if (touchStartY.current === null) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    const atTop = current === 0 && dy > 0;
    const atBottom = current === photos.length - 1 && dy < 0;
    setDragY(atTop || atBottom ? dy * 0.15 : dy);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartY.current = null;
    setIsDragging(false);
    setDragY(0);

    if (dy < -55) {
      if (current < photos.length - 1) setCurrent((c) => c + 1);
      else onClose();
    } else if (dy > 55 && current > 0) {
      setCurrent((c) => c - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      style={{ touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-10 text-white/80 hover:text-white p-2"
        aria-label="닫기"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="fixed bottom-5 left-0 right-0 z-10 text-center text-white/40 text-xs pointer-events-none">
        {current + 1} / {photos.length}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(calc(${-current * 100}vh + ${dragY}px))`,
          transition: isDragging ? "none" : "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {photos.map((src, i) => (
          <div
            key={i}
            style={{ position: "absolute", top: `${i * 100}vh`, width: "100%", height: "100vh" }}
            className="flex items-center justify-center"
          >
            <Image
              src={src}
              alt={`웨딩 사진 ${i + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WeddingPage() {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsMobile(/Android|iPhone|iPad|iPod|Mobile/i.test(ua));
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    script.async = true;
    script.onload = () => {
      const kakao = (window as any).Kakao;
      if (kakao && !kakao.isInitialized()) {
        kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
      }
    };
    document.head.appendChild(script);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const visiblePhotos = showAllPhotos ? PHOTOS : PHOTOS.slice(0, 9);

  if (isMobile === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-8 text-center">
        <p className="text-3xl mb-6">📱</p>
        <h1 className="text-lg font-medium text-stone-700 tracking-wider mb-3">모바일에서 열어주세요</h1>
        <p className="text-sm text-stone-400 font-light leading-relaxed">
          이 청첩장은 모바일 환경에 최적화되어 있습니다.<br />
          스마트폰으로 접속해 주세요.
        </p>
      </div>
    );
  }

  if (isMobile === null) return null;

  return (
    <>
    {lightboxIndex !== null && (
      <Lightbox
        photos={PHOTOS}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    )}
    <main className="max-w-[480px] mx-auto bg-white min-h-screen">

      {/* ── 메인 커버 ── */}
      <section className="relative h-screen flex flex-col items-center justify-end pb-16 overflow-hidden">
        <Image
          src={`${BASE_PATH}/og-image-v3.jpeg`}
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
              <p className="text-sm text-stone-400 font-light">서울 양천구 오목로 344 청학빌딩 10F</p>
            </div>
            <div className="flex justify-center">
              <DDay />
            </div>
          </div>
        </FadeSection>

        <Divider />

        {/* ── 지도 ── */}
        <FadeSection>
          <div id="location" className="space-y-4">
            <p className="text-[10px] tracking-[0.35em] text-stone-400 text-center">LOCATION</p>

            {/* 약도 */}
            <div className="rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
              <Image
                src={`${BASE_PATH}/LoftGarden344-map.png`}
                alt="로프트가든344 약도"
                width={480}
                height={340}
                className="w-full h-auto"
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
                onClick={() => copyToClipboard("서울 양천구 오목로 344 청학빌딩 10F", "address")}
                className="flex-1 py-3 text-center text-xs bg-stone-100 text-stone-600 rounded-xl font-medium hover:bg-stone-200 transition-colors tracking-wide"
              >
                {copied === "address" ? "복사됨 ✓" : "주소 복사"}
              </button>
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 space-y-4 text-sm font-light">
              <p className="text-[10px] font-medium text-stone-400 tracking-[0.2em]">교통 안내</p>
              <div className="space-y-1">
                <p className="text-[10px] font-medium text-stone-500 tracking-wider">🚇 지하철</p>
                <p className="text-xs text-stone-400">5호선 오목교역 7번 출구 앞</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-stone-500 tracking-wider">🚌 버스</p>
                <div className="space-y-1 text-xs text-stone-400">
                  <p><span className="text-stone-500">4번 출구</span>  5012, 5616, 6211, 640, 650, 6625, 6628, 6629, 6630, N64</p>
                  <p><span className="text-stone-500">5번 출구</span>  5012, 6211, 640, 650, 6628, 6629, 6630, 6640A, N64</p>
                  <p><span className="text-stone-500">6번 출구</span>  6640A</p>
                  <p><span className="text-stone-500">7번 출구</span>  6624, 6640B</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-stone-500 tracking-wider">🚗 자가용</p>
                <div className="space-y-1 text-xs text-stone-400">
                  <p><span className="text-stone-500">전용주차장</span>  청학빌딩 (2시간 무료)</p>
                  <p><span className="text-stone-500">공영주차장</span>  목동동로 298 (3시간 무료 · 800대)</p>
                </div>
              </div>
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
                  onClick={() => setLightboxIndex(i)}
                  className="aspect-square overflow-hidden relative focus:outline-none"
                  aria-label={`웨딩 사진 ${i + 1} 크게 보기`}
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

        {/* ── 참석 여부 ── */}
        <FadeSection>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-[10px] tracking-[0.35em] text-stone-400">RSVP</p>
              <p className="text-sm text-stone-500 font-light leading-relaxed">
                참석 여부를 알려주시면<br />더욱 감사하겠습니다.
              </p>
            </div>
            <RsvpForm />
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
                { label: "신부", name: "김지현", phone: "010-9671-4004" },
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
          </div>
        </FadeSection>

        {/* ── 카카오 공유 ── */}
        <div className="pb-10 flex justify-center">
          <button
            onClick={() => {
              const kakao = (window as any).Kakao;
              if (!kakao?.isInitialized()) return;
              kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                  title: "김태민 ♥ 김지현 결혼합니다.",
                  description: "2026년 6월 21일 (일) 오후 3시 30분 · 로프트가든344",
                  imageUrl: "https://calmbrown.github.io/wedding-app/og-image-v3.jpeg",
                  link: {
                    mobileWebUrl: "https://calmbrown.github.io/wedding-app",
                    webUrl: "https://calmbrown.github.io/wedding-app",
                  },
                },
                buttons: [
                  {
                    title: "청첩장 보기",
                    link: {
                      mobileWebUrl: "https://calmbrown.github.io/wedding-app",
                      webUrl: "https://calmbrown.github.io/wedding-app",
                    },
                  },
                  {
                    title: "위치 안내",
                    link: {
                      mobileWebUrl: "https://calmbrown.github.io/wedding-app#location",
                      webUrl: "https://calmbrown.github.io/wedding-app#location",
                    },
                  },
                ],
              });
            }}
            className="flex items-center gap-2 bg-[#FEE500] text-[#3C1E1E] px-6 py-3 rounded-2xl text-sm font-medium hover:bg-yellow-300 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.632 1.598 4.942 4 6.318V21l3.5-2.5c.822.13 1.662.2 2.5.2 5.523 0 10-3.477 10-7.7C22 6.477 17.523 3 12 3z"/>
            </svg>
            카카오톡 공유
          </button>
        </div>

        {/* 푸터 */}
        <div className="text-center pb-12 text-[10px] text-stone-300 font-light tracking-[0.2em]">
          <p>김태민  ♥  김지현</p>
          <p className="mt-1">2026. 06. 21</p>
        </div>

      </div>

    </main>
    </>
  );
}
