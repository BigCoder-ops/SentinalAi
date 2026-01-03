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
  Plus
} from 'lucide-react';

/**
 * SENTINEL AI - v8.1 "PROVIDENCE ULTIMATE" (FIXED)
 * Theme: Cyber-Glass Tactical Interface
 * Features: Multiple Image Upload, Image Deletion, Advanced animations
 * Fixes: JSON Parsing Safety, Null Checks, CSS Vendor Prefixes
 */

// --- Constants ---
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
    subtitle: "Situational Awareness & Response System",
    enter: "Initialize Protocol",
    disclaimerTitle: "Liability Protocol",
    disclaimerText: "This AI supports critical decision-making but does not replace professional emergency services (911/EMS).",
    agree: "Acknowledge & Continue",
    status: "System Active",
    upload: "Awaiting Visual Input",
    tapCapture: "Acquire Targets",
    orUpload: "Click to Upload Sources",
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
  es: {
    subtitle: "Sistema de Conciencia Situacional",
    enter: "Inicializar Protocolo",
    disclaimerTitle: "Protocolo de Responsabilidad",
    disclaimerText: "Esta IA apoya la toma de decisiones pero no reemplaza a los servicios de emergencia (911).",
    agree: "Reconocer y Continuar",
    status: "Sistema Activo",
    upload: "Esperando Entrada Visual",
    tapCapture: "Adquirir Objetivos",
    orUpload: "Clic para Subir Archivos",
    context: "Contexto Operativo",
    description: "Informe de Situación",
    descPlaceholder: "Ingrese detalles críticos...",
    analyze: "Ejecutar Análisis",
    analyzing: "Procesando Telemetría",
    hazards: "Detección de Amenazas",
    voice: "Guión de Difusión",
    actionPlan: "Protocolo de Respuesta",
    log: "Registro de Incidente",
    call911: "Llamada de Emergencia",
    newScan: "Reiniciar Sistema",
    types: ["Incierto / General", "Emergencia Médica", "Incendio / Peligro", "Desastre Natural", "Accidente de Tráfico", "Violencia / Amenaza"]
  },
  fr: {
    subtitle: "Système de Conscience Situationnelle",
    enter: "Initialiser le Protocole",
    disclaimerTitle: "Protocole de Responsabilité",
    disclaimerText: "Cette IA aide à la décision mais ne remplace pas les services d'urgence (112).",
    agree: "Reconnaître et Continuer",
    status: "Système Actif",
    upload: "Attente Entrée Visuelle",
    tapCapture: "Acquérir Cibles",
    orUpload: "Télécharger Fichiers",
    context: "Contexte Opérationnel",
    description: "Rapport de Situation",
    descPlaceholder: "Entrez détails critiques...",
    analyze: "Exécuter Analyse",
    analyzing: "Traitement Télémétrie",
    hazards: "Détection Menaces",
    voice: "Script Diffusion",
    actionPlan: "Protocole Réponse",
    log: "Journal Incident",
    call911: "Appel Urgence",
    newScan: "Réinitialiser",
    types: ["Incertain / Général", "Urgence Médicale", "Incendie / Danger", "Catastrophe Naturelle", "Accident Route", "Violence / Menace"]
  },
  de: {
    subtitle: "Situationsbewusstseinssystem",
    enter: "Protokoll Initialisieren",
    disclaimerTitle: "Haftungsprotokoll",
    disclaimerText: "Diese KI unterstützt Entscheidungen, ersetzt aber nicht professionelle Notdienste (112).",
    agree: "Bestätigen & Fortfahren",
    status: "System Aktiv",
    upload: "Warte auf Visuellen Input",
    tapCapture: "Ziel Erfassen",
    orUpload: "Datei Hochladen",
    context: "Operativer Kontext",
    description: "Lagebericht",
    descPlaceholder: "Kritische Details eingeben...",
    analyze: "Analyse Ausführen",
    analyzing: "Verarbeite Telemetrie",
    hazards: "Bedrohungserkennung",
    voice: "Sende-Skript",
    actionPlan: "Reaktionsprotokoll",
    log: "Vorfallprotokoll",
    call911: "Notruf",
    newScan: "System Reset",
    types: ["Unsicher / Allgemein", "Medizinischer Notfall", "Feuer / Gefahr", "Naturkatastrophe", "Verkehrsunfall", "Gewalt / Bedrohung"]
  }
};

