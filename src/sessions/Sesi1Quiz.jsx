import React, { useState, useRef, useCallback, useMemo } from "react";
import { Brain, Palette, Users, HeartHandshake, Eye, Zap, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

/* ---------------------------------------------------------
   Sesi 1 · Kenali Bakatmu — tes kepribadian & minat
   Tema visual: malam batik — indigo gelap, emas, terakota,
   terinspirasi motif gunungan & kain Nusantara.
--------------------------------------------------------- */

const TYPES = {
  analitis: {
    label: "Si Analitis",
    color: "#D9A441",
    soft: "#3A2F12",
    icon: Brain,
    desc: "Kamu membedah masalah dengan logika dan data sebelum mengambil keputusan. Tim mengandalkanmu untuk berpikir jernih saat semua orang panik.",
    arah: "Cocok dijajaki lebih lanjut lewat fakultas yang menguji ketajaman logika & analisis data.",
  },
  kreatif: {
    label: "Si Kreatif",
    color: "#C1543C",
    soft: "#3A1F16",
    icon: Palette,
    desc: "Dunia adalah kanvas bagimu. Ide orisinal dan ekspresi visual atau verbal adalah bahasa utamamu sehari-hari.",
    arah: "Cocok dijajaki lebih lanjut lewat fakultas yang menguji kepekaan estetika & ekspresi.",
  },
  pemimpin: {
    label: "Si Pemimpin",
    color: "#A23B4A",
    soft: "#3A1620",
    icon: Users,
    desc: "Kamu nyaman mengambil kendali, menentukan arah, dan menggerakkan orang lain menuju satu tujuan bersama.",
    arah: "Cocok dijajaki lebih lanjut lewat fakultas yang menguji kemampuan strategi & koordinasi.",
  },
  penolong: {
    label: "Si Penolong",
    color: "#2F7A5E",
    soft: "#10241D",
    icon: HeartHandshake,
    desc: "Kamu paling hidup saat membantu orang lain bertumbuh, didengar, dan merasa diperhatikan dengan tulus.",
    arah: "Cocok dijajaki lebih lanjut lewat fakultas yang menguji empati & pemahaman terhadap manusia.",
  },
  pengamat: {
    label: "Si Pengamat",
    color: "#4D5FA6",
    soft: "#161B33",
    icon: Eye,
    desc: "Kamu mengamati dulu, memahami pola, lalu bertindak dengan tenang dan presisi — jarang gegabah.",
    arah: "Cocok dijajaki lebih lanjut lewat fakultas yang menguji riset, ketelitian & observasi mendalam.",
  },
  eksekutor: {
    label: "Si Eksekutor",
    color: "#B07A2E",
    soft: "#2E2009",
    icon: Zap,
    desc: "Bagimu rencana matang tidak berarti apa-apa tanpa eksekusi cepat. Kamu menyelesaikan, bukan sekadar merencanakan.",
    arah: "Cocok dijajaki lebih lanjut lewat fakultas yang menguji ketangkasan terapan & hasil nyata.",
  },
};

const QUESTIONS = [
  {
    q: "Saat dapat tugas kelompok baru, kamu biasanya…",
    options: [
      ["analitis", "Mengumpulkan data dan referensi dulu sebelum mulai"],
      ["kreatif", "Melempar banyak ide liar di awal diskusi"],
      ["pemimpin", "Membagi peran dan menentukan target waktu"],
      ["penolong", "Memastikan semua anggota nyaman dan didengar"],
      ["pengamat", "Mendengarkan dulu, baru bicara setelah paham arah tim"],
      ["eksekutor", "Langsung mengerjakan bagian yang paling jelas"],
    ],
  },
  {
    q: "Waktu luang favoritmu diisi dengan…",
    options: [
      ["analitis", "Memecahkan teka-teki, catur, atau game strategi"],
      ["kreatif", "Menggambar, menulis, atau membuat konten"],
      ["pemimpin", "Mengorganisir acara atau komunitas"],
      ["penolong", "Menemani teman cerita, jadi tempat curhat"],
      ["pengamat", "Riset topik acak sampai detail terkecil"],
      ["eksekutor", "Menuntaskan to-do list, kerjakan banyak hal sekaligus"],
    ],
  },
  {
    q: "Ada masalah mendadak di proyek. Reaksi pertamamu…",
    options: [
      ["analitis", "Cari akar masalah sebelum buru-buru memutuskan"],
      ["kreatif", "Cari solusi yang belum pernah dicoba tim lain"],
      ["pemimpin", "Ambil alih, tenangkan tim, tentukan langkah berikut"],
      ["penolong", "Cek dulu kondisi tim, jangan sampai ada yang kewalahan"],
      ["pengamat", "Amati pola kesalahan agar tak terulang"],
      ["eksekutor", "Langsung eksekusi solusi tercepat yang masuk akal"],
    ],
  },
  {
    q: "Feedback seperti apa yang paling kamu hargai?",
    options: [
      ["analitis", "Yang detail dan berbasis alasan yang jelas"],
      ["kreatif", "Yang menghargai sudut pandang baru, bukan cuma benar-salah"],
      ["pemimpin", "Yang langsung ke poin dan bisa segera ditindaklanjuti"],
      ["penolong", "Yang disampaikan dengan empati, bukan menghakimi"],
      ["pengamat", "Yang spesifik soal detail kecil yang sering terlewat"],
      ["eksekutor", "Yang cepat, biar bisa langsung diperbaiki lalu lanjut"],
    ],
  },
  {
    q: "Orang lain biasanya datang ke kamu untuk…",
    options: [
      ["analitis", "Minta dianalisis pelan-pelan sebelum memutuskan"],
      ["kreatif", "Mencari ide segar atau sudut pandang berbeda"],
      ["pemimpin", "Minta diarahkan saat bingung harus mulai dari mana"],
      ["penolong", "Curhat atau mencari dukungan emosional"],
      ["pengamat", "Minta pendapat jujur setelah kamu amati situasi"],
      ["eksekutor", "Minta bantuan menyelesaikan sesuatu dengan cepat"],
    ],
  },
  {
    q: "Definisi “kerja bagus” menurutmu adalah…",
    options: [
      ["analitis", "Keputusan yang masuk akal dan bisa dipertanggungjawabkan"],
      ["kreatif", "Hasil yang orisinal, belum pernah dilihat orang lain"],
      ["pemimpin", "Tim bergerak searah dan target tercapai"],
      ["penolong", "Semua orang merasa dilibatkan dan dihargai"],
      ["pengamat", "Detail rapi, tidak ada yang terlewat"],
      ["eksekutor", "Selesai tepat waktu, tanpa drama"],
    ],
  },
];

/* ---- SpotlightCard a la React Bits: mouse-follow glow ---- */
function SpotlightOption({ text, accent, onClick, index }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

  return (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className="opt-card"
      style={{
        "--mx": `${pos.x}%`,
        "--my": `${pos.y}%`,
        "--accent": accent,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <span className="opt-spot" style={{ opacity: hover ? 1 : 0 }} />
      <span className="opt-dot" style={{ background: accent }} />
      <span className="opt-text">{text}</span>
      <ArrowRight className="opt-arrow" size={16} style={{ opacity: hover ? 1 : 0, transform: hover ? "translateX(0)" : "translateX(-6px)" }} />
    </button>
  );
}

/* ---- Magnetic button a la React Bits ---- */
function MagneticButton({ children, onClick, accent }) {
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    setT({ x, y });
  };
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      className="magnetic-btn"
      style={{ transform: `translate(${t.x}px, ${t.y}px)`, background: accent || "var(--gold)" }}
    >
      {children}
    </button>
  );
}

export default function Sesi1Quiz({ onComplete = () => {} }) {
  const [stage, setStage] = useState("intro"); // intro | quiz | result
  const [qIndex, setQIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [picked, setPicked] = useState(null);

  const total = QUESTIONS.length;

  const handlePick = (key, optIdx) => {
    setPicked(optIdx);
    const next = { ...scores, [key]: (scores[key] || 0) + 1 };
    setScores(next);
    setTimeout(() => {
      setPicked(null);
      if (qIndex + 1 < total) {
        setQIndex(qIndex + 1);
      } else {
        setStage("result");
      }
    }, 320);
  };

  const resultKey = useMemo(() => {
    let best = null;
    let bestScore = -1;
    Object.entries(scores).forEach(([k, v]) => {
      if (v > bestScore) {
        best = k;
        bestScore = v;
      }
    });
    return best || "analitis";
  }, [scores]);

  const restart = () => {
    setStage("intro");
    setQIndex(0);
    setScores({});
    setPicked(null);
  };

  const themeColor = stage === "result" ? TYPES[resultKey].color : "#D9A441";

  return (
    <div className="wrap" style={{ "--theme": themeColor }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .wrap {
          --indigo: #15102A;
          --indigo-2: #1E1638;
          --gold: #D9A441;
          --cream: #F4EEE0;
          --cream-dim: #C9C2AE;
          --terracotta: #C1543C;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          min-height: 100vh;
          background: radial-gradient(ellipse at top, var(--indigo-2) 0%, var(--indigo) 60%, #0D0A1C 100%);
          color: var(--cream);
          overflow: hidden;
          padding: 0;
        }

        /* Aurora / batik glow background — signature element */
        .aurora { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
        .aurora span {
          position: absolute; border-radius: 50%; filter: blur(90px); opacity: .35;
          animation: drift 18s ease-in-out infinite alternate;
        }
        .aurora span:nth-child(1){ width:480px; height:480px; background: var(--theme); top:-160px; left:-120px; transition: background 1s; }
        .aurora span:nth-child(2){ width:380px; height:380px; background:#7A2E3E; bottom:-140px; right:-100px; animation-duration: 22s; animation-delay: -4s; }
        .aurora span:nth-child(3){ width:300px; height:300px; background:#2F7A5E; top:40%; right:10%; animation-duration: 26s; animation-delay: -9s; opacity:.18; }
        @keyframes drift { from { transform: translate(0,0) scale(1);} to { transform: translate(40px,-30px) scale(1.12);} }

        /* gunungan silhouette motif */
        .motif {
          position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
          width: min(900px, 140vw); opacity: .14; z-index: 0; pointer-events:none;
        }

        .stage { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; padding: 56px 24px 80px; min-height: 100vh; display:flex; flex-direction:column; }

        .eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12px; letter-spacing:.14em; text-transform:uppercase; color: var(--gold); font-weight:600; }
        .eyebrow svg { opacity:.9; }

        h1.title {
          font-family:'Fraunces', serif; font-weight:600; font-size: clamp(32px,5vw,46px); line-height:1.08;
          margin: 14px 0 12px; letter-spacing:-.01em;
          background: linear-gradient(100deg, var(--cream) 30%, var(--gold) 55%, var(--cream) 75%);
          background-size: 220% auto; -webkit-background-clip:text; background-clip:text; color:transparent;
          animation: shine 6s linear infinite;
        }
        @keyframes shine { to { background-position: -220% center; } }

        .lede { color: var(--cream-dim); font-size:16px; line-height:1.65; max-width: 560px; margin-bottom: 28px; }

        .intro-card { margin-top: 8px; border:1px solid rgba(244,238,224,.12); background: rgba(244,238,224,.04); border-radius:18px; padding:28px; backdrop-filter: blur(6px); }
        .intro-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:10px; margin: 22px 0 28px; }
        .type-chip { display:flex; flex-direction:column; align-items:center; gap:6px; padding:14px 8px; border-radius:12px; border:1px solid rgba(244,238,224,.1); background: rgba(0,0,0,.15); }
        .type-chip svg { opacity:.85; }
        .type-chip span { font-size:11.5px; color: var(--cream-dim); text-align:center; }

        .magnetic-btn {
          color:#16110B; font-weight:700; font-size:15px; border:none; border-radius:999px; padding:15px 28px;
          display:inline-flex; align-items:center; gap:8px; cursor:pointer; transition: transform .15s ease, box-shadow .2s ease, background .4s;
          box-shadow: 0 8px 24px -8px rgba(217,164,65,.6);
        }
        .magnetic-btn:hover { box-shadow: 0 10px 30px -6px rgba(217,164,65,.75); }
        .magnetic-btn:focus-visible { outline: 2px solid var(--cream); outline-offset: 3px; }

        /* progress */
        .progress-row { display:flex; align-items:center; gap:8px; margin-bottom: 30px; }
        .progress-seg { flex:1; height:4px; border-radius:4px; background: rgba(244,238,224,.14); overflow:hidden; }
        .progress-seg i { display:block; height:100%; width:0%; background: var(--gold); transition: width .4s ease; }
        .progress-num { font-size:12px; color: var(--cream-dim); font-variant-numeric: tabular-nums; min-width:48px; text-align:right; }

        .q-text { font-family:'Fraunces', serif; font-weight:600; font-size: clamp(22px,3.4vw,28px); line-height:1.25; margin: 4px 0 26px; }

        .opt-list { display:flex; flex-direction:column; gap:10px; }
        .opt-card {
          position:relative; isolation:isolate; text-align:left; display:flex; align-items:center; gap:14px;
          padding:16px 18px; border-radius:14px; border:1px solid rgba(244,238,224,.14);
          background: rgba(244,238,224,.035); color: var(--cream); cursor:pointer; overflow:hidden;
          font-size:14.5px; line-height:1.45; transition: border-color .2s ease, transform .15s ease, background .2s ease;
          animation: rise .5s cubic-bezier(.2,.7,.2,1) backwards;
        }
        @keyframes rise { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
        .opt-card:hover { border-color: var(--accent); transform: translateY(-2px); background: rgba(244,238,224,.06); }
        .opt-card:active { transform: translateY(0) scale(.99); }
        .opt-card.picked { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 18%, transparent); }
        .opt-spot {
          position:absolute; inset:0; z-index:-1; transition: opacity .25s ease;
          background: radial-gradient(220px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%);
        }
        .opt-dot { width:8px; height:8px; min-width:8px; border-radius:50%; }
        .opt-text { flex:1; }
        .opt-arrow { transition: opacity .2s ease, transform .2s ease; flex-shrink:0; }

        .result-wrap { display:flex; flex-direction:column; align-items:flex-start; gap:18px; animation: rise .6s ease; }
        .result-icon { width:64px; height:64px; border-radius:18px; display:flex; align-items:center; justify-content:center; background: color-mix(in srgb, var(--theme) 22%, #15102A); border: 1px solid color-mix(in srgb, var(--theme) 50%, transparent); }
        .result-label { font-family:'Fraunces', serif; font-weight:700; font-size: clamp(30px,5vw,44px); color: var(--theme); }
        .result-desc { color: var(--cream-dim); font-size:16px; line-height:1.7; max-width: 560px; }
        .result-note { font-size:13.5px; color: var(--cream-dim); border-left:2px solid var(--theme); padding-left:12px; max-width:520px; }

        .breakdown { width:100%; margin-top: 6px; display:flex; flex-direction:column; gap:8px; }
        .bd-row { display:flex; align-items:center; gap:10px; font-size:12.5px; color: var(--cream-dim); }
        .bd-label { width:108px; flex-shrink:0; }
        .bd-track { flex:1; height:6px; border-radius:4px; background: rgba(244,238,224,.1); overflow:hidden; }
        .bd-fill { height:100%; border-radius:4px; transition: width .6s cubic-bezier(.2,.7,.2,1); }
        .bd-val { width:18px; text-align:right; font-variant-numeric: tabular-nums; }

        .actions-row { display:flex; align-items:center; gap:14px; margin-top: 10px; flex-wrap:wrap; }
        .ghost-btn { display:inline-flex; align-items:center; gap:8px; background:transparent; border:1px solid rgba(244,238,224,.22); color: var(--cream-dim); font-size:13.5px; padding:12px 18px; border-radius:999px; cursor:pointer; transition: border-color .2s, color .2s; }
        .ghost-btn:hover { border-color: var(--cream-dim); color: var(--cream); }

        footer.note { position:relative; z-index:1; text-align:center; font-size:12px; color: rgba(244,238,224,.45); padding-bottom: 28px; }

        @media (max-width:520px){ .intro-grid{ grid-template-columns: repeat(2,1fr);} }
      `}</style>

      <div className="aurora"><span /><span /><span /></div>
      <svg className="motif" viewBox="0 0 600 220" fill="none">
        <path d="M0 220 L0 160 L120 160 L150 60 L180 160 L260 160 L300 0 L340 160 L420 160 L450 60 L480 160 L600 160 L600 220 Z" fill="var(--gold)" />
      </svg>

      <div className="stage">
        {stage === "intro" && (
          <>
            <span className="eyebrow"><Sparkles size={13} />  · Kenali Bakatmu</span>
            <h1 className="title">Sesi 1 — Kepribadian &amp; Minat</h1>
            <p className="lede">
              Enam pertanyaan singkat. Jawab dengan jujur dan
              spontan — tidak ada jawaban salah, hanya jawaban yang paling terasa seperti kamu.
            </p>

            <div className="intro-card">
              <p style={{ fontSize: 13.5, color: "var(--cream-dim)", marginBottom: 16 }}>
                Hasilnya akan memetakanmu ke salah satu dari enam arketipe berikut:
              </p>
              <div className="intro-grid">
                {Object.entries(TYPES).map(([k, t]) => {
                  const Icon = t.icon;
                  return (
                    <div className="type-chip" key={k}>
                      <Icon size={20} color={t.color} />
                      <span>{t.label}</span>
                    </div>
                  );
                })}
              </div>
              <MagneticButton onClick={() => setStage("quiz")}>
                Mulai sesi 1 <ArrowRight size={16} />
              </MagneticButton>
            </div>
          </>
        )}

        {stage === "quiz" && (
          <>
            <div className="progress-row">
              {QUESTIONS.map((_, i) => (
                <div className="progress-seg" key={i}>
                  <i style={{ width: i < qIndex ? "100%" : i === qIndex ? "50%" : "0%" }} />
                </div>
              ))}
              <span className="progress-num">{qIndex + 1} / {total}</span>
            </div>

            <span className="eyebrow"><Sparkles size={13} /> Sesi 1 · Kepribadian &amp; Minat</span>
            <h2 className="q-text">{QUESTIONS[qIndex].q}</h2>

            <div className="opt-list" key={qIndex}>
              {QUESTIONS[qIndex].options.map(([key, text], i) => (
                <SpotlightOption
                  key={key}
                  index={i}
                  text={text}
                  accent={TYPES[key].color}
                  onClick={() => handlePick(key, i)}
                />
              ))}
            </div>
          </>
        )}

        {stage === "result" && (
          <div className="result-wrap">
            <span className="eyebrow"><Sparkles size={13} /> Hasil sesi 1</span>
            <div className="result-icon">
              {React.createElement(TYPES[resultKey].icon, { size: 30, color: TYPES[resultKey].color })}
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--cream-dim)", marginBottom: 4 }}>Kamu condong ke arah</div>
              <div className="result-label">{TYPES[resultKey].label}</div>
            </div>
            <p className="result-desc">{TYPES[resultKey].desc}</p>
            <p className="result-note">{TYPES[resultKey].arah}</p>

            <div className="breakdown">
              {Object.entries(TYPES).map(([k, t]) => {
                const val = scores[k] || 0;
                const pct = (val / total) * 100;
                return (
                  <div className="bd-row" key={k}>
                    <span className="bd-label">{t.label}</span>
                    <div className="bd-track"><div className="bd-fill" style={{ width: `${pct}%`, background: t.color }} /></div>
                    <span className="bd-val">{val}</span>
                  </div>
                );
              })}
            </div>

            <div className="actions-row">
              <MagneticButton
                accent={TYPES[resultKey].color}
                onClick={() =>
                  onComplete({
                    resultKey,
                    label: TYPES[resultKey].label,
                    color: TYPES[resultKey].color,
                    icon: TYPES[resultKey].icon,
                    desc: TYPES[resultKey].desc,
                    scores,
                  })
                }
              >
                Lanjut ke sesi 2 <ArrowRight size={16} />
              </MagneticButton>
              <button className="ghost-btn" onClick={restart}><RotateCcw size={14} /> Ulangi sesi 1</button>
            </div>
          </div>
        )}
      </div>

      <footer className="note">Sesi 1 dari 4 · kepribadian &amp; minat — bagian dari rangkaian tes Kenali Bakatmu</footer>
    </div>
  );
}