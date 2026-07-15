import {
  Sigma, HardHat, Cpu, Gavel, Stethoscope, Landmark,
  Palette, Brain, GraduationCap, Sprout, Megaphone,
  HeartPulse, Pill, FlaskConical, Plane,
} from "lucide-react";

/* ---------------------------------------------------------
   Data fakultas & jurusan — dipakai di Home (preview) dan
   di hasil pencocokan fakultas (Sesi 2 & Hasil Gabungan).
   Nama fakultas di sini HARUS SAMA PERSIS dengan key yang
   dipakai di FACULTY_WEIGHTS (Sesi2Quiz.jsx) supaya bisa
   dicocokkan otomatis.
--------------------------------------------------------- */
export const FACULTIES = [
  {
    name: "Bisnis & Ekonomi",
    icon: Sigma,
    color: "#D9A441",
    jurusan: ["Manajemen", "Akuntansi", "Ekonomi Pembangunan", "Bisnis Digital"],
  },
  {
    name: "Teknik",
    icon: HardHat,
    color: "#4D5FA6",
    jurusan: ["Teknik Sipil", "Teknik Mesin", "Teknik Elektro", "Teknik Industri"],
  },
  {
    name: "Ilmu Komputer & Informatika",
    icon: Cpu,
    color: "#2F7A5E",
    jurusan: ["Ilmu Komputer", "Sistem Informasi", "Teknik Informatika", "Data Science"],
  },
  {
    name: "Hukum",
    icon: Gavel,
    color: "#8A5A2B",
    jurusan: ["Ilmu Hukum", "Hukum Bisnis", "Hukum Internasional"],
  },
  {
    name: "Kedokteran",
    icon: Stethoscope,
    color: "#A23B4A",
    jurusan: ["Pendidikan Dokter", "Kedokteran Gigi", "Ilmu Keperawatan"],
  },
  {
    name: "Ilmu Sosial & Politik",
    icon: Landmark,
    color: "#B07A2E",
    jurusan: ["Ilmu Politik", "Hubungan Internasional", "Sosiologi", "Administrasi Publik"],
  },
  {
    name: "Seni, Desain & Arsitektur",
    icon: Palette,
    color: "#C1543C",
    jurusan: ["Desain Komunikasi Visual", "Arsitektur", "Seni Rupa", "Desain Interior"],
  },
  {
    name: "Psikologi",
    icon: Brain,
    color: "#7A5FB8",
    jurusan: ["Psikologi", "Psikologi Pendidikan"],
  },
  {
    name: "Pendidikan",
    icon: GraduationCap,
    color: "#3A8F82",
    jurusan: ["Pendidikan Guru SD", "Pendidikan Bahasa Inggris", "Bimbingan & Konseling"],
  },
  {
    name: "Pertanian",
    icon: Sprout,
    color: "#5C8A3A",
    jurusan: ["Agroteknologi", "Agribisnis", "Ilmu Tanah"],
  },
  {
    name: "Ilmu Komunikasi",
    icon: Megaphone,
    color: "#C77B3F",
    jurusan: ["Jurnalistik", "Public Relations", "Broadcasting & Media"],
  },
  {
    name: "Kesehatan Masyarakat",
    icon: HeartPulse,
    color: "#B84C6A",
    jurusan: ["Kesehatan Masyarakat", "Gizi Masyarakat"],
  },
  {
    name: "Farmasi",
    icon: Pill,
    color: "#3F7FB0",
    jurusan: ["Farmasi", "Farmasi Klinis & Komunitas"],
  },
  {
    name: "Sains & Matematika",
    icon: FlaskConical,
    color: "#4A9B7F",
    jurusan: ["Matematika", "Fisika", "Kimia", "Biologi"],
  },
  {
    name: "Pariwisata & Perhotelan",
    icon: Plane,
    color: "#D97B5A",
    jurusan: ["Manajemen Perhotelan", "Pariwisata", "Tata Boga"],
  },
];

export function jurusanOf(facultyName) {
  return FACULTIES.find((f) => f.name === facultyName)?.jurusan || [];
}
