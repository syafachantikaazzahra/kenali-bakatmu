import React, { useState, useRef, useEffect, useCallback } from "react";
import { Eye, Ear, Hand, BookOpen, User, Users, ArrowRight, RotateCcw, Flame } from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from "recharts";

/* ============================================================
   DESIGN TOKENS — "Lampu Baca" (reading lamp at night)
   ============================================================ */
const T = {
  bgDeep: "#0F0B24",
  bgMid: "#161033",
  surface: "#1D1740",
  surfaceSoft: "#221B49",
  border: "#332B5E",
  borderSoft: "#2A2350",
  text: "#F4F1FF",
  muted: "#9D93C4",
  lamp: "#F4B860",
  lampSoft: "rgba(244,184,96,0.16)",
  display: "'Fraunces', Georgia, serif",
  body: "'Manrope', 'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const STYLES = [
  { key: "visual", label: "Visual", color: "#5EEAD4", Icon: Eye,
    desc: "Kamu menyerap informasi paling cepat lewat hal yang bisa dilihat — warna, bentuk, dan tata letak menempel di ingatanmu.",
    tips: ["Ubah catatan jadi mind map atau diagram", "Tandai poin penting dengan warna berbeda", "Tonton video atau infografis sebelum baca teks"] },
  { key: "auditori", label: "Auditori", color: "#FCA5A5", Icon: Ear,
    desc: "Kamu paling mudah paham saat mendengar — penjelasan lisan, diskusi, dan suara membantumu mengingat lebih lama.",
    tips: ["Rekam materi lalu dengarkan ulang", "Baca catatan dengan suara keras", "Cari podcast atau kuliah audio tentang topiknya"] },
  { key: "kinestetik", label: "Kinestetik", color: "#FB923C", Icon: Hand,
    desc: "Kamu belajar paling efektif lewat gerakan dan praktik langsung, bukan cuma duduk diam membaca teori.",
    tips: ["Praktikkan langsung begitu dapat teori baru", "Belajar sambil berjalan atau berdiri", "Gunakan model fisik / simulasi, bukan cuma teks"] },
  { key: "membaca", label: "Membaca/Menulis", color: "#93C5FD", Icon: BookOpen,
    desc: "Kamu mengandalkan teks — membaca dan menuliskan ulang sesuatu adalah caramu menguasai materi.",
    tips: ["Buat ringkasan dengan kata-katamu sendiri", "Tulis ulang catatan kuliah setelah kelas", "Susun daftar & poin-poin terstruktur"] },
  { key: "mandiri", label: "Belajar Mandiri", color: "#C4B5FD", Icon: User,
    desc: "Kamu paling fokus saat belajar sendirian, dengan kecepatan dan ruangmu sendiri tanpa gangguan.",
    tips: ["Atur jadwal belajar sendiri yang realistis", "Cari ruang tenang bebas distraksi", "Tetapkan target pribadi tiap sesi belajar"] },
  { key: "kelompok", label: "Belajar Kelompok", color: "#86EFAC", Icon: Users,
    desc: "Kamu berkembang lewat diskusi — bertukar ide dan mengajarkan orang lain membuat materi makin nempel.",
    tips: ["Gabung atau bentuk kelompok belajar kecil", "Coba ajarkan materi ke teman", "Aktif tanya-jawab saat diskusi kelas"] },
];

