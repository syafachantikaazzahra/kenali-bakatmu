import React, { useState, useEffect, useRef, useCallback } from "react";
import { Star, Zap, Shuffle, ArrowRight, SkipForward, PartyPopper } from "lucide-react";

/* ===========================================================
   MiniGames.jsx — jeda santai 15–20 detik di antara sesi tes.
   Dua game ringan, tanpa skor "gagal", supaya peserta rileks
   sebelum lanjut ke pertanyaan berikutnya. Sengaja minim teks,
   cepat dimengerti, dan selalu bisa dilewati kapan saja.
=========================================================== */

/* ---- Mini radial countdown ring (dipakai kedua game) ---- */
function MiniRing({ seconds, total, color }) {
  const r = 17;
  const c = 2 * Math.PI * r;
  const frac = Math.max(0, seconds / total);
  return (
    <svg width="42" height="42" viewBox="0 0 42 42">
      <circle cx="21" cy="21" r={r} fill="none" stroke="rgba(244,238,224,.16)" strokeWidth="4" />
      <circle
        cx="21" cy="21" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
        transform="rotate(-90 21 21)" style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      <text x="21" y="25" textAnchor="middle" fontSize="11.5" fill="#F4EEE0" fontFamily="Plus Jakarta Sans, sans-serif">{seconds}</text>
    </svg>
  );
}

function GameFrame({ accent, icon, eyebrow, title, subtitle, timeLeft, duration, score, scoreLabel, onSkip, children, finished, finishedTitle, finishedNote, onContinue, continueLabel }) {
  return (
    <div className="mg-frame" style={{ "--mg-accent": accent }}>
      <style>{`
        .mg-frame { position:relative; max-width:520px; margin:0 auto; animation: mgRise .45s cubic-bezier(.2,.7,.2,1); }
        @keyframes mgRise { from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:translateY(0);} }
        .mg-head { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:18px; }
        .mg-eyebrow { display:inline-flex; align-items:center; gap:7px; font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; color: var(--mg-accent); font-weight:700; }
        .mg-title { font-family:'Fraunces', serif; font-weight:600; font-size: clamp(20px,3.6vw,25px); margin: 8px 0 4px; line-height:1.25; }
        .mg-sub { color:#C9C2AE; font-size:13.5px; line-height:1.55; max-width:420px; }
        .mg-skip { display:inline-flex; align-items:center; gap:6px; background:transparent; border:1px solid rgba(244,238,224,.2); color:#C9C2AE; font-size:12px; padding:8px 13px; border-radius:999px; cursor:pointer; flex-shrink:0; transition: border-color .2s, color .2s; }
        .mg-skip:hover { border-color: rgba(244,238,224,.45); color:#F4EEE0; }
        .mg-meta-row { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .mg-score { font-size:13px; color:#C9C2AE; }
        .mg-score b { color: var(--mg-accent); font-family:'Fraunces', serif; font-size:16px; }
        .mg-done { text-align:center; padding: 26px 10px 4px; }
        .mg-done-badge { width:54px; height:54px; border-radius:50%; margin:0 auto 14px; display:flex; align-items:center; justify-content:center; background: color-mix(in srgb, var(--mg-accent) 22%, transparent); }
        .mg-done-title { font-family:'Fraunces', serif; font-size:21px; font-weight:600; margin-bottom:6px; }
        .mg-done-note { color:#C9C2AE; font-size:13.5px; margin-bottom:22px; }
        .mg-cta { display:inline-flex; align-items:center; gap:8px; background: var(--mg-accent); color:#16110B; font-weight:700; font-size:14.5px; border:none; border-radius:999px; padding:14px 26px; cursor:pointer; transition: transform .15s ease; }
        .mg-cta:hover { transform: translateY(-2px); }
      `}</style>

      {!finished && (
        <>
          <div className="mg-head">
            <div>
              <span className="mg-eyebrow">{icon} {eyebrow}</span>
              <h3 className="mg-title">{title}</h3>
              <p className="mg-sub">{subtitle}</p>
            </div>
            <MiniRing seconds={timeLeft} total={duration} color={accent} />
          </div>
          <div className="mg-meta-row">
            <span className="mg-score">{scoreLabel}: <b>{score}</b></span>
            <button className="mg-skip" onClick={onSkip}><SkipForward size={13} /> Lewati jeda</button>
          </div>
          {children}
        </>
      )}

      {finished && (
        <div className="mg-done">
          <div className="mg-done-badge"><PartyPopper size={24} color={accent} /></div>
          <div className="mg-done-title">{finishedTitle}</div>
          <div className="mg-done-note">{finishedNote}</div>
          <button className="mg-cta" onClick={onContinue}>{continueLabel} <ArrowRight size={16} /></button>
        </div>
      )}
    </div>
  );
}

