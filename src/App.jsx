import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Camera, 
  Activity, 
  FileText, 
  ChevronRight,
  Scan,
  Radio,
  Zap,
  Siren,
  ArrowRight,
  Cpu,
  Check,
  X,
  Plus,
  Play,
  RotateCw,
  Globe
} from 'lucide-react';

/**
 * SENTINEL AI - v9.8 "TACTICAL UPLOAD FIX"
 * Theme: Cybernetic HUD / Glassmorphism
 * Fixes: Upload Box UX (Click anywhere to add), Thumbnail Styling
 */

// --- Configuration ---
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";
const apiKey = "AIzaSyAKwIrgnKL8P07Gh_4KcTMVbfMRNCCYNdA"; 

// --- Translations ---
const LANGUAGES = {
  en: { label: "EN", full: "English" },
  es: { label: "ES", full: "Español" },
  fr: { label: "FR", full: "Français" },
  de: { label: "DE", full: "Deutsch" },
};

const TRANSLATIONS = {
  en: {
    heroTitle: "Crisis Intelligence.",
    heroSubtitle: "Immediate, AI-guided response protocols for bystanders in critical situations.",
    enter: "Activate System",
    demo: "Run Simulation",
    status: "SYSTEM READY",
    upload: "Awaiting Visual Input",
    tapCapture: "Acquire Target",
    orUpload: "Click to Upload Source",
    context: "Operational Context",
    description: "Situation Report",
    descPlaceholder: "Enter critical details...",
    analyze: "Execute Analysis",
    analyzing: "Processing Telemetry",
    hazards: "Threat Detection",
    voice: "Broadcast Script",
    actionPlan: "Response Protocol",
    log: "Incident Log",
    call911: "Emergency Call",
    newScan: "Reset System",
    types: ["Uncertain / General", "Medical Emergency", "Fire / Hazard", "Natural Disaster", "Traffic Accident", "Violence / Threat"]
  },
  es: { heroTitle: "Inteligencia de Crisis.", heroSubtitle: "Protocolos de respuesta inmediata guiados por IA.", enter: "Activar Sistema", demo: "Ejecutar Simulación", status: "SISTEMA LISTO", upload: "Subir datos visuales", analyzing: "Analizando...", tapCapture: "Subir Foto", orUpload: "Soporte: JPG, PNG", analyze: "Evaluar Amenaza", call911: "Llamada Emergencia", newScan: "Nuevo Incidente", hazards: "Amenazas", voice: "Guión", actionPlan: "Protocolo", log: "Reporte", severity: "Severidad", types: ["General", "Médico", "Fuego", "Desastre", "Tráfico", "Violencia"] },
  fr: { heroTitle: "Intelligence de Crise.", heroSubtitle: "Protocoles d'intervention immédiate guidés par l'IA.", enter: "Activer Système", demo: "Lancer Simulation", status: "SYSTÈME PRÊT", upload: "Télécharger données", analyzing: "Analyse...", tapCapture: "Photo Scène", orUpload: "Support: JPG, PNG", analyze: "Évaluer Menace", call911: "Appel Urgence", newScan: "Nouvel Incident", hazards: "Menaces", voice: "Script", actionPlan: "Protocole", log: "Rapport", severity: "Sévérité", types: ["Général", "Médical", "Feu", "Catastrophe", "Trafic", "Violence"] },
  de: { heroTitle: "Krisenintelligenz.", heroSubtitle: "Sofortige, KI-gesteuerte Reaktionsprotokolle.", enter: "System Aktivieren", demo: "Simulation Starten", status: "SYSTEM BEREIT", upload: "Daten hochladen", analyzing: "Analysiere...", tapCapture: "Foto hochladen", orUpload: "Format: JPG, PNG", analyze: "Bedrohung Prüfen", call911: "Notruf", newScan: "Neuer Vorfall", hazards: "Gefahren", voice: "Skript", actionPlan: "Protokoll", log: "Bericht", severity: "Schweregrad", types: ["Allgemein", "Medizinisch", "Feuer", "Katastrophe", "Verkehr", "Gewalt"] }
};

