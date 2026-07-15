import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Sigma, FlaskConical, Languages, Landmark, Brain, Sparkles as Spark,
  ArrowRight, RotateCcw, CheckCircle2, XCircle, Timer, Trophy,
} from "lucide-react";
import { TapBintangGame } from "../components/MiniGames.jsx";

/* ---------------------------------------------------------
   Sesi 2 · Tes Mata Pelajaran per Fakultas
   Tema visual senada dengan Sesi 1 (malam batik), dengan
   signature baru: timer radial per soal + pencocokan fakultas
   berbasis bobot mata pelajaran.
--------------------------------------------------------- */

const SUBJECTS = {
  math: { label: "Matematika", color: "#D9A441", icon: Sigma },
  ipa: { label: "IPA / Sains Dasar", color: "#2F7A5E", icon: FlaskConical },
  bing: { label: "Bahasa Inggris", color: "#4D5FA6", icon: Languages },
  ips: { label: "Ilmu Sosial & Ekonomi", color: "#A23B4A", icon: Landmark },
  logika: { label: "Logika & Penalaran", color: "#8A5A2B", icon: Brain },
  kreatif: { label: "Kreativitas & Desain", color: "#C1543C", icon: Spark },
};

const QUESTIONS = [
  { subject: "math", q: "Hasil dari 12 × 8 adalah?", options: ["86", "96", "106", "116"], correct: 1 },
  { subject: "math", q: "Jika x + 7 = 15, maka nilai x adalah?", options: ["6", "7", "8", "9"], correct: 2 },
  { subject: "math", q: "Luas persegi panjang dengan panjang 9 cm dan lebar 4 cm adalah?", options: ["13 cm²", "26 cm²", "36 cm²", "40 cm²"], correct: 2 },

  { subject: "ipa", q: "Proses tumbuhan mengubah cahaya matahari menjadi energi disebut?", options: ["Respirasi", "Fotosintesis", "Transpirasi", "Fermentasi"], correct: 1 },
  { subject: "ipa", q: "Satuan SI untuk gaya adalah?", options: ["Joule", "Newton", "Watt", "Pascal"], correct: 1 },
  { subject: "ipa", q: "Planet terdekat dengan Matahari adalah?", options: ["Venus", "Bumi", "Merkurius", "Mars"], correct: 2 },

  { subject: "bing", q: "Choose the correct sentence:", options: ["She don't like coffee", "She doesn't likes coffee", "She doesn't like coffee", "She not like coffee"], correct: 2 },
  { subject: "bing", q: "Synonym of “happy” is?", options: ["Sad", "Joyful", "Angry", "Tired"], correct: 1 },
  { subject: "bing", q: "“I ___ to school every day.”", options: ["go", "goes", "going", "gone"], correct: 0 },

  { subject: "ips", q: "Hukum permintaan menyatakan, jika harga naik maka permintaan akan…", options: ["Naik", "Turun", "Tetap", "Tidak berhubungan"], correct: 1 },
  { subject: "ips", q: "Lembaga yang mengatur kebijakan moneter di Indonesia adalah?", options: ["OJK", "BPS", "Bank Indonesia", "Kemenkeu"], correct: 2 },
  { subject: "ips", q: "Proklamasi kemerdekaan Indonesia dibacakan pada tanggal?", options: ["17 Agustus 1944", "17 Agustus 1945", "20 Mei 1945", "28 Oktober 1945"], correct: 1 },

  { subject: "logika", q: "Semua kucing adalah mamalia. Sebagian mamalia adalah herbivora. Maka…", options: ["Semua kucing herbivora", "Sebagian kucing pasti herbivora", "Tidak bisa disimpulkan langsung", "Semua mamalia adalah kucing"], correct: 2 },
  { subject: "logika", q: "Deret: 2, 4, 8, 16, … angka selanjutnya?", options: ["18", "24", "32", "30"], correct: 2 },
  { subject: "logika", q: "Jika semua A adalah B, dan C bukan B, maka…", options: ["C adalah A", "C bukan A", "C mungkin A", "Tidak ada hubungan"], correct: 1 },

  { subject: "kreatif", q: "Dalam desain, “kontras” digunakan untuk…", options: ["Menyamakan semua elemen", "Menonjolkan satu elemen dari yang lain", "Menghilangkan warna", "Menambah teks"], correct: 1 },
  { subject: "kreatif", q: "Warna yang dianggap “warna hangat” adalah?", options: ["Biru", "Hijau", "Merah", "Ungu"], correct: 2 },
  { subject: "kreatif", q: "Prinsip “kesatuan” (unity) dalam desain berarti?", options: ["Elemen saling terpisah", "Elemen terasa menyatu & koheren", "Hanya memakai satu warna", "Tidak ada pola"], correct: 1 },
];