const QUESTIONS = [
  { q: "Saat belajar materi baru, kamu paling mudah paham kalau...", order: ["visual","auditori","kinestetik","membaca","mandiri","kelompok"],
    text: { visual:"melihat diagram, grafik, atau infografisnya", auditori:"mendengar penjelasan lisan atau podcast", kinestetik:"langsung mencoba praktik atau simulasi", membaca:"membaca buku teks atau catatan tertulis", mandiri:"mempelajarinya sendiri dengan kecepatan sendiri", kelompok:"mendiskusikannya bareng teman" } },
  { q: "Saat harus mengingat arah jalan, kamu lebih suka...", order: ["membaca","kelompok","visual","kinestetik","auditori","mandiri"],
    text: { visual:"melihat peta atau sketsa rute", auditori:"mendengar arahan lisan", kinestetik:"berjalan & merasakan rutenya langsung", membaca:"membaca instruksi tertulis langkah demi langkah", mandiri:"mencari sendiri tanpa banyak bertanya", kelompok:"bertanya & berdiskusi dengan orang sekitar" } },
  { q: "Saat tugas kelompok, kamu paling nyaman saat...", order: ["kelompok","visual","mandiri","kinestetik","membaca","auditori"],
    text: { visual:"membuat mind-map untuk menyatukan ide tim", auditori:"presentasi lisan menjelaskan ide ke tim", kinestetik:"langsung praktik / demo bareng", membaca:"menulis laporan yang detail", mandiri:"mengerjakan bagianmu sendiri lalu digabung", kelompok:"aktif berdiskusi & bertukar ide" } },
  { q: "Cara terbaik kamu mengingat sesuatu adalah dengan...", order: ["auditori","kinestetik","membaca","mandiri","visual","kelompok"],
    text: { visual:"membayangkan gambarnya di kepala", auditori:"mengucapkannya keras-keras / dengar ulang", kinestetik:"mempraktikkannya langsung", membaca:"menuliskannya berulang kali", mandiri:"mereview sendiri secara berulang", kelompok:"menjelaskannya ke teman" } },
  { q: "Saat nonton video tutorial, kamu paling suka yang...", order: ["mandiri","membaca","kelompok","visual","kinestetik","auditori"],
    text: { visual:"penuh visual & animasi", auditori:"penjelasannya jelas walau minim visual", kinestetik:"mengajak praktik langsung", membaca:"ada transkrip / teks tertulis", mandiri:"bisa di-pause & diulang sendiri", kelompok:"ditonton bareng sambil diskusi" } },
  { q: "Ruang belajar favoritmu itu yang...", order: ["kinestetik","mandiri","membaca","kelompok","visual","auditori"],
    text: { visual:"dipenuhi catatan warna-warni & gambar", auditori:"sambil dengar musik atau podcast", kinestetik:"ada banyak ruang gerak, tidak diam di kursi", membaca:"penuh buku & catatan rapi", mandiri:"tenang, sendirian", kelompok:"ramai bareng teman belajar" } },
  { q: "Strategi favoritmu menjelang ujian adalah...", order: ["visual","kelompok","auditori","membaca","kinestetik","mandiri"],
    text: { visual:"membuat diagram / flowchart materi", auditori:"rekam suara sendiri & dengar ulang", kinestetik:"latihan soal sebanyak mungkin", membaca:"membuat ringkasan tertulis", mandiri:"belajar sendiri sesuai rencana sendiri", kelompok:"belajar bareng & saling kuis" } },
  { q: "Hal yang paling bikin kamu fokus adalah...", order: ["kelompok","membaca","kinestetik","visual","mandiri","auditori"],
    text: { visual:"lingkungan rapi & visual jelas", auditori:"suasana tenang untuk mendengarkan", kinestetik:"bisa bergerak / sambil melakukan sesuatu", membaca:"ada banyak bahan bacaan", mandiri:"tidak ada gangguan, sendirian", kelompok:"ada teman untuk saling mengingatkan" } },
  { q: "Saat guru/dosen menjelaskan, kamu paling menangkap materi dari...", order: ["membaca","kinestetik","auditori","mandiri","visual","kelompok"],
    text: { visual:"slide atau papan tulis yang ditampilkan", auditori:"nada suara & penjelasan lisannya", kinestetik:"contoh praktik yang didemoin", membaca:"handout / materi tertulis yang dibagikan", mandiri:"catatan yang kamu buat sendiri", kelompok:"sesi tanya-jawab di kelas" } },
  { q: "Kalau bebas memilih cara belajar ideal seharian, kamu pilih...", order: ["auditori","visual","mandiri","kinestetik","kelompok","membaca"],
    text: { visual:"nonton video & lihat infografis", auditori:"dengar kuliah / podcast", kinestetik:"praktik langsung / eksperimen", membaca:"baca buku & buat catatan", mandiri:"belajar sendiri di tempat tenang", kelompok:"kerja kelompok & diskusi" } },
];

const styleOf = (key) => STYLES.find((s) => s.key === key);

/* ============================================================
   "react-bits"-style helper components
   ============================================================ */