/* ===========================================================
   GAME 1 — "Tangkap Bintang Berkilau"
   Dipakai di tengah Sesi 2. Bintang muncul acak & sebentar,
   tinggal di-tap sebanyak mungkin. Murni untuk having-fun,
   tidak memengaruhi skor tes.
=========================================================== */
export function TapBintangGame({ accent = "#D9A441", duration = 16, onDone = () => {} }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState([]);
  const [finished, setFinished] = useState(false);
  const idRef = useRef(0);
  const lifeTimers = useRef({});
  const spawnIntervalRef = useRef(null);

  const removeStar = useCallback((id) => {
    setStars((prev) => prev.filter((s) => s.id !== id));
    clearTimeout(lifeTimers.current[id]);
    delete lifeTimers.current[id];
  }, []);

  const spawnStar = useCallback(() => {
    const id = idRef.current++;
    const x = 8 + Math.random() * 78;
    const y = 10 + Math.random() * 68;
    const size = 30 + Math.round(Math.random() * 12);
    setStars((prev) => [...prev, { id, x, y, size }]);
    lifeTimers.current[id] = setTimeout(() => removeStar(id), 1050);
  }, [removeStar]);

  useEffect(() => {
    spawnIntervalRef.current = setInterval(spawnStar, 650);
    return () => {
      clearInterval(spawnIntervalRef.current);
      Object.values(lifeTimers.current).forEach(clearTimeout);
    };
  }, [spawnStar]);

  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      clearInterval(spawnIntervalRef.current);
      setStars([]);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finished]);

  const handleTap = (id) => {
    setScore((s) => s + 1);
    removeStar(id);
  };

  const handleSkip = () => {
    clearInterval(spawnIntervalRef.current);
    setFinished(true);
  };

  return (
    <GameFrame
      accent={accent}
      icon={<Star size={13} />}
      eyebrow="Jeda santai"
      title="Tangkap Bintang Berkilau!"
      subtitle="Tap bintang yang muncul secepat mungkin sebelum hilang. Cuma buat seru-seruan, ga ngaruh ke skor tes kok 😄"
      timeLeft={timeLeft}
      duration={duration}
      score={score}
      scoreLabel="Bintang tertangkap"
      onSkip={handleSkip}
      finished={finished}
      finishedTitle={score >= 8 ? "Kilat banget tangkapannya!" : "Asik, jeda selesai!"}
      finishedNote={`Kamu menangkap ${score} bintang. Yuk lanjut ke soal berikutnya.`}
      onContinue={() => onDone(score)}
      continueLabel="Lanjut soal berikutnya"
    >
      <div className="mg-play">
        <style>{`
          .mg-play { position:relative; height:230px; border-radius:18px; border:1px dashed rgba(244,238,224,.18); background: rgba(244,238,224,.03); overflow:hidden; }
          .mg-star-btn { position:absolute; border:none; background:transparent; cursor:pointer; padding:0; line-height:0; animation: mgPop .25s ease, mgFade 1.05s linear forwards; transform: translate(-50%,-50%); }
          @keyframes mgPop { from{ transform: translate(-50%,-50%) scale(.4); } to{ transform: translate(-50%,-50%) scale(1); } }
          @keyframes mgFade { 0%{opacity:1;} 78%{opacity:1;} 100%{opacity:0;} }
        `}</style>
        {stars.map((s) => (
          <button
            key={s.id}
            className="mg-star-btn"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            onClick={() => handleTap(s.id)}
            aria-label="Tangkap bintang"
          >
            <Star size={s.size} color={accent} fill={accent} />
          </button>
        ))}
      </div>
    </GameFrame>
  );
}