const FACULTY_WEIGHTS = {
  "Bisnis & Ekonomi": { ips: 3, math: 2, logika: 2, bing: 1, ipa: 0, kreatif: 0 },
  "Teknik": { math: 3, ipa: 3, logika: 2, ips: 0, bing: 0, kreatif: 0 },
  "Ilmu Komputer & Informatika": { logika: 3, math: 3, kreatif: 1, ips: 0, bing: 1, ipa: 0 },
  "Hukum": { bing: 2, logika: 3, ips: 2, math: 0, ipa: 0, kreatif: 0 },
  "Kedokteran": { ipa: 3, math: 2, logika: 2, bing: 1, ips: 0, kreatif: 0 },
  "Ilmu Sosial & Politik": { ips: 3, bing: 2, logika: 1, math: 0, ipa: 0, kreatif: 0 },
  "Seni, Desain & Arsitektur": { kreatif: 3, logika: 1, ips: 1, math: 1, ipa: 0, bing: 0 },
  "Psikologi": { ips: 2, bing: 2, logika: 2, math: 0, ipa: 1, kreatif: 0 },
  "Pendidikan": { bing: 2, ips: 2, kreatif: 1, math: 1, ipa: 0, logika: 0 },
  "Pertanian": { ipa: 3, math: 1, logika: 1, ips: 0, bing: 0, kreatif: 0 },
  "Ilmu Komunikasi": { bing: 3, kreatif: 2, ips: 1, math: 0, ipa: 0, logika: 0 },
  "Kesehatan Masyarakat": { ipa: 2, ips: 2, logika: 1, math: 0, bing: 0, kreatif: 0 },
  "Farmasi": { ipa: 3, math: 2, logika: 1, ips: 0, bing: 0, kreatif: 0 },
  "Sains & Matematika": { math: 3, ipa: 3, logika: 2, ips: 0, bing: 0, kreatif: 0 },
  "Pariwisata & Perhotelan": { bing: 3, kreatif: 1, ips: 1, math: 0, ipa: 0, logika: 0 },
};

const TIME_PER_Q = 15;

/* ---- Radial countdown timer — React Bits style ---- */
function RadialTimer({ seconds, total, color }) {
  const r = 19;
  const c = 2 * Math.PI * r;
  const frac = Math.max(0, seconds / total);
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" className="radial-timer">
      <circle cx="23" cy="23" r={r} fill="none" stroke="rgba(244,238,224,.14)" strokeWidth="4" />
      <circle
        cx="23" cy="23" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
        transform="rotate(-90 23 23)" style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      <text x="23" y="27" textAnchor="middle" fontSize="13" fill="#F4EEE0" fontFamily="Plus Jakarta Sans">{seconds}</text>
    </svg>
  );
}

/* ---- Tilt option card — React Bits style 3D tilt ---- */
function TiltOption({ text, idx, state, onClick, accent }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    if (state !== "idle") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  };

  let cls = "tilt-opt";
  if (state === "correct") cls += " is-correct";
  else if (state === "wrong") cls += " is-wrong";
  else if (state === "dim") cls += " is-dim";

  return (
    <button
      ref={ref}
      className={cls}
      style={{ transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, "--accent": accent, animationDelay: `${idx * 60}ms` }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={onClick}
      disabled={state !== "idle"}
    >
      <span className="tilt-letter">{String.fromCharCode(65 + idx)}</span>
      <span className="tilt-text">{text}</span>
      {state === "correct" && <CheckCircle2 size={18} className="tilt-icon" />}
      {state === "wrong" && <XCircle size={18} className="tilt-icon" />}
    </button>
  );
}