// --- CSS STYLES ---
const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

  :root {
    --bg-deep: #020617;
    --primary: #0ea5e9;
    --primary-glow: rgba(14, 165, 233, 0.5);
    --accent: #f43f5e;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --radius-lg: 16px;
    --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0; padding: 0;
    background-color: var(--bg-deep);
    color: var(--text-main);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  /* --- Layout & Grid --- */
  .app-wrap {
    min-height: 100vh;
    display: flex; flex-direction: column;
    position: relative;
    background: radial-gradient(circle at 50% 0%, #0f172a 0%, #020617 80%);
  }

  .container {
    width: 100%; max-width: 1200px;
    margin: 0 auto; padding: 0 1.5rem;
    position: relative; z-index: 10;
  }

  .flex-row { display: flex; align-items: center; justify-content: space-between; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .flex-col { display: flex; flex-direction: column; }
  .gap-4 { gap: 1rem; }

  .grid-layout {
    display: grid; grid-template-columns: 1fr; gap: 2rem;
  }
  @media (min-width: 768px) {
    .grid-layout { grid-template-columns: 4fr 6fr; }
  }

  /* --- Animations --- */
  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes pulse-ring {
    0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
    100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
  }
  @keyframes spin-slow { to { transform: rotate(360deg); } }
  @keyframes radar {
    0% { top: 0%; opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  .anim-entry { animation: slideUpFade 0.8s var(--ease) forwards; opacity: 0; }
  .animate-radar {
    position: absolute; left: 0; width: 100%; height: 2px;
    background: #3b82f6;
    box-shadow: 0 0 10px #3b82f6;
    animation: radar 2s linear infinite;
  }

  /* --- Floating Holographic Navbar --- */
  .navbar {
    height: 72px;
    position: sticky; 
    top: 24px; 
    z-index: 100;
    width: 90%; max-width: 1000px; margin: 0 auto;
    background: rgba(2, 6, 23, 0.6);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 999px;
    box-shadow: 
      0 4px 30px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(14, 165, 233, 0.1),
      inset 0 0 20px rgba(14, 165, 233, 0.05);
      
    display: flex; 
    align-items: center;
    padding: 0 1.5rem; /* Padding inside the bar */
    animation: slideDown 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .nav-inner { width: 100%; display: flex; align-items: center; justify-content: space-between; }
  
  .nav-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem; font-weight: 700; color: white;
    display: flex; align-items: center; gap: 12px;
    text-shadow: 0 0 15px rgba(14, 165, 233, 0.4);
    transition: 0.3s;
  }
  .nav-title:hover { text-shadow: 0 0 25px rgba(14, 165, 233, 0.8); }

  .lang-group {
    display: flex; gap: 4px; background: rgba(0,0,0,0.3); padding: 4px; border-radius: 99px;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .lang-btn {
    position: relative; padding: 6px 14px; font-size: 0.7rem; font-weight: 700;
    color: var(--text-muted); background: transparent; border: none; border-radius: 99px;
    cursor: pointer; transition: all 0.2s ease; overflow: hidden;
  }
  .lang-btn.active {
    color: var(--primary); background: rgba(14, 165, 233, 0.1);
    box-shadow: 0 0 10px rgba(14, 165, 233, 0.1) inset; border: 1px solid rgba(14, 165, 233, 0.2);
  }
  .lang-btn:hover:not(.active) { color: white; background: rgba(255, 255, 255, 0.05); }

  /* --- Tactical Cards --- */
  .card {
    background: linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(2, 6, 23, 0.8));
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-lg);
    padding: 2rem; position: relative; overflow: hidden;
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
  }
  .card::before {
    content: ''; position: absolute; top: 0; left: 0; width: 20px; height: 20px;
    border-top: 2px solid rgba(14, 165, 233, 0.5); border-left: 2px solid rgba(14, 165, 233, 0.5);
    border-top-left-radius: 8px;
  }
  .card::after {
    content: ''; position: absolute; bottom: 0; right: 0; width: 20px; height: 20px;
    border-bottom: 2px solid rgba(14, 165, 233, 0.5); border-right: 2px solid rgba(14, 165, 233, 0.5);
    border-bottom-right-radius: 8px;
  }

  /* --- Viewfinder Upload Zone --- */
  .upload-box {
    border: 1px solid rgba(14, 165, 233, 0.3);
    background: rgba(14, 165, 233, 0.03);
    border-radius: var(--radius-lg);
    height: 320px; position: relative; overflow: hidden;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; transition: 0.3s;
  }
  .upload-box:hover {
    background: rgba(14, 165, 233, 0.08);
    border-color: rgba(14, 165, 233, 0.6);
    box-shadow: 0 0 30px rgba(14, 165, 233, 0.15) inset;
  }
  .upload-scanline {
    position: absolute; top: 0; left: 0; width: 100%; height: 2px;
    background: #0ea5e9; box-shadow: 0 0 10px #0ea5e9;
    animation: scanline 2.5s linear infinite; opacity: 0.5; pointer-events: none;
  }
  .crosshair-tl { position: absolute; top: 15px; left: 15px; width: 10px; height: 10px; border-top: 2px solid #0ea5e9; border-left: 2px solid #0ea5e9; pointer-events: none; }
  .crosshair-tr { position: absolute; top: 15px; right: 15px; width: 10px; height: 10px; border-top: 2px solid #0ea5e9; border-right: 2px solid #0ea5e9; pointer-events: none; }
  .crosshair-bl { position: absolute; bottom: 15px; left: 15px; width: 10px; height: 10px; border-bottom: 2px solid #0ea5e9; border-left: 2px solid #0ea5e9; pointer-events: none; }
  .crosshair-br { position: absolute; bottom: 15px; right: 15px; width: 10px; height: 10px; border-bottom: 2px solid #0ea5e9; border-right: 2px solid #0ea5e9; pointer-events: none; }

  /* --- Buttons --- */
  .btn {
    border: none; cursor: pointer;
    font-family: 'JetBrains Mono', monospace; font-weight: 700;
    padding: 0.8rem 1.8rem; border-radius: 99px;
    transition: all 0.2s var(--ease);
    display: inline-flex; align-items: center; gap: 10px;
    text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.85rem;
  }
  .btn-primary {
    background: var(--primary); color: #020617;
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);
  }
  .btn-primary:hover { 
    background: #38bdf8; box-shadow: 0 0 30px rgba(14, 165, 233, 0.6); 
    transform: translateY(-2px);
  }
  .btn-secondary {
    background: rgba(255,255,255,0.05); color: var(--text-main);
    border: 1px solid rgba(255,255,255,0.2);
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: white; }
  .btn-danger {
    background: rgba(239, 68, 68, 0.15); color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.5);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.1);
    border-radius: 99px; padding: 0.6rem 1.2rem;
  }
  .btn-danger:hover {
    background: rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 25px rgba(239, 68, 68, 0.3);
    color: white; transform: scale(1.05);
  }

  /* --- Inputs --- */
  .input-label {
    display: block; font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem; font-weight: 700; color: var(--primary);
    margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;
  }
  .input-box {
    width: 100%; background: rgba(2, 6, 23, 0.6);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px; padding: 1rem;
    color: white; font-size: 1rem; outline: none;
    font-family: inherit; transition: 0.3s;
  }
  .input-box:focus { 
    border-color: var(--primary); 
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2); 
    background: rgba(2, 6, 23, 0.9);
  }

  /* --- Images & Gallery --- */
  .gallery-container {
    width: 100%; height: 100%; padding: 2rem;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 16px; align-content: center; justify-items: center;
    position: relative; z-index: 2;
  }
  .thumb-wrap { position: relative; width: 100px; height: 100px; transition: transform 0.2s; }
  .thumb-wrap:hover { transform: scale(1.05); z-index: 5; }
  .thumb { 
    width: 100%; height: 100%; border-radius: 8px; object-fit: cover; 
    border: 1px solid rgba(14, 165, 233, 0.5); box-shadow: 0 4px 10px rgba(0,0,0,0.5); 
  }
  .thumb-del { 
    position: absolute; top: -8px; right: -8px; 
    width: 24px; height: 24px; border-radius: 50%; 
    background: #ef4444; color: white; border: 2px solid var(--bg-deep);
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.5);
    z-index: 10;
  }

  /* Add Button Square */
  .add-btn-square {
    width: 100px; height: 100px; 
    border-radius: 8px; 
    border: 2px dashed rgba(14, 165, 233, 0.4);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: 0.2s;
    background: rgba(14, 165, 233, 0.05);
  }
  .add-btn-square:hover {
    background: rgba(14, 165, 233, 0.1);
    border-color: #0ea5e9;
    box-shadow: 0 0 15px rgba(14, 165, 233, 0.2);
    transform: scale(1.02);
  }

  /* Severity Borders */
  .sev-critical { border-left: 4px solid #ef4444; }
  .sev-high { 
    border-left: 4px solid #f97316; 
    background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(2, 6, 23, 0.9));
    box-shadow: 0 10px 40px -10px rgba(249, 115, 22, 0.3);
    border-top: 1px solid rgba(249, 115, 22, 0.2);
    border-right: 1px solid rgba(249, 115, 22, 0.2);
    border-bottom: 1px solid rgba(249, 115, 22, 0.2);
  }
  .sev-medium { 
    border-left: 4px solid #eab308; 
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(2, 6, 23, 0.9));
    box-shadow: 0 10px 40px -10px rgba(234, 179, 8, 0.3);
    border-top: 1px solid rgba(234, 179, 8, 0.2);
    border-right: 1px solid rgba(234, 179, 8, 0.2);
    border-bottom: 1px solid rgba(234, 179, 8, 0.2);
  }
  .sev-low { 
    border-left: 4px solid #22c55e; 
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(2, 6, 23, 0.9));
    box-shadow: 0 10px 40px -10px rgba(34, 197, 94, 0.3);
    border-top: 1px solid rgba(34, 197, 94, 0.2);
    border-right: 1px solid rgba(34, 197, 94, 0.2);
    border-bottom: 1px solid rgba(34, 197, 94, 0.2);
  }
`;

// --- Visual Components ---

const ParticleNet = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let particles = Array.from({length: 60}, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1
    }));
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = `rgba(14, 165, 233, ${0.5 * (p.size/3)})`; 
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.2 - dist/600})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    };
    const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    draw();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return <canvas ref={canvasRef} style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex: 0}} />;
};

// --- Mock Data ---
const DEMO_SCENARIO = {
  emergency_type: "VEHICULAR COLLISION",
  severity: "High",
  immediate_alert: "SECURE SCENE & CHECK FOR FUEL LEAKS",
  hazards: ["Oncoming Traffic", "Potential Fire Risk", "Glass Debris", "Airbag Dust"],
  instructions: [
    { step: 1, text: "Do not move injured passengers unless vehicle is on fire.", safety_warning: "Risk of spinal injury" },
    { step: 2, text: "Turn on hazard lights and set up emergency triangle if available.", safety_warning: "Visibility is critical" },
    { step: 3, text: "Call 911 immediately and report 'High impact collision with potential injuries'.", safety_warning: null },
    { step: 4, text: "Apply pressure to any active bleeding using clean cloth.", safety_warning: "Avoid direct contact with blood" }
  ],
  voice_script: "911, I am reporting a car accident at [Location]. Airbags deployed. Possible injuries. Scene is not secured from traffic.",
  report_summary: "High-velocity vehicular impact observed. Frontal damage significant. Deployment of safety systems confirmed. Potential for multi-trauma injuries. Scene requires traffic control and fire department standby."
};

const SentinelAI = () => {
  const [view, setView] = useState('landing');
  const [lang, setLang] = useState('en');
  // State for multiple images
  const [images, setImages] = useState([]);
  
  const [description, setDescription] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState(""); 
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showRawReport, setShowRawReport] = useState(false);
  
  const fileInputRef = useRef(null);
  const t = TRANSLATIONS[lang];

  const handleImageUpload = async (e) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const newImages = await Promise.all(files.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ file, preview: reader.result });
      reader.readAsDataURL(file);
    })));
    setImages(prev => [...prev, ...newImages]);
    if(fileInputRef.current) fileInputRef.current.value = '';
    setError(null);
  };

  const handleRemoveImage = (index, e) => {
    if (e) e.stopPropagation();
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const runSimulation = () => {
    setIsAnalyzing(true);
    setLoadingText("Initializing Demo Scenario...");
    setTimeout(() => setLoadingText("Simulating Visual Recognition..."), 800);
    setTimeout(() => setLoadingText("Retrieving Trauma Protocols..."), 1600);
    setTimeout(() => {
      setResult(DEMO_SCENARIO);
      setIsAnalyzing(false);
      setView('app');
    }, 2500);
  };

  const handleAnalyze = async () => {
    if (!apiKey && images.length > 0) {
      // Allow demo without key if user presses analyze on empty input, but real analysis needs key
      setError("API Key is missing in code. Please add your Gemini API Key to line 29.");
      return;
    }
    
    if (!description && images.length === 0) {
      setError("Please provide visual or textual input.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    const steps = ["Scanning Visual Hazards...", "Correlating Safety Protocols...", "Generating Action Plan..."];
    let stepIdx = 0;
    const interval = setInterval(() => { if(stepIdx < steps.length) setLoadingText(steps[stepIdx++]); }, 1000);

    try {
      const parts = [{ text: `Language: ${LANGUAGES[lang].full}. Category: ${t.types[categoryIndex]}. Desc: ${description || "None"}. Output strictly JSON.` }];
      images.forEach(img => {
        parts.push({ inlineData: { mimeType: img.file.type, data: img.preview.split(',')[1] } });
      });

      const systemPrompt = `Role: Sentinel AI Emergency Co-Pilot. Output JSON. Schema: { "emergency_type": "STR", "severity": "Low|Medium|High|Critical", "immediate_alert": "STR", "hazards": ["STR"], "instructions": [{"step": 1, "text": "STR", "safety_warning": "STR"}], "voice_script": "STR", "report_summary": "STR" }`;

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { responseMimeType: "application/json" },
          // Safety Settings removed for brevity, handled by model defaults or add if needed
        })
      });

      if (!response.ok) throw new Error("Connection Failed. Check API Key.");
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) throw new Error("AI returned empty response.");

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to parse AI response.");
      
      clearInterval(interval);
      setResult(JSON.parse(jsonMatch[0]));
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setError(err.message || "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'sev-critical';
      case 'high': return 'sev-high';
      case 'medium': return 'sev-medium';
      case 'low': return 'sev-low';
      default: return ''; 
    }
  };

  return (
    <div className="app-wrap">
      <style>{cssStyles}</style>
      <ParticleNet />
      
      {/* Navbar */}
      {(view === 'landing' || view === 'app') && (
        <header className="navbar flex-row">
          <div className="nav-inner">
            <div className="nav-title">
              <Shield size={28} color="#0ea5e9" fill="rgba(14,165,233,0.2)" /> SENTINEL
            </div>
            
            <div className="flex-center" style={{gap:'1.5rem'}}>
              {/* Language Tabs - Always Visible */}
              {view === 'landing' && (
                <div className="lang-group">
                  {Object.keys(LANGUAGES).map(key => (
                    <button 
                      key={key} 
                      onClick={() => setLang(key)} 
                      className={`lang-btn ${lang === key ? 'active' : ''}`}
                    >
                      {LANGUAGES[key].label}
                    </button>
                  ))}
                </div>
              )}
              {view === 'app' && (
                <a href="tel:911" className="btn btn-danger" style={{textDecoration:'none'}}>
                  <Siren size={18} className="animate-pulse" /> {t.call911}
                </a>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Landing */}
      {view === 'landing' && (
        <main className="container flex-center flex-col anim-entry" style={{flex:1, textAlign:'center'}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', background:'rgba(14,165,233,0.1)', borderRadius:99, border:'1px solid rgba(14,165,233,0.3)', fontSize:'0.75rem', fontWeight:700, color:'#38bdf8', marginBottom:'2rem', letterSpacing:'0.05em'}}>
            <span style={{width:8, height:8, background:'#0ea5e9', borderRadius:'50%', boxShadow:'0 0 10px #0ea5e9'}} className="animate-pulse"></span> SYSTEM READY
          </div>
          
          <h1 style={{fontSize:'clamp(3rem,6vw,5rem)', lineHeight:1.1, marginBottom:'1.5rem', background:'linear-gradient(to bottom, white, #94a3b8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontWeight: 900}}>
            {t.heroTitle}
          </h1>
          <p style={{fontSize:'1.2rem', color:'#94a3b8', maxWidth:600, marginBottom:'3rem'}}>{t.heroSubtitle}</p>
          
          <div className="flex-center" style={{gap:'1.5rem'}}>
            <button onClick={() => setView('app')} className="btn btn-primary">{t.enter} <ArrowRight size={20}/></button>
            <button onClick={runSimulation} className="btn btn-secondary"><Play size={20}/> {t.demo}</button>
          </div>
          
          <footer style={{position:'absolute', bottom:'2rem', fontSize:'0.75rem', color:'#64748b', letterSpacing:'0.2em', fontWeight:500}}>
            CREATED BY <a href="https://www.coderops.me/" target="_blank" rel="noopener noreferrer" style={{color:'white', textDecoration:'none', cursor:'pointer'}}>MOHAMED MAHZOUL</a>
          </footer>
        </main>
      )}

      {/* Disclaimer */}
      {view === 'disclaimer' && (
        <div style={{position:'fixed', inset:0, zIndex:200, background:'rgba(3,7,18,0.9)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="card anim-entry" style={{maxWidth:500, width:'90%'}}>
            <div className="flex-center" style={{justifyContent:'flex-start', gap:10, marginBottom:20, color:'#3b82f6'}}>
              <Shield size={32} />
              <h2>{t.disclaimerTitle}</h2>
            </div>
            <p style={{marginBottom:30, borderLeft:'2px solid #3b82f6', paddingLeft:15}}>{t.disclaimerText}</p>
            <button onClick={() => setView('app')} className="btn btn-primary" style={{width:'100%'}}>{t.agree}</button>
          </div>
        </div>
      )}

      {/* App Input */}
      {view === 'app' && !isAnalyzing && !result && (
        <main className="container anim-entry" style={{marginTop:'4rem', paddingBottom:'3rem', maxWidth:900}}>
          <div style={{textAlign:'center', marginBottom:'3rem'}}>
            <h2 style={{fontSize:'2.5rem', fontWeight:800, marginBottom:8, color: 'white'}}>{t.status}</h2>
            <p style={{fontSize:'1.1rem', color:'#94a3b8'}}>{t.upload}</p>
          </div>

          <div className="grid-layout">
            <div className="upload-box" onClick={() => images.length === 0 ? fileInputRef.current.click() : null}>
              <div className="upload-scanline"></div>
              <div className="crosshair-tl"></div><div className="crosshair-tr"></div><div className="crosshair-bl"></div><div className="crosshair-br"></div>
              
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden multiple accept="image/*" />
              
              {images.length === 0 ? (
                <div style={{position:'relative', zIndex:2, textAlign:'center'}}>
                  <Camera size={48} color="#64748b" style={{marginBottom:20}} />
                  <div style={{fontWeight:700, fontSize:'1.1rem', color:'white'}}>{t.tapCapture}</div>
                  <div style={{fontSize:'0.9rem', color:'#64748b', marginTop:8}}>{t.orUpload}</div>
                </div>
              ) : (
                <div className="gallery-container">
                  {images.map((img, i) => (
                    <div key={i} className="thumb-wrap" onClick={(e) => e.stopPropagation()}>
                      <img src={img.preview} className="thumb" alt={`upload-${i}`} />
                      <button onClick={(e) => handleRemoveImage(i, e)} className="thumb-del">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <div className="add-btn-square" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
                    <Plus size={32} color="#0ea5e9" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-col gap-4">
              <div>
                <label className="input-label">{t.context}</label>
                <select className="input-box" value={categoryIndex} onChange={e => setCategoryIndex(e.target.value)}>
                  {t.types.map((type, i) => <option key={i} value={i}>{type}</option>)}
                </select>
              </div>
              <div style={{flex:1}}>
                <label className="input-label">{t.description}</label>
                <textarea className="input-box" value={description} onChange={e => setDescription(e.target.value)} placeholder={t.descPlaceholder} style={{height:'100%', minHeight:120, resize:'none'}} />
              </div>
              <button onClick={handleAnalyze} className="btn btn-primary" style={{justifyContent:'center', padding:'1rem'}}><Activity size={20}/> {t.analyze}</button>
            </div>
          </div>
          
          {error && <div style={{marginTop:20, color:'#ef4444', textAlign:'center', background:'rgba(239,68,68,0.1)', padding:10, borderRadius:8}}>{error}</div>}
        </main>
      )}

      {/* Loading */}
      {isAnalyzing && (
        <div style={{position:'fixed', inset:0, zIndex:200, background:'var(--bg-deep)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{textAlign:'center'}}>
            <div style={{display:'inline-block', marginBottom:30, animation:'spin-slow 3s linear infinite'}}>
              <Cpu size={90} color="#0ea5e9" />
            </div>
            <h2 className="animate-pulse" style={{marginBottom:10, fontSize:'1.5rem', color:'white'}}>{t.analyzing}</h2>
            <p style={{fontFamily:'monospace', color:'#0ea5e9', fontSize:'1.1rem'}}>{loadingText}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {view === 'app' && result && (
        <main className="container anim-entry" style={{marginTop:'3rem', paddingBottom:'4rem'}}>
          <div className="flex-row" style={{marginBottom:'2rem'}}>
            <button onClick={() => setResult(null)} className="btn btn-secondary">
              <ChevronRight size={18} style={{transform:'rotate(180deg)'}} /> {t.newScan}
            </button>
            <div style={{display:'inline-flex', alignItems:'center', gap:8, padding:'6px 12px', background:'rgba(239,68,68,0.1)', borderRadius:99, border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', fontSize:'0.75rem', fontWeight:700}}>
              <span style={{width:8, height:8, background:'#ef4444', borderRadius:'50%'}} className="animate-pulse"></span> LIVE INCIDENT
            </div>
          </div>

          <div className={`card ${getSeverityStyle(result.severity)}`} style={{marginBottom:'2rem'}}>
            <div className="flex-row" style={{alignItems:'flex-start'}}>
              <div>
                <div style={{fontSize:'0.9rem', fontWeight:800, textTransform:'uppercase', color:'#94a3b8', marginBottom:12}}>SEVERITY: {result.severity}</div>
                <h1 style={{fontSize:'clamp(2.5rem,4vw,3.5rem)', lineHeight:1.1, color:'white'}}>{result.emergency_type}</h1>
              </div>
              {['high', 'critical'].includes(result.severity?.toLowerCase()) && (
                <a href="tel:911" className="btn btn-danger">
                  <Siren size={24} className="animate-pulse"/> {t.call911}
                </a>
              )}
            </div>
            <div style={{marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.1)'}}>
              <div style={{fontSize:'0.8rem', fontWeight:800, opacity:0.7, marginBottom:8, color:'#94a3b8'}}>IMMEDIATE ACTION</div>
              <div style={{fontSize:'1.5rem', fontWeight:700, color:'white'}}>{result.immediate_alert}</div>
            </div>
          </div>

          <div className="grid-layout">
            <div className="flex-col gap-4">
              <div className="card">
                <div className="flex-center" style={{justifyContent:'flex-start', gap:10, marginBottom:20, color:'#94a3b8', fontWeight:700, fontSize:'0.9rem'}}>
                  <Scan size={18} color="#0ea5e9"/> {t.hazards}
                </div>
                {result.hazards.map((h, i) => (
                  <div key={i} style={{display:'flex', gap:12, marginBottom:10, alignItems:'center', background:'rgba(255,255,255,0.03)', padding:12, borderRadius:8}}>
                    <AlertTriangle size={16} color="#f97316"/> <span style={{fontWeight:500, color:'white'}}>{h}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{background:'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(2,6,23,0.9))'}}>
                <div className="flex-center" style={{justifyContent:'flex-start', gap:10, marginBottom:20, color:'#94a3b8', fontWeight:700, fontSize:'0.9rem'}}>
                  <Radio size={18} color="#0ea5e9"/> {t.voice}
                </div>
                <p style={{fontStyle:'italic', fontSize:'1.2rem', color:'white', lineHeight:1.6}}>"{result.voice_script}"</p>
              </div>
            </div>

            <div>
              <div className="flex-center" style={{justifyContent:'flex-start', gap:12, marginBottom:20}}>
                <Zap size={28} color="#0ea5e9"/> <h2 style={{fontSize:'1.5rem', color:'white'}}>{t.actionPlan}</h2>
              </div>
              {result.instructions.map((step, i) => (
                <div key={i} className="anim-entry" style={{display:'flex', gap:20, marginBottom:20, background:'rgba(255,255,255,0.02)', padding:24, borderRadius:16, border:'1px solid rgba(255,255,255,0.05)', animationDelay: `${i*100}ms`}}>
                  <div style={{width:36, height:36, background:'#1e293b', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#0ea5e9', flexShrink:0, border:'1px solid rgba(14, 165, 233, 0.3)'}}>{i+1}</div>
                  <div>
                    <div style={{fontSize:'1.2rem', fontWeight:600, marginBottom:10, color:'white'}}>{step.text}</div>
                    {step.safety_warning && <div style={{display:'inline-flex', alignItems:'center', gap:8, fontSize:'0.9rem', color:'#ef4444', background:'rgba(239,68,68,0.1)', padding:'6px 12px', borderRadius:6}}><Shield size={14}/> {step.safety_warning}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default SentinelAI;