/* ===========================================================
   GAME 2 — "Mini Games! (Tebak Gambar Hewan)"
   Badan hewannya tetap, tapi kepalanya suka ketuker sendiri
   tiap di-klik — murni buat lucu-lucuan, TIDAK ADA benar/salah
   dan tidak memengaruhi hasil tes sama sekali.

   CARA GANTI GAMBAR:
   1. Taruh file .jpeg badan & kepala hewan di folder:
      public/games/hewan/
   2. Nama file HARUS SAMA PERSIS dengan yang tertulis di
      HEWAN_SETS di bawah ini.
   3. Kalau posisi kepala di atas badan kelihatan geser/gak pas,
      tinggal atur angka "headStyle" (top / left / width)
      punya masing-masing set sampai pas.
=========================================================== */
const HEWAN_SETS = [
  {
    id: "penguin",
    bodyImg: "/games/hewan/badan-penguin.jpeg",
    bodyLabel: "Penguin",
    resultImg: "/games/hewan/paus-penguin.jpeg",
    resultLabel: "Badan Penguin + Kepala Paus",
    heads: [
      { id: "kepala-penguin", name: "Penguin", img: "/games/hewan/kepala-penguin.jpeg" },
      { id: "kepala-anjing", name: "Anjing", img: "/games/hewan/kepala-anjing.jpeg" },
      { id: "kepala-paus", name: "Paus", img: "/games/hewan/kepala-paus.jpeg" },
    ],
  },
  {
    id: "ikan",
    bodyImg: "/games/hewan/badan-ikan.jpeg",
    bodyLabel: "Ikan",
    resultImg: "/games/hewan/kucing-ikan.jpeg",
    resultLabel: "Badan Ikan + Kepala Kucing",
    heads: [
      { id: "kepala-ikan", name: "Ikan", img: "/games/hewan/kepala-ikan.jpeg" },
      { id: "kepala-ayam-2", name: "Ayam", img: "/games/hewan/kepala-ayam.jpeg" },
      { id: "kepala-kucing", name: "Kucing", img: "/games/hewan/kepala-kucing.jpeg" },
    ],
  },
  {
    id: "ayam",
    bodyImg: "/games/hewan/badan-ayam.jpeg",
    bodyLabel: "Ayam",
    resultImg: "/games/hewan/ayam.jpeg",
    resultLabel: "Badan Ayam + Kepala Ayam",
    heads: [
      { id: "kepala-ayam", name: "Ayam", img: "/games/hewan/kepala-ayam.jpeg" },
      { id: "kepala-bebek", name: "Bebek", img: "/games/hewan/kepala-bebek.jpeg" },
      { id: "kepala-kambing", name: "Kambing", img: "/games/hewan/kepala-kambing.jpeg" },
    ],
  },
];