// Gradient shimmer text (signature display headline)
function ShimmerText({ children, size = 38 }) {
  return (
    <span
      style={{
        fontFamily: T.display,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.1,
        backgroundImage: `linear-gradient(100deg, ${T.text} 30%, ${T.lamp} 50%, ${T.text} 70%)`,
        backgroundSize: "220% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "shimmer 5s linear infinite",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

// Magnetic button — follows cursor slightly within its bounds
function MagneticButton({ children, onClick, color = T.lamp, big = false }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    setPos({ x: mx * 0.25, y: my * 0.3 });
  };
  return (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={onClick}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform .15s ease-out, box-shadow .2s ease",
        background: color,
        color: T.bgDeep,
        fontFamily: T.body,
        fontWeight: 700,
        fontSize: big ? 16 : 14,
        padding: big ? "16px 32px" : "10px 20px",
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        boxShadow: `0 8px 24px -8px ${color}99`,
      }}
    >
      {children}
    </button>
  );
}

// Spotlight card — radial light follows cursor (the "lampu baca" signature)
function SpotlightCard({ children, style }) {
  const ref = useRef(null);
  const [m, setM] = useState({ x: 50, y: 0 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setM({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      style={{
        position: "relative",
        borderRadius: 20,
        border: `1px solid ${T.border}`,
        background: `radial-gradient(420px circle at ${m.x}% ${m.y}%, ${T.lampSoft}, transparent 60%), ${T.surface}`,
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`, pointerEvents: "none" }} />
      {children}
    </div>
  );
}

// Tilt + glow answer option
function OptionCard({ text, color, Icon, onClick, selected, idx }) {
  const ref = useRef(null);
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 60 * idx);
    return () => clearTimeout(id);
  }, [idx]);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    setT({ rx: (py - 0.5) * -8, ry: (px - 0.5) * 8, mx: px * 100, my: py * 100 });
  };
  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ rx: 0, ry: 0, mx: 50, my: 50 })}
      onClick={onClick}
      style={{
        textAlign: "left",
        width: "100%",
        padding: "16px 18px",
        borderRadius: 14,
        border: `1px solid ${selected ? color : T.borderSoft}`,
        background: `radial-gradient(180px circle at ${t.mx}% ${t.my}%, ${color}22, transparent 65%), ${T.surfaceSoft}`,
        color: T.text,
        fontFamily: T.body,
        fontSize: 14.5,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: visible ? 1 : 0,
        transform: visible
          ? `translateY(0) perspective(600px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`
          : "translateY(10px)",
        transition: "opacity .4s ease, transform .15s ease-out, border-color .2s ease",
      }}
    >
      <span
        style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${color}26`, color,
        }}
      >
        <Icon size={15} />
      </span>
      {text}
    </button>
  );
}

// Count-up number for results
function CountUp({ value, duration = 800 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setN(Math.round(p * value));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{n}</>;
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function Sesi3GayaBelajar({ onComplete = () => {} }) {
  const [screen, setScreen] = useState("intro"); // intro | quiz | result
  const [qIdx, setQIdx] = useState(0);
  const [scores, setScores] = useState(() => Object.fromEntries(STYLES.map((s) => [s.key, 0])));
  const [picked, setPicked] = useState(null);

  const restart = () => {
    setScores(Object.fromEntries(STYLES.map((s) => [s.key, 0])));
    setQIdx(0);
    setPicked(null);
    setScreen("intro");
  };

  const answer = (key) => {
    if (picked) return;
    setPicked(key);
    setTimeout(() => {
      setScores((s) => ({ ...s, [key]: s[key] + 1 }));
      setPicked(null);
      if (qIdx + 1 < QUESTIONS.length) setQIdx(qIdx + 1);
      else setScreen("result");
    }, 380);
  };

  const dominant = STYLES.reduce((a, b) => (scores[b.key] > scores[a.key] ? b : a), STYLES[0]);
  const radarData = STYLES.map((s) => ({ style: s.label, value: scores[s.key], full: QUESTIONS.length }));

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: `radial-gradient(900px 500px at 50% -10%, ${T.bgMid}, ${T.bgDeep} 60%)`,
        fontFamily: T.body,
        color: T.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 18px 64px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Manrope:wght@400;500;700;800&family=JetBrains+Mono:wght@500&display=swap');
        @keyframes shimmer { to { background-position: -220% center; } }
        @keyframes drift { 0%,100% { transform: translateY(0) translateX(0); opacity:.5 } 50% { transform: translateY(-18px) translateX(8px); opacity:1 } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px);} to {opacity:1; transform:translateY(0);} }
      `}</style>

      {/* ambient dust motes under the "lamp" */}
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: `${10 + (i * 6) % 70}%`,
            left: `${(i * 13) % 100}%`,
            width: 3, height: 3, borderRadius: "50%",
            background: T.lamp, opacity: 0.4,
            animation: `drift ${4 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      <div style={{ width: "100%", maxWidth: 640, position: "relative", zIndex: 1 }}>
        {/* ---------- INTRO ---------- */}
        {screen === "intro" && (
          <div style={{ textAlign: "center", animation: "fadeUp .6s ease" }}>
            <div
              style={{
                width: 56, height: 56, margin: "0 auto 22px", borderRadius: "50%",
                background: T.lampSoft, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 40px 8px ${T.lampSoft}`,
              }}
            >
              <Flame size={26} color={T.lamp} />
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: 2, color: T.muted, marginBottom: 10 }}>
              SESI 3 · TES GAYA BELAJAR
            </div>
            <ShimmerText size={36}>Bagaimana caramu paling cepat memahami sesuatu?</ShimmerText>
            <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.6, margin: "18px auto 32px", maxWidth: 480 }}>
              Jawab {QUESTIONS.length} situasi belajar sehari-hari secara jujur — sesuai kebiasaanmu,
              bukan jawaban yang terdengar paling ideal. Hasilnya jadi bagian dari profil bakatmu.
            </p>
            <MagneticButton big onClick={() => setScreen("quiz")}>
              Mulai Tes <ArrowRight size={17} />
            </MagneticButton>

            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40, flexWrap: "wrap" }}>
              {STYLES.map((s) => (
                <span
                  key={s.key}
                  style={{
                    fontSize: 11.5, fontFamily: T.mono, padding: "6px 10px", borderRadius: 999,
                    border: `1px solid ${T.borderSoft}`, color: s.color, background: `${s.color}14`,
                  }}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ---------- QUIZ ---------- */}
        {screen === "quiz" && (
          <div style={{ animation: "fadeUp .45s ease" }}>
            {/* progress */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}>
                {String(qIdx + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.lamp }}>
                {Math.round(((qIdx) / QUESTIONS.length) * 100)}%
              </span>
            </div>
            <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: T.borderSoft, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%", borderRadius: 4, background: T.lamp,
                      width: i < qIdx ? "100%" : i === qIdx ? "60%" : "0%",
                      transition: "width .4s ease",
                    }}
                  />
                </div>
              ))}
            </div>

            <SpotlightCard style={{ padding: "30px 26px" }}>
              <h2
                key={qIdx}
                style={{
                  fontFamily: T.display, fontWeight: 600, fontSize: 22, lineHeight: 1.35,
                  margin: "0 0 22px", animation: "fadeUp .35s ease",
                }}
              >
                {QUESTIONS[qIdx].q}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }} key={`opts-${qIdx}`}>
                {QUESTIONS[qIdx].order.map((key, i) => {
                  const s = styleOf(key);
                  return (
                    <OptionCard
                      key={key}
                      idx={i}
                      text={QUESTIONS[qIdx].text[key]}
                      color={s.color}
                      Icon={s.Icon}
                      selected={picked === key}
                      onClick={() => answer(key)}
                    />
                  );
                })}
              </div>
            </SpotlightCard>
          </div>
        )}

        {/* ---------- RESULT ---------- */}
        {screen === "result" && (
          <div style={{ animation: "fadeUp .5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: 2, color: T.muted, marginBottom: 8 }}>
                HASIL GAYA BELAJARMU
              </div>
              <ShimmerText size={30}>{dominant.label}</ShimmerText>
            </div>

            <SpotlightCard style={{ padding: "24px 22px", marginBottom: 18 }}>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke={T.borderSoft} />
                    <PolarAngleAxis dataKey="style" tick={{ fill: T.muted, fontSize: 11, fontFamily: T.body }} />
                    <Radar
                      dataKey="value"
                      stroke={dominant.color}
                      fill={dominant.color}
                      fillOpacity={0.35}
                      animationDuration={900}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 8 }}>
                {STYLES.map((s) => (
                  <div
                    key={s.key}
                    style={{
                      border: `1px solid ${s.key === dominant.key ? s.color : T.borderSoft}`,
                      borderRadius: 10, padding: "8px 6px", textAlign: "center",
                      background: s.key === dominant.key ? `${s.color}1A` : "transparent",
                    }}
                  >
                    <div style={{ fontFamily: T.mono, fontSize: 16, color: s.color, fontWeight: 700 }}>
                      <CountUp value={scores[s.key]} />
                    </div>
                    <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard style={{ padding: "22px 24px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    width: 34, height: 34, borderRadius: "50%", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    background: `${dominant.color}26`, color: dominant.color,
                  }}
                >
                  <dominant.Icon size={17} />
                </span>
                <span style={{ fontFamily: T.display, fontSize: 17, fontWeight: 600 }}>Tentang gaya belajarmu</span>
              </div>
              <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>{dominant.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {dominant.tips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: T.text, alignItems: "flex-start" }}>
                    <span style={{ color: dominant.color, marginTop: 2 }}>—</span>
                    {tip}
                  </div>
                ))}
              </div>
            </SpotlightCard>

            <div style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <MagneticButton
                big
                onClick={() =>
                  onComplete({
                    dominant: {
                      key: dominant.key,
                      label: dominant.label,
                      color: dominant.color,
                      icon: dominant.Icon,
                      desc: dominant.desc,
                      tips: dominant.tips,
                    },
                    scores,
                  })
                }
              >
                Lihat hasil akhir <ArrowRight size={17} />
              </MagneticButton>
              <MagneticButton color={T.surfaceSoft} onClick={restart}>
                <RotateCcw size={15} color={T.text} />
                <span style={{ color: T.text }}>Ulangi Tes</span>
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}