/* ---- Animated count-up number — React Bits style ---- */
function CountUp({ value, duration = 900, suffix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{n}{suffix}</>;
}

export default function Sesi2Quiz({ onComplete = () => {} }) {
  const [stage, setStage] = useState("intro"); // intro | quiz | minigame | result
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // qIndex -> {selected, correct}
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [midGameDone, setMidGameDone] = useState(false);
  const lockRef = useRef(false);

  const total = QUESTIONS.length;
  const MID = Math.floor(total / 2);
  const current = QUESTIONS[qIndex];

  const goNext = useCallback(() => {
    lockRef.current = false;
    setSelected(null);
    const nextIndex = qIndex + 1;
    if (nextIndex < total) {
      setQIndex(nextIndex);
      setTimeLeft(TIME_PER_Q);
      if (nextIndex === MID && !midGameDone) {
        setStage("minigame");
      }
    } else {
      setStage("result");
    }
  }, [qIndex, total, MID, midGameDone]);

  const submitAnswer = useCallback((idx) => {
    if (lockRef.current || stage !== "quiz") return;
    lockRef.current = true;
    const isCorrect = idx === current.correct;
    setSelected(idx);
    setAnswers((prev) => ({ ...prev, [qIndex]: { selected: idx, correct: isCorrect } }));
    setTimeout(goNext, 700);
  }, [current, qIndex, stage, goNext]);

  useEffect(() => {
    if (stage !== "quiz") return;
    if (timeLeft <= 0) {
      if (!lockRef.current) {
        lockRef.current = true;
        setAnswers((prev) => ({ ...prev, [qIndex]: { selected: -1, correct: false } }));
        setTimeout(goNext, 500);
      }
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, stage, qIndex, goNext]);

  const startQuiz = () => {
    setStage("quiz");
    setQIndex(0);
    setAnswers({});
    setSelected(null);
    setTimeLeft(TIME_PER_Q);
    setMidGameDone(false);
    lockRef.current = false;
  };

  const restart = () => {
    setStage("intro");
    setQIndex(0);
    setAnswers({});
    setSelected(null);
    setTimeLeft(TIME_PER_Q);
    setMidGameDone(false);
    lockRef.current = false;
  };

  const continueAfterMidGame = () => {
    setMidGameDone(true);
    setStage("quiz");
  };

  const subjectScores = useMemo(() => {
    const tally = {};
    Object.keys(SUBJECTS).forEach((k) => (tally[k] = { correct: 0, total: 0 }));
    QUESTIONS.forEach((q, i) => {
      tally[q.subject].total += 1;
      if (answers[i]?.correct) tally[q.subject].correct += 1;
    });
    return tally;
  }, [answers]);

  const facultyMatches = useMemo(() => {
    const scoreFrac = {};
    Object.entries(subjectScores).forEach(([k, v]) => (scoreFrac[k] = v.total ? v.correct / v.total : 0));
    const rows = Object.entries(FACULTY_WEIGHTS).map(([name, weights]) => {
      const maxW = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
      const got = Object.entries(weights).reduce((sum, [k, w]) => sum + w * scoreFrac[k], 0);
      return { name, pct: Math.round((got / maxW) * 100) };
    });
    return rows.sort((a, b) => b.pct - a.pct).slice(0, 3);
  }, [subjectScores]);

  const totalCorrect = Object.values(answers).filter((a) => a.correct).length;
  const totalPct = Math.round((totalCorrect / total) * 100);
  const subjColor = SUBJECTS[current?.subject]?.color || "#D9A441";

  return (
    <div className="wrap2" style={{ "--theme": stage === "quiz" ? subjColor : "#D9A441" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .wrap2 {
          --indigo: #15102A; --indigo-2: #1E1638; --gold: #D9A441; --cream: #F4EEE0; --cream-dim: #C9C2AE;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative; min-height: 100vh; overflow: hidden;
          background: radial-gradient(ellipse at top, var(--indigo-2) 0%, var(--indigo) 60%, #0D0A1C 100%);
          color: var(--cream);
        }
        .aurora2 { position:absolute; inset:0; z-index:0; }
        .aurora2 span { position:absolute; border-radius:50%; filter: blur(95px); opacity:.3; animation: drift2 20s ease-in-out infinite alternate; }
        .aurora2 span:nth-child(1){ width:460px; height:460px; background: var(--theme); top:-150px; right:-120px; transition: background 1s; }
        .aurora2 span:nth-child(2){ width:340px; height:340px; background:#4D5FA6; bottom:-120px; left:-80px; animation-duration:24s; animation-delay:-6s; }
        @keyframes drift2 { from{ transform: translate(0,0) scale(1);} to{ transform: translate(-30px,30px) scale(1.1);} }

        .stage2 { position:relative; z-index:1; max-width: 780px; margin:0 auto; padding: 56px 24px 80px; min-height:100vh; display:flex; flex-direction:column; }

        .eyebrow2 { display:inline-flex; align-items:center; gap:8px; font-size:12px; letter-spacing:.14em; text-transform:uppercase; color: var(--gold); font-weight:600; }

        h1.title2 {
          font-family:'Fraunces', serif; font-weight:600; font-size: clamp(30px,5vw,44px); line-height:1.1; margin:14px 0 12px; letter-spacing:-.01em;
          background: linear-gradient(100deg, var(--cream) 30%, var(--gold) 55%, var(--cream) 75%);
          background-size:220% auto; -webkit-background-clip:text; background-clip:text; color:transparent; animation: shine2 6s linear infinite;
        }
        @keyframes shine2 { to { background-position:-220% center; } }
        .lede2 { color: var(--cream-dim); font-size:16px; line-height:1.65; max-width:580px; margin-bottom:26px; }

        .subject-rail { display:flex; flex-wrap:wrap; gap:8px; margin: 18px 0 26px; }
        .subject-pill { display:flex; align-items:center; gap:7px; padding:9px 14px; border-radius:999px; border:1px solid rgba(244,238,224,.14); background: rgba(244,238,224,.04); font-size:12.5px; }

        .start-btn {
          color:#16110B; font-weight:700; font-size:15px; border:none; border-radius:999px; padding:15px 28px;
          display:inline-flex; align-items:center; gap:8px; cursor:pointer; background: var(--gold);
          box-shadow: 0 8px 24px -8px rgba(217,164,65,.6); transition: transform .15s ease, box-shadow .2s ease;
        }
        .start-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px -6px rgba(217,164,65,.75); }
        .start-btn:focus-visible { outline:2px solid var(--cream); outline-offset:3px; }

        .quiz-head { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom: 22px; }
        .qprog { flex:1; }
        .progress-row2 { display:flex; gap:6px; margin-bottom:8px; }
        .progress-seg2 { flex:1; height:4px; border-radius:4px; background: rgba(244,238,224,.14); overflow:hidden; }
        .progress-seg2 i { display:block; height:100%; background: var(--theme); transition: width .3s ease; }
        .qprog-meta { display:flex; justify-content:space-between; font-size:11.5px; color: var(--cream-dim); }

        .subject-tag { display:inline-flex; align-items:center; gap:6px; font-size:12px; padding:6px 12px; border-radius:999px; background: color-mix(in srgb, var(--theme) 18%, transparent); color: var(--theme); font-weight:600; margin-bottom:14px; }

        .q-text2 { font-family:'Fraunces', serif; font-weight:600; font-size: clamp(21px,3.2vw,27px); line-height:1.3; margin: 2px 0 24px; }

        .tilt-list { display:flex; flex-direction:column; gap:10px; }
        .tilt-opt {
          display:flex; align-items:center; gap:14px; text-align:left; padding:15px 16px; border-radius:14px;
          border:1px solid rgba(244,238,224,.14); background: rgba(244,238,224,.035); color: var(--cream);
          cursor:pointer; font-size:14.5px; line-height:1.4; transition: border-color .2s, background .2s, opacity .3s;
          animation: rise2 .45s cubic-bezier(.2,.7,.2,1) backwards;
        }
        @keyframes rise2 { from{opacity:0; transform: translateY(8px);} to{opacity:1; transform:translateY(0);} }
        .tilt-opt:hover:not(:disabled) { border-color: var(--accent); }
        .tilt-opt:disabled { cursor:default; }
        .tilt-opt.is-correct { border-color:#2F7A5E; background: rgba(47,122,94,.18); }
        .tilt-opt.is-wrong { border-color:#A23B4A; background: rgba(162,59,74,.18); }
        .tilt-opt.is-dim { opacity:.45; }
        .tilt-letter { width:26px; height:26px; min-width:26px; border-radius:8px; background: rgba(244,238,224,.08); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color: var(--cream-dim); }
        .tilt-text { flex:1; }
        .tilt-icon { flex-shrink:0; }

        .score-hero { display:flex; align-items:center; gap:22px; margin: 6px 0 30px; }
        .score-ring { position:relative; width:120px; height:120px; flex-shrink:0; }
        .score-num { font-family:'Fraunces', serif; font-size:40px; font-weight:700; color: var(--gold); }
        .score-sub { color: var(--cream-dim); font-size:13.5px; margin-top:2px; }

        .subj-breakdown { display:flex; flex-direction:column; gap:10px; margin-bottom: 30px; }
        .subj-row { display:flex; align-items:center; gap:12px; font-size:13px; }
        .subj-row-label { width:160px; flex-shrink:0; display:flex; align-items:center; gap:8px; color: var(--cream-dim); }
        .subj-track { flex:1; height:8px; border-radius:6px; background: rgba(244,238,224,.1); overflow:hidden; }
        .subj-fill { height:100%; border-radius:6px; width:0%; transition: width .8s cubic-bezier(.2,.7,.2,1); }
        .subj-val { width:34px; text-align:right; font-variant-numeric: tabular-nums; color: var(--cream-dim); }

        .match-title { font-family:'Fraunces', serif; font-size:20px; font-weight:600; margin: 4px 0 14px; display:flex; align-items:center; gap:8px; }
        .match-grid { display:flex; flex-direction:column; gap:10px; margin-bottom: 28px; }
        .match-card { position:relative; border-radius:14px; border:1px solid rgba(244,238,224,.14); background: rgba(244,238,224,.04); padding:16px 18px; overflow:hidden; transition: transform .2s ease, border-color .2s; }
        .match-card:hover { transform: translateY(-3px); border-color: var(--gold); }
        .match-row { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:8px; }
        .match-rank { font-size:11px; color: var(--cream-dim); letter-spacing:.08em; text-transform:uppercase; }
        .match-name { font-weight:600; font-size:15.5px; }
        .match-pct { font-family:'Fraunces', serif; font-weight:700; font-size:20px; color: var(--gold); }
        .match-track { height:6px; border-radius:4px; background: rgba(244,238,224,.1); overflow:hidden; }
        .match-fill { height:100%; background: linear-gradient(90deg, var(--gold), #C1543C); width:0%; transition: width 1s cubic-bezier(.2,.7,.2,1); border-radius:4px; }

        .actions-row2 { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
        .ghost-btn2 { display:inline-flex; align-items:center; gap:8px; background:transparent; border:1px solid rgba(244,238,224,.22); color: var(--cream-dim); font-size:13.5px; padding:12px 18px; border-radius:999px; cursor:pointer; transition: border-color .2s, color .2s; }
        .ghost-btn2:hover { border-color: var(--cream-dim); color: var(--cream); }

        footer.note2 { position:relative; z-index:1; text-align:center; font-size:12px; color: rgba(244,238,224,.45); padding-bottom:28px; }
      `}</style>

      <div className="aurora2"><span /><span /></div>

      <div className="stage2">
        {stage === "intro" && (
          <>
            <span className="eyebrow2"><Spark size={13} /> Atma Budaya · Kenali Bakatmu</span>
            <h1 className="title2">Sesi 2 — Mata Pelajaran per Fakultas</h1>
            <p className="lede2">
              18 soal singkat dari 6 mata pelajaran, masing-masing diberi waktu 15 detik. Skor per mata pelajaran
              akan dicocokkan otomatis ke bobot tiap fakultas untuk melihat tiga kandidat fakultas paling sesuai.
            </p>
            <div className="subject-rail">
              {Object.entries(SUBJECTS).map(([k, s]) => {
                const Icon = s.icon;
                return (
                  <span className="subject-pill" key={k}>
                    <Icon size={14} color={s.color} /> {s.label}
                  </span>
                );
              })}
            </div>
            <button className="start-btn" onClick={startQuiz}>Mulai sesi 2 <ArrowRight size={16} /></button>
          </>
        )}

        {stage === "quiz" && current && (
          <>
            <div className="quiz-head">
              <div className="qprog">
                <div className="progress-row2">
                  {QUESTIONS.map((_, i) => (
                    <div className="progress-seg2" key={i}>
                      <i style={{ width: i < qIndex ? "100%" : i === qIndex ? "50%" : "0%", background: i <= qIndex ? "var(--theme)" : "transparent" }} />
                    </div>
                  ))}
                </div>
                <div className="qprog-meta">
                  <span>Soal {qIndex + 1} dari {total}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Timer size={12} /> {TIME_PER_Q}s / soal</span>
                </div>
              </div>
              <RadialTimer seconds={timeLeft} total={TIME_PER_Q} color={subjColor} />
            </div>

            <span className="subject-tag">
              {React.createElement(SUBJECTS[current.subject].icon, { size: 13 })} {SUBJECTS[current.subject].label}
            </span>
            <h2 className="q-text2">{current.q}</h2>

            <div className="tilt-list" key={qIndex}>
              {current.options.map((opt, i) => {
                let state = "idle";
                if (selected !== null) {
                  if (i === current.correct) state = "correct";
                  else if (i === selected) state = "wrong";
                  else state = "dim";
                }
                return (
                  <TiltOption
                    key={i}
                    idx={i}
                    text={opt}
                    state={state}
                    accent={subjColor}
                    onClick={() => submitAnswer(i)}
                  />
                );
              })}
            </div>
          </>
        )}

        {stage === "minigame" && (
          <TapBintangGame accent={subjColor} onDone={continueAfterMidGame} />
        )}

        {stage === "result" && (
          <>
            <span className="eyebrow2"><Trophy size={13} /> Hasil sesi 2</span>
            <h1 className="title2">Rekap Penilaian Mapel</h1>

            <div className="score-hero">
              <div className="score-ring">
                <RadialBig pct={totalPct} />
              </div>
              <div>
                <div className="score-num"><CountUp value={totalCorrect} />/<CountUp value={total} /></div>
                <div className="score-sub">jawaban benar &middot; {totalPct}% akurasi keseluruhan</div>
              </div>
            </div>

            <div className="subj-breakdown">
              {Object.entries(SUBJECTS).map(([k, s]) => {
                const v = subjectScores[k];
                const pct = v.total ? Math.round((v.correct / v.total) * 100) : 0;
                const Icon = s.icon;
                return (
                  <div className="subj-row" key={k}>
                    <span className="subj-row-label"><Icon size={14} color={s.color} /> {s.label}</span>
                    <div className="subj-track"><div className="subj-fill" style={{ width: `${pct}%`, background: s.color }} /></div>
                    <span className="subj-val">{v.correct}/{v.total}</span>
                  </div>
                );
              })}
            </div>

            <h2 className="match-title"><Trophy size={17} color="var(--gold)" /> Tiga fakultas paling cocok</h2>
            <div className="match-grid">
              {facultyMatches.map((m, i) => (
                <div className="match-card" key={m.name}>
                  <div className="match-row">
                    <div>
                      <div className="match-rank">Peringkat {i + 1}</div>
                      <div className="match-name">{m.name}</div>
                    </div>
                    <div className="match-pct"><CountUp value={m.pct} suffix="%" /></div>
                  </div>
                  <div className="match-track"><div className="match-fill" style={{ width: `${m.pct}%` }} /></div>
                </div>
              ))}
            </div>

            <div className="actions-row2">
              <button
                className="start-btn"
                onClick={() =>
                  onComplete({
                    subjectScores,
                    facultyMatches,
                    totalCorrect,
                    totalPct,
                  })
                }
              >
                Lanjut ke sesi 3 <ArrowRight size={16} />
              </button>
              <button className="ghost-btn2" onClick={restart}><RotateCcw size={14} /> Ulangi sesi 2</button>
            </div>
          </>
        )}
      </div>

      <footer className="note2">Sesi 2 dari 4 &middot; mata pelajaran per fakultas — bagian dari rangkaian tes Kenali Bakatmu</footer>
    </div>
  );
}

/* ---- Big radial score ring for result hero ---- */
function RadialBig({ pct }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const [animPct, setAnimPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(244,238,224,.1)" strokeWidth="9" />
      <circle
        cx="60" cy="60" r={r} fill="none" stroke="url(#gradRing)" strokeWidth="9" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - animPct / 100)}
        transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)" }}
      />
      <defs>
        <linearGradient id="gradRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D9A441" />
          <stop offset="100%" stopColor="#C1543C" />
        </linearGradient>
      </defs>
    </svg>
  );
}