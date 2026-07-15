import React, { useState } from "react";
import { ArrowRight, RotateCcw, Sparkles, Trophy } from "lucide-react";
import Home from "./pages/Home.jsx";
import Sesi1Quiz from "./sessions/Sesi1Quiz.jsx";
import Sesi2Quiz from "./sessions/Sesi2Quiz.jsx";
import Sesi3Quiz from "./sessions/Sesi3Quiz.jsx";
import { TebakHewanGame } from "./components/MiniGames.jsx";
import { jurusanOf } from "./data/faculties.js";

const STAGES = ["home", "sesi1", "sesi2", "sesi3", "hasil"];

export default function App() {
  const [stage, setStage] = useState("home");
  const [hasil, setHasil] = useState({ sesi1: null, sesi2: null, sesi3: null });

  const effectiveStage = stage === "transisiHewan" ? "sesi1" : stage;
  const stageIndex = STAGES.indexOf(effectiveStage);

  const goTo = (next) => setStage(next);

  const resetAll = () => {
    setHasil({ sesi1: null, sesi2: null, sesi3: null });
    setStage("home");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {stage !== "home" && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            display: "flex", gap: 4, padding: "10px 14px",
            background: "rgba(13,10,28,0.55)", backdropFilter: "blur(6px)",
          }}
        >
          {STAGES.map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1, height: 3, borderRadius: 3,
                background: i <= stageIndex ? "#D9A441" : "rgba(244,238,224,.18)",
                transition: "background .3s ease",
              }}
            />
          ))}
        </div>
      )}

      {stage === "home" && <Home onStart={() => goTo("sesi1")} />}

      {stage === "sesi1" && (
        <Sesi1Quiz
          onComplete={(data) => {
            setHasil((h) => ({ ...h, sesi1: data }));
            goTo("transisiHewan");
          }}
        />
      )}

      {stage === "transisiHewan" && (
        <TransisiHewanJeda theme={hasil.sesi1?.color || "#D9A441"} onDone={() => goTo("sesi2")} />
      )}

      {stage === "sesi2" && (
        <Sesi2Quiz
          onComplete={(data) => {
            setHasil((h) => ({ ...h, sesi2: data }));
            goTo("sesi3");
          }}
        />
      )}

      {stage === "sesi3" && (
        <Sesi3Quiz
          onComplete={(data) => {
            setHasil((h) => ({ ...h, sesi3: data }));
            goTo("hasil");
          }}
        />
      )}

      {stage === "hasil" && <HasilGabungan hasil={hasil} onRestart={resetAll} />}
    </div>
  );
}

function TransisiHewanJeda({ theme, onDone }) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: "#F4EEE0",
        display: "flex",
        alignItems: "center",
        background: "radial-gradient(ellipse at top, #1E1638 0%, #15102A 60%, #0D0A1C 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>
      <div style={{ position: "relative", zIndex: 1, width: "100%", padding: "90px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "#D9A441", fontWeight: 600 }}>
            <Sparkles size={13} /> Sebelum Sesi 2
          </span>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "clamp(24px,4vw,34px)", margin: "12px 0 0" }}>
            Santai dulu, main sebentar yuk!
          </h1>
        </div>
        <TebakHewanGame accent={theme} onDone={onDone} />
      </div>
    </div>
  );
}

function HasilGabungan({ hasil, onRestart }) {
  const { sesi1, sesi2, sesi3 } = hasil;
  const theme = sesi1?.color || "#D9A441";

  return (
    <div
      style={{
        "--theme": theme,
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: "#F4EEE0",
        background: "radial-gradient(ellipse at top, #1E1638 0%, #15102A 60%, #0D0A1C 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .hasil-stage { position:relative; z-index:1; max-width:760px; margin:0 auto; padding:90px 24px 80px; }
        .hasil-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:#D9A441; font-weight:600; }
        .hasil-title { font-family:'Fraunces', serif; font-weight:700; font-size:clamp(28px,4.6vw,40px); line-height:1.15; margin:14px 0 30px; }
        .hasil-grid { display:grid; grid-template-columns:1fr; gap:14px; margin-bottom: 28px; }
        .hasil-card { border:1px solid rgba(244,238,224,.14); background:rgba(244,238,224,.04); border-radius:18px; padding:22px 24px; }
        .hasil-card h3 { font-family:'Fraunces', serif; font-size:17px; font-weight:600; margin:0 0 10px; display:flex; align-items:center; gap:10px; }
        .hasil-card p { color:#C9C2AE; font-size:14px; line-height:1.65; margin:0; }
        .hasil-pill-row { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
        .hasil-pill { font-size:12px; padding:6px 12px; border-radius:999px; border:1px solid rgba(244,238,224,.18); }
        .hasil-faculty-list { display:flex; flex-direction:column; gap:12px; margin-top:12px; }
        .hasil-faculty-row { display:flex; flex-direction:column; gap:6px; }
        .hasil-pill-main { align-self:flex-start; border-color: rgba(217,164,65,.4); }
        .hasil-jurusan-row { display:flex; flex-wrap:wrap; gap:6px; padding-left:4px; }
        .hasil-pill-jurusan { font-size:11px; padding:4px 10px; color:#9C93C2; border-color: rgba(244,238,224,.1); }
        .hasil-btn { margin-top:8px; display:inline-flex; align-items:center; gap:8px; background:#D9A441; color:#16110B; font-weight:700; font-size:14.5px; border:none; border-radius:999px; padding:14px 26px; cursor:pointer; }
        .hasil-btn:hover { filter:brightness(1.05); }
      `}</style>

      <div className="hasil-stage">
        <span className="hasil-eyebrow"><Trophy size={13} /> Hasil Gabungan</span>
        <h1 className="hasil-title">Profil bakat &amp; gaya belajarmu sudah lengkap</h1>

        <div className="hasil-grid">
          <div className="hasil-card">
            <h3>
              <Sparkles size={16} color="#D9A441" />
              Kepribadian — {sesi1 ? sesi1.label : "—"}
            </h3>
            <p>{sesi1 ? sesi1.desc : "Belum ada data dari Sesi 1."}</p>
          </div>

          <div className="hasil-card">
            <h3>
              <Sparkles size={16} color="#D9A441" />
              Fakultas paling sesuai
            </h3>
            <p>Berdasarkan tes mata pelajaran di Sesi 2:</p>
            <div className="hasil-faculty-list">
              {(sesi2?.facultyMatches || []).map((m, i) => (
                <div key={m.name} className="hasil-faculty-row">
                  <span className="hasil-pill hasil-pill-main">
                    {i + 1}. {m.name} · {m.pct}%
                  </span>
                  <div className="hasil-jurusan-row">
                    {jurusanOf(m.name).map((j) => (
                      <span key={j} className="hasil-pill hasil-pill-jurusan">{j}</span>
                    ))}
                  </div>
                </div>
              ))}
              {!sesi2 && <span style={{ color: "#9C93C2", fontSize: 13 }}>Belum ada data dari Sesi 2.</span>}
            </div>
          </div>

          <div className="hasil-card">
            <h3>
              <Sparkles size={16} color="#D9A441" />
              Gaya belajar — {sesi3 ? sesi3.dominant.label : "—"}
            </h3>
            <p>{sesi3 ? sesi3.dominant.desc : "Belum ada data dari Sesi 3."}</p>
          </div>
        </div>

        <button className="hasil-btn" onClick={onRestart}>
          <RotateCcw size={15} /> Ulangi dari awal
        </button>
      </div>
    </div>
  );
}