export function TebakHewanGame({ accent = "#D9A441", duration = 30, onDone = () => {} }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [guessCount, setGuessCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [setIndex, setSetIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const currentSet = HEWAN_SETS[setIndex];
  const isLastSet = setIndex === HEWAN_SETS.length - 1;

  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finished]);

  // apapun kepala yang diklik, yang muncul selalu foto hasil gabungan
  // yang sama — itu memang sengaja, itulah lucunya :)
  const handlePick = () => {
    if (finished || revealed) return;
    setRevealed(true);
    setGuessCount((c) => c + 1);
  };

  const handleNextAnimal = () => {
    if (isLastSet) {
      setFinished(true);
      return;
    }
    setSetIndex((i) => i + 1);
    setRevealed(false);
  };

  return (
    <GameFrame
      accent={accent}
      icon={<Shuffle size={13} />}
      eyebrow="Jeda santai"
      title="Mini Games!"
      subtitle="Klik salah satu kepala di bawah ini"
      timeLeft={timeLeft}
      duration={duration}
      score={guessCount}
      scoreLabel="Hewan ditebak"
      onSkip={() => setFinished(true)}
      finished={finished}
      finishedTitle={guessCount >= HEWAN_SETS.length ? "Kreator hewan hybrid sejati!" : "Seru kan? Jeda selesai!"}
      finishedNote={`Kamu udah nyoba ${guessCount} dari ${HEWAN_SETS.length} hewan. Yuk lanjut.`}
      onContinue={() => onDone(guessCount)}
      continueLabel="Lanjut"
    >
      <div className="mg-hewan">
        <style>{`
          .mg-hewan-stage { position:relative; height:230px; border-radius:18px; border:1px dashed rgba(244,238,224,.18); background: rgba(244,238,224,.03); overflow:hidden; display:flex; align-items:center; justify-content:center; }
          .mg-hewan-stage img { max-height:100%; max-width:100%; object-fit:contain; animation: mgHeadPop .25s ease; }
          @keyframes mgHeadPop { from{ opacity:0; transform: scale(.92); } to{ opacity:1; transform: scale(1); } }
          .mg-hewan-result { text-align:center; margin-top:10px; font-size:13px; color:#C9C2AE; }
          .mg-hewan-result b { color:#F4EEE0; }
          .mg-hewan-options { display:flex; gap:10px; margin-top:12px; }
          .mg-hewan-opt { flex:1; display:flex; align-items:center; justify-content:center; background: rgba(244,238,224,.04); border:1px solid rgba(244,238,224,.14); border-radius:14px; padding:10px; cursor:pointer; transition: transform .12s ease, border-color .2s ease; }
          .mg-hewan-opt:hover { transform: translateY(-2px); border-color: rgba(244,238,224,.35); }
          .mg-hewan-opt img { width:100%; height:56px; object-fit:contain; }
          .mg-hewan-next-row { display:flex; justify-content:center; margin-top:16px; }
          .mg-hewan-next-btn { display:inline-flex; align-items:center; gap:7px; background:transparent; border:1px solid var(--mg-accent); color:var(--mg-accent); font-size:13px; font-weight:600; padding:9px 18px; border-radius:999px; cursor:pointer; transition: background .2s ease; }
          .mg-hewan-next-btn:hover { background: color-mix(in srgb, var(--mg-accent) 16%, transparent); }
        `}</style>

        <div className="mg-hewan-stage">
          <img
            key={revealed ? currentSet.resultImg : currentSet.bodyImg}
            src={revealed ? currentSet.resultImg : currentSet.bodyImg}
            alt={revealed ? currentSet.resultLabel : currentSet.bodyLabel}
          />
        </div>

        {revealed ? (
          <>
            <div className="mg-hewan-result">
              Taraa! <b>{currentSet.resultLabel}</b> 🎉
            </div>
            <div className="mg-hewan-next-row">
              <button className="mg-hewan-next-btn" onClick={handleNextAnimal}>
                {isLastSet ? "Selesai, lanjut →" : "Tebak hewan selanjutnya →"}
              </button>
            </div>
          </>
        ) : (
          <div className="mg-hewan-options">
            {currentSet.heads.map((h) => (
              <button key={h.id} className="mg-hewan-opt" onClick={handlePick} aria-label={`Pilih kepala ${h.name}`}>
                <img src={h.img} alt={h.name} />
              </button>
            ))}
          </div>
        )}
      </div>
    </GameFrame>
  );
}