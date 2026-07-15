import React, { useRef, useState } from "react";
import { Sparkles, ArrowRight, Brain, ListChecks, Gamepad2, ChevronDown } from "lucide-react";
import { FACULTIES } from "../data/faculties.js";

/* ---------------------------------------------------------
   Home — halaman pembuka Kenali Bakatmu.
   Tema visual senada dengan sesi-sesi lain (malam batik:
   indigo gelap + emas + terakota), dioptimalkan mobile-first
   (tombol besar, grid menyesuaikan lebar layar sempit).
--------------------------------------------------------- */

function MagneticButton({ children, onClick }) {
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.2;
    const y = (e.clientY - r.top - r.height / 2) * 0.2;
    setT({ x, y });
  };
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      className="home-cta"
      style={{ transform: `translate(${t.x}px, ${t.y}px)` }}
    >
      {children}
    </button>
  );
}

function FacultyCard({ faculty, open, onToggle }) {
  const Icon = faculty.icon;
  return (
    <div className={`fac-card ${open ? "is-open" : ""}`} style={{ "--fc": faculty.color }}>
      <button className="fac-head" onClick={onToggle}>
        <span className="fac-icon"><Icon size={18} color={faculty.color} /></span>
        <span className="fac-name">{faculty.name}</span>
        <ChevronDown size={16} className="fac-chevron" />
      </button>
      {open && (
        <div className="fac-body">
          {faculty.jurusan.map((j) => (
            <span className="fac-pill" key={j}>{j}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home({ onStart = () => {} }) {
  const [openFaculty, setOpenFaculty] = useState(null);

  return (
    <div className="home-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .home-wrap {
          --indigo: #15102A; --indigo-2: #1E1638; --gold: #D9A441;
          --cream: #F4EEE0; --cream-dim: #C9C2AE; --terracotta: #C1543C;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative; min-height: 100vh; overflow-x: hidden;
          background: radial-gradient(ellipse at top, var(--indigo-2) 0%, var(--indigo) 60%, #0D0A1C 100%);
          color: var(--cream);
        }

        .home-aurora { position:absolute; inset:0; z-index:0; overflow:hidden; }
        .home-aurora span { position:absolute; border-radius:50%; filter: blur(90px); opacity:.32; animation: hDrift 20s ease-in-out infinite alternate; }
        .home-aurora span:nth-child(1){ width:420px; height:420px; background: var(--gold); top:-140px; left:-110px; }
        .home-aurora span:nth-child(2){ width:360px; height:360px; background: var(--terracotta); bottom:-120px; right:-90px; animation-duration:24s; animation-delay:-6s; }
        .home-aurora span:nth-child(3){ width:280px; height:280px; background:#2F7A5E; top:38%; right:8%; opacity:.16; animation-duration:28s; animation-delay:-10s; }
        @keyframes hDrift { from{ transform:translate(0,0) scale(1);} to{ transform:translate(36px,-26px) scale(1.1);} }

        .home-motif { position:absolute; bottom:-2px; left:50%; transform:translateX(-50%); width:min(900px,140vw); opacity:.12; z-index:0; pointer-events:none; }

        .home-stage { position:relative; z-index:1; max-width:760px; margin:0 auto; padding: 56px 20px 60px; }

        .home-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12px; letter-spacing:.14em; text-transform:uppercase; color: var(--gold); font-weight:600; }

        .home-title {
          font-family:'Fraunces', serif; font-weight:600; font-size: clamp(30px,7vw,50px); line-height:1.08;
          margin: 14px 0 14px; letter-spacing:-.01em;
          background: linear-gradient(100deg, var(--cream) 30%, var(--gold) 55%, var(--cream) 75%);
          background-size: 220% auto; -webkit-background-clip:text; background-clip:text; color:transparent;
          animation: hShine 6s linear infinite;
        }
        @keyframes hShine { to { background-position: -220% center; } }

        .home-lede { color: var(--cream-dim); font-size: 15.5px; line-height:1.7; max-width:560px; margin-bottom: 30px; }

        .home-steps { display:grid; grid-template-columns: repeat(3,1fr); gap:10px; margin-bottom: 30px; }
        .home-step { border:1px solid rgba(244,238,224,.12); background: rgba(244,238,224,.04); border-radius:16px; padding:16px 14px; }
        .home-step-num { display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:50%; background: rgba(217,164,65,.18); color:var(--gold); font-size:12px; font-weight:700; margin-bottom:10px; }
        .home-step h4 { font-family:'Fraunces', serif; font-size:14.5px; font-weight:600; margin:0 0 4px; }
        .home-step p { font-size:12px; color: var(--cream-dim); line-height:1.5; margin:0; }

        .home-cta {
          display:inline-flex; align-items:center; gap:8px; color:#16110B; font-weight:700; font-size:15.5px;
          border:none; border-radius:999px; padding:16px 30px; cursor:pointer; background: var(--gold);
          box-shadow: 0 10px 28px -8px rgba(217,164,65,.6); transition: box-shadow .2s ease;
          width: 100%; justify-content:center;
        }
        .home-cta:hover { box-shadow: 0 12px 32px -6px rgba(217,164,65,.75); }

        .home-meta { text-align:center; font-size:12px; color: rgba(244,238,224,.5); margin-top:12px; }

        .home-divider { display:flex; align-items:center; gap:12px; margin: 46px 0 20px; color: rgba(244,238,224,.4); font-size:12px; letter-spacing:.1em; text-transform:uppercase; }
        .home-divider::before, .home-divider::after { content:""; flex:1; height:1px; background: rgba(244,238,224,.14); }

        .fac-list { display:flex; flex-direction:column; gap:8px; }
        .fac-card { border:1px solid rgba(244,238,224,.12); background: rgba(244,238,224,.03); border-radius:14px; overflow:hidden; transition: border-color .2s ease; }
        .fac-card.is-open { border-color: color-mix(in srgb, var(--fc) 55%, transparent); }
        .fac-head { width:100%; display:flex; align-items:center; gap:12px; background:transparent; border:none; cursor:pointer; padding:13px 14px; text-align:left; color: var(--cream); }
        .fac-icon { width:34px; height:34px; min-width:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; background: color-mix(in srgb, var(--fc) 20%, transparent); }
        .fac-name { flex:1; font-size:13.5px; font-weight:600; }
        .fac-chevron { transition: transform .2s ease; opacity:.6; flex-shrink:0; }
        .fac-card.is-open .fac-chevron { transform: rotate(180deg); }
        .fac-body { padding: 0 14px 14px 60px; display:flex; flex-wrap:wrap; gap:6px; animation: hRise .3s ease; }
        @keyframes hRise { from{opacity:0; transform:translateY(-4px);} to{opacity:1; transform:translateY(0);} }
        .fac-pill { font-size:11.5px; padding:5px 10px; border-radius:999px; border:1px solid rgba(244,238,224,.16); color: var(--cream-dim); }

        footer.home-note { position:relative; z-index:1; text-align:center; font-size:12px; color: rgba(244,238,224,.45); padding-bottom: 30px; }

        @media (max-width: 480px) {
          .home-steps { grid-template-columns: 1fr; }
          .fac-body { padding-left: 14px; }
        }
      `}</style>

      <div className="home-aurora"><span /><span /><span /></div>
      <svg className="home-motif" viewBox="0 0 600 220" fill="none">
        <path d="M0 220 L0 160 L120 160 L150 60 L180 160 L260 160 L300 0 L340 160 L420 160 L450 60 L480 160 L600 160 L600 220 Z" fill="var(--gold)" />
      </svg>

      <div className="home-stage">
        <span className="home-eyebrow"><Sparkles size={13} /> Kenali Bakatmu</span>
        <h1 className="home-title">Temukan bakat, fakultas &amp; gaya belajarmu</h1>
        <p className="home-lede">
          Empat sesi singkat yang memetakan kepribadian, kekuatan akademik, dan cara belajarmu —
          lalu mencocokkannya dengan fakultas &amp; jurusan yang paling sesuai. Santai aja, ada jeda main game di tengah-tengah.
        </p>

        <div className="home-steps">
          <div className="home-step">
            <span className="home-step-num">1</span>
            <h4><Brain size={13} style={{ verticalAlign: -2, marginRight: 4 }} />Kepribadian</h4>
            <p>6 pertanyaan kilat soal cara kamu berpikir &amp; bertindak.</p>
          </div>
          <div className="home-step">
            <span className="home-step-num">2</span>
            <h4><ListChecks size={13} style={{ verticalAlign: -2, marginRight: 4 }} />Mata pelajaran</h4>
            <p>Cocokkan kekuatan akademikmu ke fakultas yang tepat.</p>
          </div>
          <div className="home-step">
            <span className="home-step-num">3</span>
            <h4><Gamepad2 size={13} style={{ verticalAlign: -2, marginRight: 4 }} />Jeda seru</h4>
            <p>Mini game santai di antara sesi, ga ngaruh ke skor.</p>
          </div>
        </div>

        <MagneticButton onClick={onStart}>
          Mulai Sesi 1 <ArrowRight size={17} />
        </MagneticButton>
        <div className="home-meta">Sekitar 10–15 menit · hasil langsung muncul di akhir</div>

        <div className="home-divider">Fakultas &amp; jurusan yang bisa kamu temukan</div>

        <div className="fac-list">
          {FACULTIES.map((f) => (
            <FacultyCard
              key={f.name}
              faculty={f}
              open={openFaculty === f.name}
              onToggle={() => setOpenFaculty(openFaculty === f.name ? null : f.name)}
            />
          ))}
        </div>
      </div>

      <footer className="home-note">Kenali Bakatmu · rangkaian tes minat, akademik &amp; gaya belajar</footer>
    </div>
  );
}