// --- ADVANCED CSS STYLESHEET ---
const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    --bg-deep: #02040a;
    --bg-panel: rgba(13, 18, 30, 0.7);
    
    --primary-cyan: #06b6d4;
    --primary-glow: rgba(6, 182, 212, 0.6);
    --secondary-blue: #3b82f6;
    
    --alert-red: #ef4444;
    --alert-orange: #f97316;
    --alert-yellow: #eab308;
    
    --text-white: #ffffff;
    --text-gray: #94a3b8;
    
    --glass-border: 1px solid rgba(255, 255, 255, 0.08);
    --glass-highlight: 1px solid rgba(255, 255, 255, 0.15);
    
    --ease-elastic: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  }

  * { box-sizing: border-box; }

  .app-root {
    min-height: 100vh;
    width: 100%;
    background-color: var(--bg-deep);
    color: var(--text-white);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* --- Dynamic Background --- */
  .grid-overlay {
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
    mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
    pointer-events: none;
    z-index: 0;
  }

  /* --- Typography --- */
  h1, h2, h3, h4 { margin: 0; letter-spacing: -0.02em; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  .text-glow { text-shadow: 0 0 20px var(--primary-glow); }
  .text-gradient {
    background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* --- Layout Utilities --- */
  .container-width {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 10;
  }

  .flex-center { display: flex; align-items: center; justify-content: center; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }
  .flex-col { display: flex; flex-direction: column; }
  .gap-4 { gap: 1rem; }
  .gap-8 { gap: 2rem; }

  /* --- Animations --- */
  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scan {
    0% { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
  }
  @keyframes spin-slow { to { transform: rotate(360deg); } }

  .anim-entry { animation: slideUpFade 0.8s var(--ease-smooth) forwards; opacity: 0; }
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }

  /* --- Components --- */
  
  /* Navbar */
  .navbar {
    height: 80px;
    border-bottom: var(--glass-border);
    background: rgba(2, 4, 10, 0.8);
    backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 700;
    font-size: 1.1rem;
    letter-spacing: 0.05em;
  }
  .brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.1));
    border: 1px solid rgba(6,182,212,0.3);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 15px rgba(6,182,212,0.15);
  }

  /* Buttons */
  .btn-base {
    position: relative;
    border: none;
    outline: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    overflow: hidden;
  }

  .btn-primary {
    background: rgba(6, 182, 212, 0.1);
    color: var(--primary-cyan);
    border: 1px solid rgba(6, 182, 212, 0.4);
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.1);
  }
  .btn-primary:hover {
    background: rgba(6, 182, 212, 0.2);
    box-shadow: 0 0 30px rgba(6, 182, 212, 0.3);
    border-color: var(--primary-cyan);
    color: white;
    transform: translateY(-2px);
  }
  .btn-primary::after {
    content: '';
    position: absolute;
    top: 0; left: 0; height: 100%; width: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: skewX(-20deg) translateX(-150%);
    transition: 0.5s;
  }
  .btn-primary:hover::after {
    transform: skewX(-20deg) translateX(150%);
    transition: 0.5s;
  }

  .btn-emergency {
    background: linear-gradient(135deg, #be123c, #e11d48);
    color: white;
    box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);
    border-radius: 99px;
    padding: 0.6rem 1.25rem;
    font-size: 0.8rem;
  }
  .btn-emergency:hover {
    box-shadow: 0 0 30px rgba(225, 29, 72, 0.6);
    transform: scale(1.05);
  }

  /* Cards */
  .panel {
    background: var(--bg-panel);
    border: var(--glass-border);
    backdrop-filter: blur(24px);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
    position: relative;
  }
  .panel::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(180deg, rgba(255,255,255,0.1), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    pointer-events: none;
  }

  /* Form Elements */
  .input-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-gray);
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
  }
  
  .input-box {
    width: 100%;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 1rem;
    color: white;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    transition: 0.3s;
    outline: none;
  }
  .input-box:focus {
    border-color: var(--primary-cyan);
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.15);
    background: rgba(0,0,0,0.5);
  }

  /* Upload Area */
  .upload-target {
    border: 2px dashed rgba(255,255,255,0.15);
    border-radius: 16px;
    background: rgba(255,255,255,0.02);
    min-height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.3s;
    position: relative;
    overflow: hidden;
  }
  .upload-target:hover {
    border-color: var(--primary-cyan);
    background: rgba(6,182,212,0.05);
  }
  .upload-icon-circle {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: rgba(30, 41, 59, 0.5);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1rem;
    border: 1px solid rgba(255,255,255,0.1);
    transition: 0.3s;
  }
  .upload-target:hover .upload-icon-circle {
    transform: scale(1.1);
    border-color: var(--primary-cyan);
    background: rgba(6,182,212,0.1);
  }

  /* Multiple Images Grid */
  .image-grid-container {
    width: 100%;
    height: 100%;
    min-height: 280px;
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    align-content: flex-start;
  }
  .image-preview-card {
    position: relative;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(0,0,0,0.3);
  }
  .image-preview-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .delete-img-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    background: rgba(0,0,0,0.6);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: 0.2s;
    z-index: 10;
  }
  .delete-img-btn:hover {
    background: var(--alert-red);
    border-color: var(--alert-red);
  }
  .add-more-card {
    aspect-ratio: 1;
    border-radius: 12px;
    border: 2px dashed rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.02);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
    color: var(--text-gray);
  }
  .add-more-card:hover {
    border-color: var(--primary-cyan);
    color: var(--primary-cyan);
    background: rgba(6,182,212,0.05);
  }

  /* Result Sections */
  .sev-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 99px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .sev-critical { background: rgba(239, 68, 68, 0.1); color: var(--alert-red); border: 1px solid rgba(239, 68, 68, 0.2); }
  .sev-high { background: rgba(249, 115, 22, 0.1); color: var(--alert-orange); border: 1px solid rgba(249, 115, 22, 0.2); }
  .sev-medium { background: rgba(234, 179, 8, 0.1); color: var(--alert-yellow); border: 1px solid rgba(234, 179, 8, 0.2); }
  
  .instruction-step {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 1rem;
    display: flex;
    gap: 1.25rem;
    transition: 0.3s;
  }
  .instruction-step:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.1);
    transform: translateX(5px);
  }
  .step-marker {
    width: 32px; height: 32px;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(6,182,212,0.3);
    color: var(--primary-cyan);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
  }

  /* Grid Layouts */
  .grid-main {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .grid-results {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  @media (min-width: 1024px) {
    .grid-main { grid-template-columns: 4fr 5fr; }
    .grid-results { grid-template-columns: 4fr 8fr; }
  }
`;

// --- Visual Components ---

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    let particles = Array.from({length: 40}, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.fillStyle = `rgba(6, 182, 212, ${0.3 * (p.size/3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(6,182,212,${0.1 - dist/1500})`;
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

  return <canvas ref={canvasRef} style={{position:'fixed', top:0, left:0, zIndex:0, opacity:0.5, pointerEvents:'none'}} />;
};

const SentinelAI = () => {
  const [view, setView] = useState('landing');
  const [lang, setLang] = useState('en');
  // State for multiple images
  const [images, setImages] = useState([]);
  
  const [description, setDescription] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(""); 
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showRawReport, setShowRawReport] = useState(false);
  const fileInputRef = useRef(null);
  
  const t = TRANSLATIONS[lang];

  const handleImageUpload = async (e) => {
    // Safety check for null
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Helper to read file as data URL
    const readFile = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ file, preview: reader.result });
        reader.readAsDataURL(file);
      });
    };

    const newImages = await Promise.all(files.map(readFile));
    setImages(prev => [...prev, ...newImages]);
    
    // Reset input to allow selecting same file again
    if (fileInputRef.current) fileInputRef.current.value = '';
    setResult(null); setError(null);
  };

  const handleRemoveImage = (index, e) => {
    e.stopPropagation(); // Prevent triggering upload click
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!description && images.length === 0) {
      setError("Please provide visual or textual input.");
      return;
    }
    setIsAnalyzing(true); setError(null);
    
    const steps = ["Establishing Secure Uplink...", "Scanning Visual Spectrum...", "Correlating Hazard Data...", "Generating Response Protocols..."];
    let stepIdx = 0;
    const interval = setInterval(() => { if(stepIdx < steps.length) setAnalysisStep(steps[stepIdx++]); }, 800);

    try {
      const parts = [{ text: `Language: ${LANGUAGES[lang].full}. Category: ${t.types[categoryIndex]}. Desc: ${description || "None"}. Output JSON.` }];
      
      // Add all images to the request
      images.forEach(img => {
        const base64Data = img.preview.split(',')[1];
        parts.push({
          inlineData: {
            mimeType: img.file.type,
            data: base64Data
          }
        });
      });

      const systemPrompt = `Role: Sentinel AI. Goal: Emergency guidance. Lang: ${LANGUAGES[lang].full}. Format: JSON. Safety: Call 911 if High Severity. Schema: { "emergency_type": "STR", "severity": "Low|Medium|High|Critical", "immediate_alert": "STR", "hazards": ["STR"], "instructions": [{"step": 1, "text": "STR", "safety_warning": "STR"}], "voice_script": "STR", "report_summary": "STR" }`;

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) throw new Error("API Connection Failed");
      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) throw new Error("Empty Response from AI");

      // Clean the response (remove potential markdown blocks)
      const cleanText = textResponse.replace(/```json|```/g, '').trim();
      
      clearInterval(interval);
      setResult(JSON.parse(cleanText));
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setError("Analysis interrupted. Please try again or call emergency services.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'sev-critical';
      case 'high': return 'sev-high';
      case 'medium': return 'sev-medium';
      default: return 'sev-low'; // Fallback
    }
  };

  return (
    <div className="app-root">
      <style>{cssStyles}</style>
      <div className="grid-overlay"></div>
      <ParticleBackground />
      
      {/* --- HEADER --- */}
      {(view === 'landing' || view === 'app') && (
        <header className="navbar flex-between anim-entry">
          <div className="container-width flex-between">
            <div className="nav-brand">
              <div className="brand-icon"><Shield size={18} color="#06b6d4" /></div>
              <span>SENTINEL <span style={{color:'rgba(255,255,255,0.4)', fontWeight:400}}>AI</span></span>
            </div>
            
            <div className="flex-center gap-4">
              {view === 'landing' && (
                <div className="flex-center gap-4">
                  {Object.keys(LANGUAGES).map(key => (
                    <button key={key} onClick={() => setLang(key)} style={{background:'none', border:'none', color:lang===key?'white':'rgba(255,255,255,0.4)', fontWeight:600, fontSize:'0.75rem', cursor:'pointer'}}>
                      {LANGUAGES[key].label}
                    </button>
                  ))}
                </div>
              )}
              {view === 'app' && (
                <a href="tel:911" className="btn-base btn-emergency">
                  <Siren size={16} className="animate-pulse" /> {t.call911}
                </a>
              )}
            </div>
          </div>
        </header>
      )}

      {/* --- LANDING --- */}
      {view === 'landing' && (
        <main className="container-width flex-center flex-col anim-entry delay-100" style={{flex:1, textAlign:'center'}}>
          <div style={{marginBottom:'2rem', display:'inline-flex', alignItems:'center', gap:10, padding:'8px 16px', background:'rgba(6,182,212,0.1)', borderRadius:99, border:'1px solid rgba(6,182,212,0.2)'}}>
            <span style={{width:8, height:8, borderRadius:'50%', background:'#06b6d4', boxShadow:'0 0 10px #06b6d4'}} className="animate-pulse"></span>
            <span style={{fontSize:'0.75rem', fontWeight:700, color:'#06b6d4', letterSpacing:'0.05em'}}>SYSTEM ACTIVE v8.0</span>
          </div>
          
          <h1 className="text-gradient" style={{fontSize:'clamp(3rem, 6vw, 5rem)', fontWeight:800, lineHeight:1.1, marginBottom:'1.5rem', letterSpacing:'-0.03em'}}>
            Situation Awareness <br /> Redefined
          </h1>
          
          <p style={{fontSize:'1.1rem', color:'#94a3b8', maxWidth:'600px', lineHeight:1.6, marginBottom:'3rem'}}>
            {t.subtitle}. An advanced multimodal intelligence system designed for rapid threat assessment and emergency guidance.
          </p>
          
          <button onClick={() => setView('disclaimer')} className="btn-base btn-primary">
            {t.enter} <ArrowRight size={18} />
          </button>

          <footer style={{position:'absolute', bottom:'2rem', width:'100%', textAlign:'center', opacity:0.6}}>
            <p style={{fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.2em'}}>Created by <strong style={{color:'#06b6d4'}}>Mohamed Mahzoul</strong></p>
          </footer>
        </main>
      )}

      {/* --- DISCLAIMER --- */}
      {view === 'disclaimer' && (
        <div className="flex-center" style={{position:'fixed', inset:0, zIndex:100, padding:20, background:'rgba(2,4,10,0.8)', backdropFilter:'blur(10px)'}}>
          <div className="panel anim-entry" style={{maxWidth:500, width:'100%'}}>
            <div className="flex-center gap-4" style={{justifyContent:'flex-start', marginBottom:'1.5rem', color:'#06b6d4'}}>
              <Shield size={32} />
              <h2 style={{fontSize:'1.25rem', fontWeight:700}}>{t.disclaimerTitle}</h2>
            </div>
            <p style={{lineHeight:1.6, color:'#cbd5e1', marginBottom:'2rem', borderLeft:'2px solid rgba(6,182,212,0.3)', paddingLeft:'1rem'}}>
              {t.disclaimerText}
            </p>
            <button onClick={() => setView('app')} className="btn-base btn-primary" style={{width:'100%'}}>
              {t.agree}
            </button>
          </div>
        </div>
      )}

      {/* --- APP INPUT --- */}
      {view === 'app' && !isAnalyzing && !result && (
        <main className="container-width anim-entry delay-100" style={{paddingTop:'3rem', paddingBottom:'3rem'}}>
          <div style={{textAlign:'center', marginBottom:'3rem'}}>
            <h2 style={{fontSize:'2.5rem', fontWeight:700, marginBottom:'0.5rem', color:'white'}}>{t.status}</h2>
            <p style={{color:'var(--text-gray)'}}>{t.upload}</p>
          </div>

          <div className="grid-main">
            {/* Upload */}
            <div className="upload-target" onClick={() => images.length === 0 ? fileInputRef.current.click() : null}>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" multiple />
              
              {images.length > 0 ? (
                <div className="image-grid-container">
                  {images.map((img, index) => (
                    <div key={index} className="image-preview-card">
                      <img src={img.preview} className="image-preview-thumb" alt={`Upload ${index}`} />
                      <button className="delete-img-btn" onClick={(e) => handleRemoveImage(index, e)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="add-more-card" onClick={() => fileInputRef.current.click()}>
                    <Plus size={24} />
                    <span style={{fontSize:'0.7rem', marginTop:4, fontWeight:600}}>ADD</span>
                  </div>
                </div>
              ) : (
                <div style={{textAlign:'center'}} onClick={() => fileInputRef.current.click()}>
                  <div className="upload-icon-circle">
                    <Camera size={32} color="#94a3b8" />
                  </div>
                  <p style={{fontWeight:700, letterSpacing:'0.05em', color:'white', marginBottom:4}}>{t.tapCapture}</p>
                  <p style={{fontSize:'0.85rem', color:'#64748b'}}>{t.orUpload}</p>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="flex-col gap-8">
              <div>
                <label className="input-label">{t.context}</label>
                <select value={categoryIndex} onChange={e => setCategoryIndex(e.target.value)} className="input-box">
                  {t.types.map((type, i) => <option key={i} value={i}>{type}</option>)}
                </select>
              </div>
              <div style={{flex:1, display:'flex', flexDirection:'column'}}>
                <label className="input-label">{t.description}</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t.descPlaceholder} className="input-box" style={{flex:1, resize:'none', minHeight:120}} />
              </div>
              <button onClick={handleAnalyze} className="btn-base btn-primary" style={{width:'100%', padding:'1.2rem'}}>
                <Activity size={20} /> {t.analyze}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="anim-entry" style={{marginTop:'2rem', background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.2)', color:'#f43f5e', padding:'1rem', borderRadius:12, display:'flex', alignItems:'center', gap:12}}>
              <AlertTriangle size={20} /> {error}
            </div>
          )}
        </main>
      )}

      {/* --- LOADING --- */}
      {isAnalyzing && (
        <div style={{position:'fixed', inset:0, zIndex:100, background:'var(--bg-deep)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{textAlign:'center'}}>
            <div style={{display:'inline-block', marginBottom:'2rem', animation:'spin-slow 2s linear infinite'}}>
              <Cpu size={64} color="#06b6d4" />
            </div>
            <h2 className="text-glow" style={{fontSize:'1.5rem', marginBottom:'1rem', animation:'pulse 2s infinite'}}>{t.analyzing}</h2>
            <p className="font-mono" style={{color:'#06b6d4'}}>{analysisStep}</p>
          </div>
        </div>
      )}

      {/* --- RESULTS --- */}
      {result && (
        <main className="container-width anim-entry delay-100" style={{paddingTop:'2rem', paddingBottom:'4rem'}}>
          <div className="flex-between" style={{marginBottom:'2rem'}}>
            <button onClick={() => setResult(null)} style={{background:'none', border:'none', color:'#94a3b8', display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontWeight:600}}>
              <ChevronRight size={18} style={{transform:'rotate(180deg)'}} /> {t.newScan}
            </button>
            <div className="sev-badge sev-critical" style={{animation:'pulse 2s infinite', background:'rgba(244,63,94,0.1)', color:'#f43f5e', border:'1px solid rgba(244,63,94,0.2)'}}>
              LIVE UPLINK
            </div>
          </div>

          <div className={`panel ${getSeverityStyle(result.severity)}`} style={{marginBottom:'2rem', position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute', top:0, left:0, width:'100%', height:'4px', background:'linear-gradient(90deg, transparent, currentColor, transparent)', opacity:0.5}}></div>
            <div className="flex-between" style={{alignItems:'flex-start', flexWrap:'wrap', gap:20}}>
              <div>
                <div className="flex-center" style={{justifyContent:'flex-start', gap:8, marginBottom:12}}>
                  <Activity size={18} /> 
                  <span style={{fontSize:'0.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em'}}>Severity: {result.severity}</span>
                </div>
                <h1 style={{fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:800, lineHeight:1.1, textTransform:'uppercase'}}>{result.emergency_type}</h1>
              </div>
              {['high', 'critical'].includes(result.severity?.toLowerCase()) && (
                <a href="tel:911" className="btn-base" style={{background:'white', color:'#e11d48', boxShadow:'0 0 40px rgba(255,255,255,0.2)'}}>
                  <Siren size={20} className="animate-pulse" /> {t.call911}
                </a>
              )}
            </div>
            
            <div style={{marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', gap:'1rem'}}>
              <div style={{padding:10, background:'rgba(255,255,255,0.1)', borderRadius:8}}><AlertTriangle size={24} /></div>
              <div>
                <div style={{fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', opacity:0.7, marginBottom:4}}>IMMEDIATE ACTION</div>
                <div style={{fontSize:'1.25rem', fontWeight:600}}>{result.immediate_alert}</div>
              </div>
            </div>
          </div>

          <div className="grid-results">
            {/* Left Col */}
            <div className="flex-col gap-8">
              <div className="panel">
                <div className="flex-center" style={{justifyContent:'flex-start', gap:10, marginBottom:'1.5rem', color:'#94a3b8'}}>
                  <Scan size={18} color="#06b6d4" /> 
                  <span style={{fontSize:'0.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em'}}>{t.hazards}</span>
                </div>
                <ul style={{listStyle:'none', padding:0, margin:0}}>
                  {result.hazards.map((h, i) => (
                    <li key={i} style={{marginBottom:'0.8rem', display:'flex', alignItems:'center', gap:12, fontSize:'0.95rem'}}>
                      <span style={{width:6, height:6, borderRadius:'50%', background:'#06b6d4', boxShadow:'0 0 10px #06b6d4'}}></span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel" style={{background:'linear-gradient(180deg, rgba(13,18,30,0.8), rgba(6,182,212,0.05))'}}>
                <div className="flex-center" style={{justifyContent:'flex-start', gap:10, marginBottom:'1.5rem', color:'#94a3b8'}}>
                  <Radio size={18} color="#06b6d4" />
                  <span style={{fontSize:'0.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em'}}>{t.voice}</span>
                </div>
                <p style={{fontSize:'1.1rem', fontStyle:'italic', lineHeight:1.6, color:'rgba(255,255,255,0.9)'}}>"{result.voice_script}"</p>
              </div>
            </div>

            {/* Right Col */}
            <div>
              <div className="flex-center" style={{justifyContent:'flex-start', gap:12, marginBottom:'1.5rem'}}>
                <Zap size={24} color="#06b6d4" />
                <h2 style={{fontSize:'1.5rem', fontWeight:700}}>{t.actionPlan}</h2>
              </div>

              <div className="flex-col gap-4">
                {result.instructions.map((step, i) => (
                  <div key={i} className="instruction-step anim-entry" style={{animationDelay: `${i * 100}ms`}}>
                    <div className="step-marker">{i+1}</div>
                    <div style={{flex:1}}>
                      <p style={{margin:'0 0 0.8rem 0', fontSize:'1.1rem', fontWeight:500, lineHeight:1.5}}>{step.text}</p>
                      {step.safety_warning && (
                        <div style={{display:'inline-flex', alignItems:'center', gap:8, fontSize:'0.85rem', color:'#f43f5e', background:'rgba(244,63,94,0.1)', padding:'6px 12px', borderRadius:6, border:'1px solid rgba(244,63,94,0.2)'}}>
                          <AlertTriangle size={14} /> {step.safety_warning}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{marginTop:'3rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                <div className="flex-between" style={{marginBottom:'1rem'}}>
                  <div style={{fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', color:'#64748b', display:'flex', alignItems:'center', gap:8}}>
                    <FileText size={16} /> {t.log}
                  </div>
                  <button onClick={() => setShowRawReport(!showRawReport)} style={{background:'none', border:'none', color:'#06b6d4', cursor:'pointer', fontSize:'0.8rem', fontWeight:600}}>
                    {showRawReport ? 'HIDE DATA' : 'VIEW RAW JSON'}
                  </button>
                </div>
                <div style={{background:'rgba(0,0,0,0.3)', padding:'1.5rem', borderRadius:12, fontSize:'0.8rem', fontFamily:'monospace', color:'#64748b', border:'1px solid rgba(255,255,255,0.05)', overflowX:'auto'}}>
                  {showRawReport ? JSON.stringify(result, null, 2) : result.report_summary}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default SentinelAI;