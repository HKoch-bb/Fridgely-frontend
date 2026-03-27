import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import {
  TextField, Button, Card, CardContent,
  Typography, Grid, Box, Chip, Badge,
  Dialog, DialogTitle, DialogContent,
  Drawer, List, ListItem, ListItemText, IconButton,
  Select, MenuItem, FormControl, InputLabel,
  Divider, CircularProgress, Tabs, Tab, Tooltip,
  LinearProgress, Slider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LockIcon from "@mui/icons-material/Lock";
import BoltIcon from "@mui/icons-material/Bolt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import MicIcon from "@mui/icons-material/Mic";
import MicNoneIcon from "@mui/icons-material/MicNone";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import HistoryIcon from "@mui/icons-material/History";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Constants ────────────────────────────────────────────────────────────────
const UNITS = [
  { label: "—", value: "" },
  { label: "tsp", value: "tsp" }, { label: "tbsp", value: "tbsp" },
  { label: "cup", value: "cup" }, { label: "ml", value: "ml" },
  { label: "L", value: "L" }, { label: "fl oz", value: "fl oz" },
  { label: "g", value: "g" }, { label: "kg", value: "kg" },
  { label: "oz", value: "oz" }, { label: "lb", value: "lb" },
  { label: "piece(s)", value: "piece" }, { label: "slice(s)", value: "slice" },
  { label: "clove(s)", value: "clove" }, { label: "can(s)", value: "can" },
  { label: "bunch", value: "bunch" },
];

const FOOD_TYPES = [
  { emoji: "🍳", label: "Breakfast" }, { emoji: "🥗", label: "Salad" },
  { emoji: "🍜", label: "Soup" }, { emoji: "🫕", label: "Stew" },
  { emoji: "🌮", label: "Snack" }, { emoji: "🍛", label: "Main Course" },
  { emoji: "🥘", label: "Side Dish" }, { emoji: "🍰", label: "Dessert" },
  { emoji: "🥤", label: "Drink / Smoothie" }, { emoji: "🥙", label: "Sandwich / Wrap" },
  { emoji: "🍕", label: "Baked" }, { emoji: "🍱", label: "Rice Bowl" },
];

const DIET_OPTIONS = [
  { emoji: "🌱", label: "Vegetarian" }, { emoji: "🌿", label: "Vegan" },
  { emoji: "🌾", label: "Gluten-Free" }, { emoji: "🥛", label: "Dairy-Free" },
  { emoji: "🥩", label: "High-Protein" }, { emoji: "🔥", label: "Low-Carb" },
  { emoji: "⚡", label: "Keto" }, { emoji: "💪", label: "Low-Fat" },
  { emoji: "❤️", label: "Heart-Healthy" }, { emoji: "🧂", label: "Low-Sodium" },
];

const CUISINE_OPTIONS = [
  { emoji: "🍝", label: "Italian" }, { emoji: "🍛", label: "Indian" },
  { emoji: "🍣", label: "Japanese" }, { emoji: "🌮", label: "Mexican" },
  { emoji: "🫒", label: "Mediterranean" }, { emoji: "🥟", label: "Chinese" },
  { emoji: "🍜", label: "Thai" }, { emoji: "🥙", label: "Middle Eastern" },
  { emoji: "🥘", label: "Spanish" }, { emoji: "🍔", label: "American" },
  { emoji: "🥐", label: "French" }, { emoji: "🌍", label: "African" },
];

const DIFFICULTY_OPTIONS = [
  { emoji: "🟢", label: "Easy" },
  { emoji: "🟡", label: "Medium" },
  { emoji: "🔴", label: "Hard" },
];

// ─── Language Options ─────────────────────────────────────────────────────────
const LANGUAGES = [
  // Indian Regional
  { flag: "🇮🇳", label: "English",    value: "English",    group: "Indian" },
  { flag: "🇮🇳", label: "हिंदी",       value: "Hindi",      group: "Indian" },
  { flag: "🇮🇳", label: "தமிழ்",      value: "Tamil",      group: "Indian" },
  { flag: "🇮🇳", label: "తెలుగు",     value: "Telugu",     group: "Indian" },
  { flag: "🇮🇳", label: "ಕನ್ನಡ",      value: "Kannada",    group: "Indian" },
  { flag: "🇮🇳", label: "മലയാളം",    value: "Malayalam",  group: "Indian" },
  { flag: "🇮🇳", label: "मराठी",      value: "Marathi",    group: "Indian" },
  { flag: "🇮🇳", label: "বাংলা",      value: "Bengali",    group: "Indian" },
  { flag: "🇮🇳", label: "ਪੰਜਾਬੀ",     value: "Punjabi",    group: "Indian" },
  { flag: "🇮🇳", label: "ગુજરાતી",   value: "Gujarati",   group: "Indian" },
  { flag: "🇮🇳", label: "ଓଡ଼ିଆ",      value: "Odia",       group: "Indian" },
  { flag: "🇮🇳", label: "অসমীয়া",   value: "Assamese",   group: "Indian" },
  { flag: "🇮🇳", label: "اردو",       value: "Urdu",       group: "Indian" },
  // International
  { flag: "🇪🇸", label: "Español",    value: "Spanish",    group: "International" },
  { flag: "🇫🇷", label: "Français",   value: "French",     group: "International" },
  { flag: "🇩🇪", label: "Deutsch",    value: "German",     group: "International" },
  { flag: "🇮🇹", label: "Italiano",   value: "Italian",    group: "International" },
  { flag: "🇯🇵", label: "日本語",     value: "Japanese",   group: "International" },
  { flag: "🇨🇳", label: "中文",       value: "Chinese",    group: "International" },
  { flag: "🇸🇦", label: "العربية",    value: "Arabic",     group: "International" },
  { flag: "🇧🇷", label: "Português",  value: "Portuguese", group: "International" },
  { flag: "🇰🇷", label: "한국어",     value: "Korean",     group: "International" },
  { flag: "🇷🇺", label: "Русский",    value: "Russian",    group: "International" },
  { flag: "🇹🇷", label: "Türkçe",     value: "Turkish",    group: "International" },
];


const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];

const DAY_COLORS = {
  Monday:    { bg: "#f0f4ec", border: "#b8cead", accent: "#6b8c5a", text: "#3d6b2a" },
  Tuesday:   { bg: "#fdf4ff", border: "#e9d5ff", accent: "#a855f7", text: "#7e22ce" },
  Wednesday: { bg: "#eff6ff", border: "#bfdbfe", accent: "#3b82f6", text: "#1d4ed8" },
  Thursday:  { bg: "#f0fdf4", border: "#bbf7d0", accent: "#22c55e", text: "#15803d" },
  Friday:    { bg: "#f0f3f8", border: "#c8c0d8", accent: "#7c6ea8", text: "#4a3e80" },
};

// ─── Toast System ─────────────────────────────────────────────────────────────
let _toastId = 0;
const ToastContainer = ({ toasts, removeToast }) => (
  <Box sx={{
    position: "fixed", bottom: 24, right: 24, zIndex: 9999,
    display: "flex", flexDirection: "column", gap: 1, pointerEvents: "none",
  }}>
    {toasts.map(t => (
      <Box key={t.id} sx={{
        pointerEvents: "auto",
        background: t.type === "error" ? "#1c1c1c" : t.type === "success" ? "#052e16" : "#1c1c1c",
        border: `1px solid ${t.type === "error" ? "#6b8c5a" : t.type === "success" ? "#22c55e" : "#374151"}`,
        borderRadius: 2, px: 2.5, py: 1.5,
        display: "flex", alignItems: "center", gap: 1.5,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: 240, maxWidth: 380,
        animation: "slideIn 0.25s ease",
        "@keyframes slideIn": {
          from: { transform: "translateX(120%)", opacity: 0 },
          to: { transform: "translateX(0)", opacity: 1 },
        },
      }}>
        <Typography sx={{ fontSize: "1.1rem", flexShrink: 0 }}>
          {t.type === "error" ? "❌" : t.type === "success" ? "✅" : "ℹ️"}
        </Typography>
        <Typography sx={{ color: "#f9fafb", fontSize: "0.88rem", fontWeight: 500, flex: 1 }}>
          {t.message}
        </Typography>
        <IconButton size="small" onClick={() => removeToast(t.id)}
          sx={{ color: "#6b7280", p: 0.3, flexShrink: 0 }}>
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
    ))}
  </Box>
);

// ─── Smart Input Panel (Voice + Photo + Barcode) ─────────────────────────────
const SmartInputPanel = ({ onAddIngredients, language = "English", accentColor = "#6b8c5a" }) => {
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [mode, setMode] = useState(null); // null | "voice" | "photo" | "barcode"
  const [listening, setListening]     = useState(false);
  const [transcript, setTranscript]   = useState("");
  const [voiceResult, setVoiceResult] = useState([]);
  const [photoScanning, setPhotoScanning] = useState(false);
  const [photoResult, setPhotoResult] = useState(null);
  const [photoImg, setPhotoImg]       = useState(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeScanning, setBarcodeScanning] = useState(false);
  const [barcodeResult, setBarcodeResult] = useState(null);
  const [barcodeError, setBarcodeError] = useState("");
  const [selected, setSelected]       = useState([]);
  const recRef  = useRef(null);
  const fileRef = useRef(null);
  const barcodeInputRef = useRef(null);

  const LANG_CODES = {
    English:"en-US", Hindi:"hi-IN", Spanish:"es-ES", French:"fr-FR",
    German:"de-DE", Italian:"it-IT", Japanese:"ja-JP", Chinese:"zh-CN",
    Tamil:"ta-IN", Telugu:"te-IN", Kannada:"kn-IN", Malayalam:"ml-IN",
  };
  const langCode = LANG_CODES[language] || "en-US";

  const reset = () => {
    setMode(null); setListening(false); setTranscript(""); setVoiceResult([]);
    setPhotoResult(null); setPhotoImg(null); setBarcodeInput(""); setBarcodeResult(null);
    setBarcodeError(""); setSelected([]);
    recRef.current?.stop();
  };

  // ── Voice ──
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported in this browser. Try Chrome."); return; }
    const rec = new SR();
    rec.lang = langCode; rec.continuous = true; rec.interimResults = true;
    rec.onstart = () => setListening(true);
    rec.onend   = () => { setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join(" ");
      setTranscript(t);
    };
    recRef.current = rec;
    rec.start();
  };

  const stopAndParse = async () => {
    recRef.current?.stop();
    setListening(false);
    if (!transcript.trim()) return;
    // Parse transcript into ingredients via GPT
    try {
      const res = await fetch(`${API}/parse-voice-ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
      });
      const data = await res.json();
      const items = data.ingredients || [{ name: transcript.trim(), qty: "", unit: "" }];
      setVoiceResult(items);
      setSelected(items.map((_, i) => i));
    } catch {
      // Fallback: just use transcript as ingredient name
      const fallback = [{ name: transcript.trim(), qty: "", unit: "" }];
      setVoiceResult(fallback);
      setSelected([0]);
    }
  };

  // ── Photo ──
  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    const imgUrl = URL.createObjectURL(file);
    setPhotoImg(imgUrl);
    setPhotoScanning(true);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const resp = await fetch(`${API}/identify-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64, mimeType: file.type }),
      });
      const data = await resp.json();
      setPhotoResult(data);
      setSelected((data.ingredients || []).map((_, i) => i));
    } catch {
      setPhotoResult({ ingredients: [], description: "Could not scan — try a clearer photo." });
    }
    setPhotoScanning(false);
  };

  // ── Barcode ──
  const lookupBarcode = async (code) => {
    if (!code.trim()) return;
    setBarcodeScanning(true); setBarcodeError(""); setBarcodeResult(null);
    try {
      const res = await fetch(`${API}/barcode/${code.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBarcodeResult(data);
      setSelected([0]);
    } catch (err) {
      setBarcodeError(err.message || "Product not found");
    }
    setBarcodeScanning(false);
  };

  const toggleItem = (i) =>
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const confirm = () => {
    let items = [];
    if (mode === "voice")   items = voiceResult.filter((_, i) => selected.includes(i));
    if (mode === "photo")   items = (photoResult?.ingredients || []).filter((_, i) => selected.includes(i));
    if (mode === "barcode" && barcodeResult) items = [{ name: barcodeResult.name, qty: "1", unit: "piece" }];
    onAddIngredients(items);
    reset();
  };

  const btnBase = { borderRadius: "14px", border: "1px solid rgba(0,0,0,0.08)", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, p: 2, flex: 1 };

  if (!mode) return (
    <Box sx={{ display: "flex", gap: 1.5, mt: 1.5, mb: 0.5 }}>
      {/* Voice */}
      <Box onClick={() => { setMode("voice"); setTimeout(startListening, 100); }}
        sx={{ ...btnBase, background: "linear-gradient(135deg, #f0f4ec, #e8f0e4)", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(107,140,90,0.2)", borderColor: accentColor } }}>
        <Box sx={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(107,140,90,0.35)" }}>
          <MicNoneIcon sx={{ fontSize: 20, color: "#fff" }} />
        </Box>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}>Voice</Typography>
        <Typography sx={{ fontSize: "0.65rem", color: "#6b7280", textAlign: "center", lineHeight: 1.3 }}>Speak your ingredients</Typography>
      </Box>

      {/* Photo */}
      <Box onClick={() => { setMode("photo"); setTimeout(() => fileRef.current?.click(), 100); }}
        sx={{ ...btnBase, background: "linear-gradient(135deg, #fef3ec, #fde8d8)", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(184,113,78,0.2)", borderColor: "#b8714e" } }}>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePhoto} />
        <Box sx={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #b8714e, #a0623f)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(184,113,78,0.35)" }}>
          <CameraAltIcon sx={{ fontSize: 20, color: "#fff" }} />
        </Box>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}>Photo Scan</Typography>
        <Typography sx={{ fontSize: "0.65rem", color: "#6b7280", textAlign: "center", lineHeight: 1.3 }}>AI detects ingredients</Typography>
      </Box>

      {/* Barcode */}
      <Box onClick={() => { setMode("barcode"); setTimeout(() => barcodeInputRef.current?.focus(), 150); }}
        sx={{ ...btnBase, background: "linear-gradient(135deg, #eff6ff, #dbeafe)", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(59,130,246,0.2)", borderColor: "#3b82f6" } }}>
        <Box sx={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(59,130,246,0.35)" }}>
          <Typography sx={{ fontSize: "1.1rem" }}>⬛</Typography>
        </Box>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151" }}>Barcode</Typography>
        <Typography sx={{ fontSize: "0.65rem", color: "#6b7280", textAlign: "center", lineHeight: 1.3 }}>Scan product label</Typography>
      </Box>
    </Box>
  );

  // ── Active panel ──
  const panelColors = {
    voice:   { bg: "#f0f4ec", accent: "#5a7c4a", border: "#a8c298" },
    photo:   { bg: "#fef3ec", accent: "#b8714e", border: "#f0c4a0" },
    barcode: { bg: "#eff6ff", accent: "#3b82f6", border: "#93c5fd" },
  };
  const pc = panelColors[mode];

  return (
    <Box sx={{ mt: 1.5, mb: 0.5, background: pc.bg, border: `1.5px solid ${pc.border}`, borderRadius: "16px", p: 2.5 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#1a1a1a", display: "flex", alignItems: "center", gap: 0.8 }}>
          {mode === "voice"   && <><MicIcon sx={{ fontSize: 18, color: pc.accent }} /> Voice Input</>}
          {mode === "photo"   && <><CameraAltIcon sx={{ fontSize: 18, color: pc.accent }} /> Photo Scan</>}
          {mode === "barcode" && <><Box component="span" sx={{ fontSize: "1rem" }}>⬛</Box> Barcode Scanner</>}
        </Typography>
        <IconButton size="small" onClick={reset} sx={{ color: "#9ca3af", "&:hover": { color: "#374151" } }}>
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* ── VOICE MODE ── */}
      {mode === "voice" && (
        <Box>
          {/* Mic button */}
          <Box display="flex" flexDirection="column" alignItems="center" gap={1.5} py={1}>
            <Box
              onClick={listening ? stopAndParse : startListening}
              sx={{
                width: 72, height: 72, borderRadius: "50%", cursor: "pointer",
                background: listening ? "linear-gradient(135deg, #ef4444, #dc2626)" : `linear-gradient(135deg, ${pc.accent}, #4a6a3a)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: listening ? "0 0 0 8px rgba(239,68,68,0.15), 0 8px 24px rgba(239,68,68,0.3)" : "0 8px 24px rgba(107,140,90,0.35)",
                transition: "all 0.3s",
                animation: listening ? "ripple 1.5s ease-in-out infinite" : "none",
                "@keyframes ripple": { "0%": { boxShadow: "0 0 0 0 rgba(239,68,68,0.3), 0 8px 24px rgba(239,68,68,0.3)" }, "100%": { boxShadow: "0 0 0 20px rgba(239,68,68,0), 0 8px 24px rgba(239,68,68,0.3)" } },
              }}>
              {listening
                ? <StopIcon sx={{ fontSize: 28, color: "#fff" }} />
                : <MicIcon sx={{ fontSize: 28, color: "#fff" }} />}
            </Box>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: listening ? "#ef4444" : "#6b7280" }}>
              {listening ? "Listening… tap to stop" : voiceResult.length ? "Tap mic to retry" : "Tap to start speaking"}
            </Typography>
            {transcript && (
              <Box sx={{ background: "rgba(255,255,255,0.7)", borderRadius: "10px", px: 2, py: 1, maxWidth: "100%", width: "100%" }}>
                <Typography sx={{ fontSize: "0.85rem", color: "#374151", fontStyle: "italic", textAlign: "center" }}>"{transcript}"</Typography>
              </Box>
            )}
          </Box>
          <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", textAlign: "center", mb: voiceResult.length ? 2 : 0 }}>
            Try: "I have two eggs, some garlic and half a cup of rice"
          </Typography>
          {voiceResult.length > 0 && (
            <>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", mb: 1 }}>Detected ingredients — tap to deselect:</Typography>
              <Box display="flex" flexWrap="wrap" gap={0.8} mb={2}>
                {voiceResult.map((ing, i) => (
                  <Chip key={i} label={[ing.qty, ing.unit, ing.name].filter(Boolean).join(" ")}
                    onClick={() => toggleItem(i)}
                    sx={{ background: selected.includes(i) ? pc.accent : "#e5e7eb", color: selected.includes(i) ? "#fff" : "#6b7280", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s" }} />
                ))}
              </Box>
              <Button fullWidth variant="contained" onClick={confirm}
                sx={{ background: `linear-gradient(135deg, ${pc.accent}, #4a6a3a)`, borderRadius: "10px", fontWeight: 700, boxShadow: "none" }}>
                Add {selected.length} ingredient{selected.length !== 1 ? "s" : ""} →
              </Button>
            </>
          )}
        </Box>
      )}

      {/* ── PHOTO MODE ── */}
      {mode === "photo" && (
        <Box>
          {photoScanning && (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={3}>
              {photoImg && <Box component="img" src={photoImg} sx={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: "10px", opacity: 0.7 }} />}
              <Box display="flex" alignItems="center" gap={1.5}>
                <CircularProgress size={20} sx={{ color: pc.accent }} />
                <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 600 }}>AI scanning your photo…</Typography>
              </Box>
            </Box>
          )}
          {!photoScanning && !photoResult && (
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>
              <Box sx={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${pc.accent}, #a0623f)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CameraAltIcon sx={{ fontSize: 28, color: "#fff" }} />
              </Box>
              <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", textAlign: "center" }}>Take a photo of your fridge, pantry shelf, or any ingredients</Typography>
              <Button variant="contained" onClick={() => fileRef.current?.click()}
                sx={{ background: `linear-gradient(135deg, ${pc.accent}, #a0623f)`, borderRadius: "10px", fontWeight: 700, boxShadow: "none" }}>
                📷 Take / Choose Photo
              </Button>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePhoto} />
            </Box>
          )}
          {!photoScanning && photoResult && (
            <>
              {photoImg && (
                <Box sx={{ position: "relative", height: 140, borderRadius: "10px", overflow: "hidden", mb: 2 }}>
                  <Box component="img" src={photoImg} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {photoResult.description && (
                    <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)", px: 1.5, py: 1 }}>
                      <Typography sx={{ color: "#fff", fontSize: "0.72rem", fontStyle: "italic" }}>{photoResult.description}</Typography>
                    </Box>
                  )}
                </Box>
              )}
              {photoResult.ingredients?.length > 0 ? (
                <>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", mb: 1 }}>
                    Found {photoResult.ingredients.length} ingredients — tap to deselect:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.8} mb={2}>
                    {photoResult.ingredients.map((ing, i) => (
                      <Chip key={i} label={[ing.qty, ing.unit, ing.name].filter(Boolean).join(" ")}
                        onClick={() => toggleItem(i)}
                        sx={{ background: selected.includes(i) ? pc.accent : "#e5e7eb", color: selected.includes(i) ? "#fff" : "#6b7280", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s" }} />
                    ))}
                  </Box>
                  <Box display="flex" gap={1}>
                    <Button variant="outlined" onClick={() => fileRef.current?.click()} sx={{ borderColor: pc.border, color: pc.accent, borderRadius: "10px", fontWeight: 700, flex: 1 }}>
                      Retake
                    </Button>
                    <Button variant="contained" onClick={confirm} sx={{ background: `linear-gradient(135deg, ${pc.accent}, #a0623f)`, borderRadius: "10px", fontWeight: 700, boxShadow: "none", flex: 2 }}>
                      Add {selected.length} ingredient{selected.length !== 1 ? "s" : ""} →
                    </Button>
                  </Box>
                </>
              ) : (
                <Box textAlign="center" py={1}>
                  <Typography sx={{ color: "#6b7280", fontSize: "0.85rem", mb: 1.5 }}>No ingredients detected — try a clearer photo</Typography>
                  <Button variant="contained" onClick={() => { setPhotoResult(null); setPhotoImg(null); fileRef.current?.click(); }}
                    sx={{ background: `linear-gradient(135deg, ${pc.accent}, #a0623f)`, borderRadius: "10px", fontWeight: 700, boxShadow: "none" }}>
                    Try Again
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      )}

      {/* ── BARCODE MODE ── */}
      {mode === "barcode" && (
        <Box>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mb: 1.5, lineHeight: 1.5 }}>
            Type or scan a product barcode. Works with most grocery products worldwide.
          </Typography>
          <Box display="flex" gap={1} mb={1.5}>
            <input
              ref={barcodeInputRef}
              value={barcodeInput}
              onChange={e => { setBarcodeInput(e.target.value); setBarcodeError(""); setBarcodeResult(null); }}
              onKeyDown={e => e.key === "Enter" && lookupBarcode(barcodeInput)}
              placeholder="e.g. 8901234567890"
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10, fontSize: "1rem",
                border: `1.5px solid ${barcodeError ? "#ef4444" : pc.border}`,
                background: "#fff", outline: "none", fontFamily: "inherit",
                letterSpacing: "0.05em",
              }}
            />
            <Button variant="contained" onClick={() => lookupBarcode(barcodeInput)} disabled={barcodeScanning || !barcodeInput.trim()}
              sx={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", borderRadius: "10px", fontWeight: 700, px: 2.5, boxShadow: "none", minWidth: 90 }}>
              {barcodeScanning ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Lookup"}
            </Button>
          </Box>
          {barcodeError && (
            <Box sx={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", px: 1.5, py: 1, mb: 1.5 }}>
              <Typography sx={{ color: "#ef4444", fontSize: "0.8rem", fontWeight: 600 }}>⚠ {barcodeError} — try another barcode</Typography>
            </Box>
          )}
          {barcodeResult && (
            <Box sx={{ background: "rgba(255,255,255,0.8)", border: `1.5px solid ${pc.border}`, borderRadius: "12px", p: 2, mb: 1.5 }}>
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={1}>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "#1a1a1a", mb: 0.3 }}>{barcodeResult.name}</Typography>
                  {barcodeResult.brand && <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>by {barcodeResult.brand}</Typography>}
                  {barcodeResult.quantity && <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>{barcodeResult.quantity}</Typography>}
                </Box>
                <Box sx={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: "8px", px: 1, py: 0.5, flexShrink: 0 }}>
                  <Typography sx={{ color: "#16a34a", fontSize: "0.7rem", fontWeight: 800 }}>✓ Found</Typography>
                </Box>
              </Box>
              <Button fullWidth variant="contained" onClick={confirm} sx={{ mt: 1.5, background: "linear-gradient(135deg, #3b82f6, #2563eb)", borderRadius: "10px", fontWeight: 700, boxShadow: "none" }}>
                Add to ingredients →
              </Button>
            </Box>
          )}
          <Typography sx={{ fontSize: "0.68rem", color: "#9ca3af", textAlign: "center" }}>
            💡 Use your phone's camera app to scan a barcode and paste the number here
          </Typography>
        </Box>
      )}
    </Box>
  );
};


// ─── Mic Button (Voice Input) ─────────────────────────────────────────────────
const MicButton = ({ onResult, langCode = "en-US", size = 20 }) => {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const toggle = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported in this browser."); return; }
    if (listening) { recRef.current?.stop(); return; }

    const rec = new SR();
    rec.lang = langCode;
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart  = () => setListening(true);
    rec.onend    = () => setListening(false);
    rec.onerror  = () => setListening(false);
    rec.onresult = (e) => onResult(e.results[0][0].transcript);
    recRef.current = rec;
    rec.start();
  };

  return (
    <Tooltip title={listening ? "Stop listening" : "Speak ingredient name"} arrow>
      <IconButton onClick={toggle} size="small" sx={{
        color: listening ? "#6b8c5a" : "#9ca3af",
        animation: listening ? "micPulse 1s infinite" : "none",
        "@keyframes micPulse": { "0%,100%": { opacity: 1, transform: "scale(1)" }, "50%": { opacity: 0.5, transform: "scale(1.15)" } },
        "&:hover": { color: "#6b8c5a" },
      }}>
        {listening ? <MicIcon sx={{ fontSize: size }} /> : <MicNoneIcon sx={{ fontSize: size }} />}
      </IconButton>
    </Tooltip>
  );
};


// ─── Language Pill ────────────────────────────────────────────────────────────
const LanguagePill = ({ value, onChange, accentColor = "#6b8c5a", accentBg = "#f0f4ec" }) => {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.value === value) || LANGUAGES[0];
  const groups = ["Indian", "International"];

  return (
    <Box sx={{ position: "relative" }}>
      {/* Trigger */}
      <Box
        onClick={() => setOpen(o => !o)}
        sx={{
          display: "inline-flex", alignItems: "center", gap: 0.8,
          px: 1.4, py: 0.6, borderRadius: "20px", cursor: "pointer",
          border: `1.5px solid ${open ? accentColor : "#e5e7eb"}`,
          background: open ? accentBg : "#fff",
          transition: "all 0.18s",
          "&:hover": { borderColor: accentColor, background: accentBg },
          userSelect: "none",
        }}
      >
        <Typography sx={{ fontSize: "1rem", lineHeight: 1 }}>{current.flag}</Typography>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {current.label}
        </Typography>
        <Typography sx={{ fontSize: "0.6rem", color: "#9ca3af", ml: 0.2 }}>▼</Typography>
      </Box>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <Box onClick={() => setOpen(false)} sx={{ position: "fixed", inset: 0, zIndex: 1299 }} />
          <Box sx={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 1300,
            background: "#fff", borderRadius: 2.5,
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
            minWidth: 200, maxHeight: 360, overflowY: "auto",
            py: 1,
          }}>
            {groups.map(group => (
              <Box key={group}>
                <Typography sx={{
                  px: 2, py: 0.6, fontSize: "0.65rem", fontWeight: 800,
                  color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em",
                  borderBottom: "1px solid #f3f4f6", mb: 0.5,
                }}>
                  {group === "Indian" ? "🇮🇳 Indian Languages" : "🌍 International"}
                </Typography>
                {LANGUAGES.filter(l => l.group === group).map(lang => (
                  <Box
                    key={lang.value}
                    onClick={() => { onChange(lang.value); setOpen(false); }}
                    sx={{
                      display: "flex", alignItems: "center", gap: 1.2,
                      px: 2, py: 0.9, cursor: "pointer",
                      background: lang.value === value ? accentBg : "transparent",
                      "&:hover": { background: accentBg },
                      transition: "background 0.12s",
                    }}
                  >
                    <Typography sx={{ fontSize: "1rem", flexShrink: 0 }}>{lang.flag}</Typography>
                    <Typography sx={{
                      fontSize: "0.84rem",
                      fontWeight: lang.value === value ? 700 : 500,
                      color: lang.value === value ? accentColor : "#374151",
                    }}>
                      {lang.label}
                    </Typography>
                    {lang.value === value && (
                      <Typography sx={{ ml: "auto", fontSize: "0.7rem", color: accentColor }}>✓</Typography>
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

// ─── Image Scan Button (Ingredient Detection from Photo) ──────────────────────
const ImageScanButton = ({ onConfirm, accentColor = "#b8714e" }) => {
//  const API = "http://localhost:5000";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";  
const fileRef = useRef();
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState({ open: false, imageSrc: null, detected: [], description: "" });
  const [selected, setSelected] = useState([]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";

    // Show the image immediately while we scan
    const imageSrc = URL.createObjectURL(file);
    setScanning(true);

    try {
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload  = () => res(reader.result.split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      const { data } = await axios.post(`${API}/identify-image`, {
        base64,
        mimeType: file.type,
      });

      const detected = data.ingredients || [];
      setSelected(detected.map((_, i) => i)); // all pre-selected
      setPreview({ open: true, imageSrc, detected, description: data.description || "" });
    } catch {
      alert("Could not scan image — please try again or use a clearer photo.");
    }
    setScanning(false);
  };

  const toggleItem = (i) =>
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const confirm = () => {
    const chosen = preview.detected.filter((_, i) => selected.includes(i));
    onConfirm(chosen);
    setPreview(p => ({ ...p, open: false }));
    URL.revokeObjectURL(preview.imageSrc);
  };

  const cancel = () => {
    setPreview(p => ({ ...p, open: false }));
    URL.revokeObjectURL(preview.imageSrc);
  };

  return (
    <>
      {/* Hidden file input — accepts both gallery and camera on mobile */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      {/* Trigger button */}
      <Tooltip title="Scan photo to detect ingredients" arrow>
        <IconButton
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          size="small"
          sx={{
            color: scanning ? accentColor : "#9ca3af",
            "&:hover": { color: accentColor },
            animation: scanning ? "micPulse 1s infinite" : "none",
          }}
        >
          {scanning
            ? <CircularProgress size={18} sx={{ color: accentColor }} />
            : <CameraAltIcon sx={{ fontSize: 20 }} />}
        </IconButton>
      </Tooltip>

      {/* ── Confirmation dialog ── */}
      <Dialog
        open={preview.open}
        onClose={cancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <DialogTitle sx={{
          background: "linear-gradient(135deg, #1a1612, #1e2b1a)",
          color: "#fff", fontWeight: 800, fontSize: "1rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", py: 2,
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CameraAltIcon sx={{ fontSize: 20, color: "#b8714e" }} />
            Detected Ingredients
          </Box>
          <IconButton onClick={cancel} size="small" sx={{ color: "rgba(255,255,255,0.5)" }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Scanned image thumbnail */}
          {preview.imageSrc && (
            <Box sx={{ position: "relative", height: 180, overflow: "hidden", background: "#000" }}>
              <Box
                component="img"
                src={preview.imageSrc}
                alt="scanned"
                sx={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}
              />
              {preview.description && (
                <Box sx={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  px: 2, py: 1.5,
                }}>
                  <Typography sx={{ color: "#fff", fontSize: "0.82rem", fontStyle: "italic" }}>
                    {preview.description}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Box p={2.5}>
            {preview.detected.length === 0 ? (
              <Box textAlign="center" py={3}>
                <Typography fontSize="2rem">🔍</Typography>
                <Typography fontWeight={600} color="#374151" mt={1}>No ingredients detected</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Try a clearer photo with better lighting.
                </Typography>
              </Box>
            ) : (
              <>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                  <Typography fontWeight={700} color="#374151" fontSize="0.9rem">
                    {preview.detected.length} item{preview.detected.length !== 1 ? "s" : ""} found
                    <Box component="span" sx={{ ml: 1, color: "#9ca3af", fontWeight: 400, fontSize: "0.78rem" }}>
                      — untick any you don't want
                    </Box>
                  </Typography>
                  <Box display="flex" gap={0.8}>
                    <Button size="small" onClick={() => setSelected(preview.detected.map((_, i) => i))}
                      sx={{ fontSize: "0.72rem", color: accentColor }}>All</Button>
                    <Button size="small" onClick={() => setSelected([])}
                      sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>None</Button>
                  </Box>
                </Box>

                <Box sx={{ maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 0.8 }}>
                  {preview.detected.map((item, i) => {
                    const checked = selected.includes(i);
                    return (
                      <Box
                        key={i}
                        onClick={() => toggleItem(i)}
                        sx={{
                          display: "flex", alignItems: "center", gap: 1.5,
                          px: 1.5, py: 1.2, borderRadius: 2, cursor: "pointer",
                          background: checked ? "#f0f4ec" : "#f9fafb",
                          border: `1.5px solid ${checked ? accentColor : "#e5e7eb"}`,
                          transition: "all 0.15s",
                          "&:hover": { borderColor: accentColor, background: "#f0f4ec" },
                        }}
                      >
                        {/* Checkbox */}
                        <Box sx={{
                          width: 20, height: 20, borderRadius: 1, flexShrink: 0,
                          border: `2px solid ${checked ? accentColor : "#d1d5db"}`,
                          background: checked ? accentColor : "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}>
                          {checked && <Typography sx={{ color: "#fff", fontSize: "0.72rem", fontWeight: 900, lineHeight: 1 }}>✓</Typography>}
                        </Box>

                        {/* Item name */}
                        <Typography fontSize="0.9rem" fontWeight={600} color="#374151" flex={1}>
                          {item.name}
                        </Typography>

                        {/* Detected qty + unit */}
                        {(item.qty || item.unit) && (
                          <Box sx={{
                            background: checked ? `${accentColor}22` : "#f3f4f6",
                            border: `1px solid ${checked ? accentColor : "#e5e7eb"}`,
                            borderRadius: 1.5, px: 1.2, py: 0.3,
                          }}>
                            <Typography fontSize="0.78rem" fontWeight={700}
                              color={checked ? accentColor : "#9ca3af"}>
                              {[item.qty, item.unit].filter(Boolean).join(" ")}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>

                {/* Footer actions */}
                <Box display="flex" gap={1.5} mt={2.5}>
                  <Button
                    fullWidth variant="contained"
                    disabled={selected.length === 0}
                    onClick={confirm}
                    sx={{
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                      borderRadius: 2, fontWeight: 700, py: 1.2,
                      boxShadow: `0 4px 14px ${accentColor}44`,
                    }}
                  >
                    Add {selected.length} ingredient{selected.length !== 1 ? "s" : ""}
                  </Button>
                  <Button fullWidth variant="outlined" onClick={cancel}
                    sx={{ borderRadius: 2, fontWeight: 600, borderColor: "#e5e7eb", color: "#6b7280" }}>
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};


const shimmerSx = {
  background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
  "@keyframes shimmer": {
    "0%": { backgroundPosition: "200% 0" },
    "100%": { backgroundPosition: "-200% 0" },
  },
};

const SkeletonCard = () => (
  <Card sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #f3f4f6" }}>
    <Box sx={{ height: 160, ...shimmerSx }} />
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ height: 16, borderRadius: 1, mb: 1, width: "70%", ...shimmerSx }} />
      <Box sx={{ height: 12, borderRadius: 1, mb: 0.8, width: "90%", ...shimmerSx }} />
      <Box sx={{ height: 12, borderRadius: 1, width: "55%", ...shimmerSx }} />
    </CardContent>
  </Card>
);

// ─── Empty State Illustrations ────────────────────────────────────────────────
const EmptyStateIllustration = ({ type, message, subMessage, action }) => {
  const illustrations = {
    pantry: (
      <svg width="140" height="120" viewBox="0 0 140 120">
        <rect x="20" y="30" width="100" height="75" rx="8" fill="#f0f4ec" stroke="#b8cead" strokeWidth="2"/>
        <rect x="30" y="20" width="80" height="20" rx="4" fill="#b8714e"/>
        <rect x="35" y="50" width="30" height="8" rx="3" fill="#e8d48a"/>
        <rect x="75" y="50" width="30" height="8" rx="3" fill="#e8d48a"/>
        <rect x="35" y="65" width="20" height="8" rx="3" fill="#b8cead"/>
        <rect x="60" y="65" width="45" height="8" rx="3" fill="#b8cead"/>
        <rect x="35" y="80" width="35" height="8" rx="3" fill="#e8d48a"/>
        <circle cx="110" cy="28" r="14" fill="#6b8c5a"/>
        <text x="110" y="33" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">+</text>
      </svg>
    ),
    saved: (
      <svg width="140" height="120" viewBox="0 0 140 120">
        <rect x="25" y="15" width="90" height="95" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="2"/>
        <path d="M55 15 L55 60 L70 48 L85 60 L85 15" fill="#22c55e"/>
        <rect x="40" y="70" width="60" height="8" rx="3" fill="#bbf7d0"/>
        <rect x="40" y="83" width="40" height="6" rx="3" fill="#bbf7d0"/>
        <circle cx="110" cy="25" r="18" fill="#fff" stroke="#86efac" strokeWidth="2"/>
        <text x="110" y="31" textAnchor="middle" fill="#22c55e" fontSize="18">🍽️</text>
      </svg>
    ),
    search: (
      <svg width="140" height="120" viewBox="0 0 140 120">
        <circle cx="58" cy="52" r="32" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="2.5"/>
        <circle cx="58" cy="52" r="22" fill="#fff" stroke="#d1d5db" strokeWidth="1.5"/>
        <line x1="82" y1="76" x2="112" y2="106" stroke="#9ca3af" strokeWidth="5" strokeLinecap="round"/>
        <text x="58" y="57" textAnchor="middle" fill="#d1d5db" fontSize="18">?</text>
      </svg>
    ),
    plan: (
      <svg width="140" height="120" viewBox="0 0 140 120">
        <rect x="15" y="10" width="110" height="100" rx="8" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2"/>
        <rect x="15" y="10" width="110" height="28" rx="8" fill="#3b82f6"/>
        <rect x="15" y="30" width="110" height="8" fill="#3b82f6"/>
        {[0,1,2,3].map(i => (
          <React.Fragment key={i}>
            <rect x="25" y={52 + i * 15} width="22" height="10" rx="3" fill="#bfdbfe"/>
            <rect x="55" y={52 + i * 15} width="22" height="10" rx="3" fill="#bfdbfe"/>
            <rect x="85" y={52 + i * 15} width="25" height="10" rx="3" fill="#bfdbfe"/>
          </React.Fragment>
        ))}
        <text x="70" y="30" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">5-DAY PLAN</text>
      </svg>
    ),
  };

  return (
    <Box textAlign="center" py={8}>
      <Box display="flex" justifyContent="center" mb={2}>
        {illustrations[type] || illustrations.pantry}
      </Box>
      <Typography fontWeight={700} fontSize="1rem" color="#374151" mb={0.5}>{message}</Typography>
      {subMessage && (
        <Typography variant="body2" color="text.secondary" mb={action ? 2 : 0} maxWidth={320} mx="auto">
          {subMessage}
        </Typography>
      )}
      {action}
    </Box>
  );
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({ value = 0, onChange, readOnly = false, size = 22 }) => (
  <Box display="flex" gap={0.3}>
    {[1, 2, 3, 4, 5].map(star => (
      <Box
        key={star}
        onClick={() => !readOnly && onChange && onChange(star === value ? 0 : star)}
        sx={{
          cursor: readOnly ? "default" : "pointer",
          color: star <= value ? "#c49a3c" : "#d1d5db",
          fontSize: size,
          transition: "color 0.15s, transform 0.1s",
          "&:hover": readOnly ? {} : { transform: "scale(1.2)", color: "#c49a3c" },
          display: "flex", alignItems: "center",
        }}
      >
        {star <= value ? <StarIcon sx={{ fontSize: size }} /> : <StarBorderIcon sx={{ fontSize: size }} />}
      </Box>
    ))}
  </Box>
);

// ─── FilterPill ───────────────────────────────────────────────────────────────
const FilterPill = ({ item, active, onClick }) => (
  <Box onClick={onClick} sx={{
    display: "inline-flex", alignItems: "center", gap: 0.6,
    px: 1.5, py: 0.7, borderRadius: "20px",
    fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", userSelect: "none",
    transition: "all 0.18s ease", border: "1.5px solid",
    borderColor: active ? "#6b8c5a" : "#e5e7eb",
    background: active ? "#f0f4ec" : "#fff",
    color: active ? "#6b8c5a" : "#6b7280",
    "&:hover": { borderColor: "#6b8c5a", color: "#6b8c5a", background: "#f0f4ec" },
  }}>
    <span style={{ fontSize: "1rem" }}>{item.emoji}</span>
    <span>{item.label}</span>
  </Box>
);

// ─── SectionHeader ────────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle, accent }) => (
  <Box mt={5} mb={2.5} p={2.5} sx={{
    background: accent === "lock"
      ? "linear-gradient(135deg, #f0f4ec 0%, #e8f2e4 100%)"
      : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    borderRadius: 3,
    borderLeft: `4px solid ${accent === "lock" ? "#b8714e" : "#22c55e"}`,
  }}>
    <Box display="flex" alignItems="center" gap={1}>
      {icon}
      <Typography variant="h6" fontWeight={800} color={accent === "lock" ? "#5a7a48" : "#15803d"}>
        {title}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary" mt={0.3}>{subtitle}</Typography>
  </Box>
);

// ─── RecipeImage with Skeleton ────────────────────────────────────────────────
const imageMemCache = {};

const RecipeImage = ({ title, height = 160 }) => {
 // const API = "http://localhost:5000";
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [src, setSrc] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    if (!title) { setImgLoading(false); return; }
    const key = title.toLowerCase();
    if (imageMemCache[key] !== undefined) {
      setSrc(imageMemCache[key]);
      setImgLoading(false);
      return;
    }
    let cancelled = false;
    fetch(`${API}/image?q=${encodeURIComponent(title)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const url = data.url || null;
        imageMemCache[key] = url;
        setSrc(url);
        setImgLoading(false);
      })
      .catch(() => { if (!cancelled) setImgLoading(false); });
    return () => { cancelled = true; };
  }, [title]);

  if (imgLoading) return (
    <Box sx={{ width: "100%", height, ...shimmerSx }} />
  );

  if (!src) return (
    <Box sx={{
      width: "100%", height,
      background: "linear-gradient(135deg, #f0f4ec, #e8f0e4)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <Typography sx={{ fontSize: "2.2rem", mb: 0.5 }}>🍽️</Typography>
      <Typography variant="caption" color="text.secondary" fontSize="0.7rem" px={1} textAlign="center">
        {title?.substring(0, 28)}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", height, overflow: "hidden" }}>
      <img src={src} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </Box>
  );
};

// ─── IngredientChips ──────────────────────────────────────────────────────────
const IngredientChips = ({ items, onRemove }) => (
  <Box mt={1.5} display="flex" flexWrap="wrap" gap={1}>
    {items.map((ing, idx) => (
      <Chip key={idx}
        label={[ing.qty, ing.unit, ing.name].filter(Boolean).join(" ")}
        onDelete={() => onRemove(idx)}
        deleteIcon={<CloseIcon sx={{ fontSize: "0.85rem !important" }} />}
        sx={{
          background: "#f0f4ec", color: "#6b8c5a", border: "1px solid #a8c298",
          fontWeight: 600, fontSize: "0.8rem",
          "& .MuiChip-deleteIcon": { color: "#8aaa7a" },
        }}
      />
    ))}
  </Box>
);

// ─── MealPlanGrid ─────────────────────────────────────────────────────────────
const MealPlanGrid = ({ plan, onViewRecipe, recipeRatings = {}, onRate, onSwap, swapping = {} }) => {
  if (!plan || plan.length === 0) return null;
  return (
    <Box mt={3}>
      {plan.map((dayObj) => {
        const colors = DAY_COLORS[dayObj.day] || DAY_COLORS.Monday;
        return (
          <Box key={dayObj.day} mb={3} sx={{
            background: colors.bg, border: `1px solid ${colors.border}`,
            borderRadius: 3, overflow: "hidden",
          }}>
            <Box px={3} py={1.5} sx={{ background: colors.accent, display: "flex", alignItems: "center", gap: 1.5 }}>
              <CalendarMonthIcon sx={{ color: "#fff", fontSize: 20 }} />
              <Typography fontWeight={800} color="#fff" fontSize="1rem">{dayObj.day}</Typography>
            </Box>
            <Grid container spacing={0}>
              {MEALS.map((meal, mi) => {
                const entry = dayObj.meals?.[meal];
                const rating = entry?.name ? (recipeRatings[entry.name] || 0) : 0;
                const swapKey = `${dayObj.day}-${meal}`;
                const isSwapping = swapping[swapKey];
                return (
                  <Grid item xs={12} sm={6} md={3} key={meal}>
                    <Box sx={{
                      p: 2,
                      borderRight: mi < 3 ? `1px solid ${colors.border}` : "none",
                      borderBottom: { xs: `1px solid ${colors.border}`, md: "none" },
                      minHeight: 130,
                      display: "flex", flexDirection: "column",
                    }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.3}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: colors.accent, textTransform: "uppercase", letterSpacing: "0.07em", fontSize: "0.65rem" }}>
                          {meal}
                        </Typography>
                        {onSwap && (
                          <Tooltip title={`Swap ${meal}`} arrow>
                            <IconButton size="small" onClick={e => { e.stopPropagation(); onSwap(dayObj.day, meal); }}
                              disabled={isSwapping}
                              sx={{ p: 0.3, color: colors.accent, opacity: 0.7, "&:hover": { opacity: 1, background: `${colors.border}` } }}>
                              {isSwapping
                                ? <CircularProgress size={12} sx={{ color: colors.accent }} />
                                : <AutorenewIcon sx={{ fontSize: 14 }} />}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      {entry?.name ? (
                        <>
                          <Box
                            onClick={() => onViewRecipe(entry.name)}
                            sx={{ cursor: "pointer", flex: 1, "&:hover .view-link": { opacity: 1 } }}
                          >
                            <Typography fontWeight={700} fontSize="0.88rem" color="#1a1a1a" mt={0.3} lineHeight={1.3}>
                              {entry.name}
                            </Typography>
                            {entry.note && (
                              <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                                {entry.note}
                              </Typography>
                            )}
                            <Typography className="view-link" variant="caption" sx={{ color: colors.accent, fontWeight: 600, fontSize: "0.72rem", display: "block", mt: 0.3, opacity: 0.7, transition: "opacity 0.15s" }}>
                              View recipe →
                            </Typography>
                          </Box>
                          <Box mt={0.8} onClick={e => e.stopPropagation()}>
                            <StarRating
                              value={rating}
                              onChange={onRate ? (v) => onRate(entry.name, v) : undefined}
                              size={14}
                            />
                          </Box>
                        </>
                      ) : (
                        <Typography color="text.disabled" fontSize="0.8rem" mt={0.5}>—</Typography>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

// ─── FiltersPanel (with Cuisine) ──────────────────────────────────────────────
const FiltersPanel = ({
  activeFoodTypes, setActiveFoodTypes,
  activeDiet, setActiveDiet,
  activeDifficulty, setActiveDifficulty,
  activeCuisine, setActiveCuisine,
  subtitle,
}) => {
  const [open, setOpen] = useState(false);
  const total = activeFoodTypes.length + activeDiet.length + (activeDifficulty ? 1 : 0) + (activeCuisine || []).length;
  const toggle = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  return (
    <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden", mb: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between"
        px={3} py={2} sx={{ cursor: "pointer", "&:hover": { background: "#fafafa" } }}
        onClick={() => setOpen(!open)}>
        <Box display="flex" alignItems="center" gap={1.2}>
          <TuneIcon sx={{ color: "#6b8c5a", fontSize: 20 }} />
          <Typography fontWeight={700} color="#374151">Filters</Typography>
          {total > 0 && (
            <Box sx={{
              background: "#6b8c5a", color: "#fff", borderRadius: "12px",
              px: 1, py: 0.1, fontSize: "0.7rem", fontWeight: 800, minWidth: 22, textAlign: "center",
            }}>{total}</Box>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary">
          {open ? "▲ Hide" : "▼ Show"} · {subtitle}
        </Typography>
      </Box>

      {open && (
        <Box px={3} pb={3}>
          <Divider sx={{ mb: 2.5 }} />

          <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>
            🌍 Cuisine
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={3}>
            {CUISINE_OPTIONS.map(c => (
              <FilterPill key={c.label} item={c}
                active={(activeCuisine || []).includes(c.label)}
                onClick={() => toggle(activeCuisine || [], setActiveCuisine, c.label)}
              />
            ))}
          </Box>

          <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>
            🍽️ Food Type
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={3}>
            {FOOD_TYPES.map(f => (
              <FilterPill key={f.label} item={f}
                active={activeFoodTypes.includes(f.label)}
                onClick={() => toggle(activeFoodTypes, setActiveFoodTypes, f.label)}
              />
            ))}
          </Box>

          <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>
            🥦 Dietary Preferences
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {DIET_OPTIONS.map(d => (
              <FilterPill key={d.label} item={d}
                active={activeDiet.includes(d.label)}
                onClick={() => toggle(activeDiet, setActiveDiet, d.label)}
              />
            ))}
          </Box>

          <Box mt={3}>
            <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>
              🎯 Difficulty Level
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {DIFFICULTY_OPTIONS.map(d => (
                <FilterPill key={d.label} item={d}
                  active={activeDifficulty === d.label}
                  onClick={() => setActiveDifficulty(prev => prev === d.label ? null : d.label)}
                />
              ))}
            </Box>
          </Box>

          {total > 0 && (
            <Box mt={2}>
              <Button size="small" onClick={() => {
                setActiveFoodTypes([]); setActiveDiet([]); setActiveDifficulty(null);
                if (setActiveCuisine) setActiveCuisine([]);
              }} sx={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                ✕ Clear all filters
              </Button>
            </Box>
          )}
        </Box>
      )}

      {total > 0 && (
        <Box px={3} pb={2} display="flex" flexWrap="wrap" gap={0.8} alignItems="center">
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Active:</Typography>
          {[...(activeCuisine || []), ...activeFoodTypes, ...activeDiet, ...(activeDifficulty ? [activeDifficulty] : [])].map(f => (
            <Chip key={f} label={f} size="small" sx={{
              background: "#f0f3ec", color: "#6b8c5a", border: "1px solid #a8c298",
              fontWeight: 600, fontSize: "0.72rem", height: 22,
            }} />
          ))}
        </Box>
      )}
    </Box>
  );
};

// ─── Cook Mode ────────────────────────────────────────────────────────────────
const CookMode = ({ open, recipe, onClose, language = "English" }) => {
  const LANG_MAP = {
    English: "en-US", Hindi: "hi-IN", Tamil: "ta-IN", Telugu: "te-IN",
    Kannada: "kn-IN", Malayalam: "ml-IN", Marathi: "mr-IN", Bengali: "bn-IN",
    Punjabi: "pa-IN", Gujarati: "gu-IN", Odia: "or-IN", Assamese: "as-IN",
    Urdu: "ur-PK", Spanish: "es-ES", French: "fr-FR", German: "de-DE",
    Italian: "it-IT", Japanese: "ja-JP", Chinese: "zh-CN", Arabic: "ar-SA",
    Portuguese: "pt-BR", Korean: "ko-KR", Russian: "ru-RU", Turkish: "tr-TR",
  };
  const langCode = LANG_MAP[language] || "en-US";

  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const intervalRef = useRef(null);

  const steps = recipe?.steps || [];
  const current = steps[step];
  const stepText = typeof current === "string" ? current : current?.text || "";
  const stepTime = current?.time_min ? current.time_min * 60 : null;

  useEffect(() => {
    setStep(0);
    setRunning(false);
    setTimeLeft(0);
    clearInterval(intervalRef.current);
  }, [open, recipe]);

  useEffect(() => {
    if (stepTime) setTimeLeft(stepTime);
    setRunning(false);
    clearInterval(intervalRef.current);
  }, [step]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const speakStep = useCallback((text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = langCode;
    utt.rate = 1;
    window.speechSynthesis.speak(utt);
  }, [langCode]);

  // Auto-read when step changes (if enabled)
  useEffect(() => {
    if (autoRead && stepText) speakStep(`Step ${step + 1}. ${stepText}`);
  }, [step, autoRead]);

  // Stop reading when cook mode closes
  useEffect(() => {
    if (!open) window.speechSynthesis?.cancel();
  }, [open]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!open || !recipe) return null;

  return (
    <Dialog open={open} onClose={onClose} fullScreen
      PaperProps={{ sx: { background: "#141210" } }}>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <Box sx={{ px: 4, py: 2.5, background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ color: "#b8714e", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Cook Mode · {recipe._title || "Recipe"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
              Step {step + 1} of {steps.length}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            {/* Manual read step button */}
            <Tooltip title="Read this step aloud" arrow>
              <IconButton onClick={() => speakStep(`Step ${step + 1}. ${stepText}`)}
                size="small"
                sx={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 1.5, "&:hover": { color: "#b8714e", borderColor: "rgba(184,113,78,0.4)" } }}>
                <VolumeUpIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            {/* Auto-read toggle */}
            <Tooltip title={autoRead ? "Auto-read ON — tap to disable" : "Auto-read OFF — tap to enable"} arrow>
              <Box onClick={() => { setAutoRead(a => !a); window.speechSynthesis?.cancel(); }}
                sx={{
                  display: "flex", alignItems: "center", gap: 0.8,
                  px: 1.4, py: 0.6, borderRadius: 2, cursor: "pointer",
                  background: autoRead ? "rgba(184,113,78,0.2)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${autoRead ? "rgba(184,113,78,0.5)" : "rgba(255,255,255,0.1)"}`,
                  transition: "all 0.2s",
                }}>
                <GraphicEqIcon sx={{ fontSize: 14, color: autoRead ? "#b8714e" : "rgba(255,255,255,0.3)" }} />
                <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: autoRead ? "#c4b08a" : "rgba(255,255,255,0.3)" }}>
                  {autoRead ? "Auto-read ON" : "Auto-read"}
                </Typography>
              </Box>
            </Tooltip>
            <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#fff" } }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={((step + 1) / steps.length) * 100}
          sx={{
            height: 3, background: "rgba(255,255,255,0.08)",
            "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #b8714e, #6b8c5a)" },
          }}
        />

        {/* Main content */}
        <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Step display */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: { xs: 4, md: 8 } }}>
            <Box sx={{
              width: 60, height: 60, borderRadius: "50%",
              background: "linear-gradient(135deg, #6b8c5a, #4a7a3a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem", fontWeight: 900, color: "#fff", mb: 4,
              boxShadow: "0 0 32px rgba(107,140,90,0.4)",
            }}>
              {step + 1}
            </Box>

            <Typography sx={{
              color: "#fff", fontSize: { xs: "1.2rem", md: "1.6rem" },
              fontWeight: 500, lineHeight: 1.7, textAlign: "center",
              maxWidth: 680,
            }}>
              {stepText}
            </Typography>

            {/* Timer */}
            {stepTime && (
              <Box mt={5} textAlign="center">
                <Typography sx={{
                  color: running ? "#b8714e" : (timeLeft === 0 && stepTime ? "#22c55e" : "rgba(255,255,255,0.5)"),
                  fontSize: "3rem", fontWeight: 900, letterSpacing: "0.05em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {formatTime(timeLeft)}
                </Typography>
                <Box display="flex" gap={1.5} justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    onClick={() => setRunning(r => !r)}
                    startIcon={running ? <PauseIcon /> : <PlayArrowIcon />}
                    sx={{
                      background: running ? "rgba(107,140,90,0.2)" : "linear-gradient(135deg, #b8714e, #6b8c5a)",
                      border: running ? "1px solid rgba(107,140,90,0.5)" : "none",
                      borderRadius: 2, fontWeight: 700,
                    }}>
                    {running ? "Pause" : timeLeft === 0 ? "Restart" : "Start Timer"}
                  </Button>
                  {timeLeft < stepTime && (
                    <Button onClick={() => { setTimeLeft(stepTime); setRunning(false); }}
                      sx={{ color: "rgba(255,255,255,0.4)", borderRadius: 2 }}>
                      Reset
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          {/* Ingredients sidebar */}
          <Box sx={{
            width: { xs: 0, lg: 280 }, overflow: "hidden", display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            background: "rgba(255,255,255,0.03)", borderLeft: "1px solid rgba(255,255,255,0.07)",
            p: 3,
          }}>
            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", mb: 2 }}>
              Ingredients
            </Typography>
            {recipe.ingredients?.main?.map((ing, i) => (
              <Box key={i} sx={{ mb: 1.5, pb: 1.5, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <Typography sx={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600 }}>{ing.name}</Typography>
                <Typography sx={{ color: "#b8714e", fontSize: "0.78rem" }}>{ing.quantity}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ px: 4, py: 3, background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            startIcon={<ChevronLeftIcon />}
            sx={{ color: step === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)", fontWeight: 600 }}>
            Previous
          </Button>

          {/* Step dots */}
          <Box display="flex" gap={0.8}>
            {steps.map((_, i) => (
              <Box key={i} onClick={() => setStep(i)} sx={{
                width: i === step ? 20 : 8, height: 8, borderRadius: "4px",
                background: i === step ? "#b8714e" : i < step ? "#b8714e50" : "rgba(255,255,255,0.12)",
                cursor: "pointer", transition: "all 0.2s ease",
              }} />
            ))}
          </Box>

          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              endIcon={<ChevronRightIcon />}
              sx={{
                background: "linear-gradient(135deg, #b8714e, #6b8c5a)",
                color: "#fff", fontWeight: 700, borderRadius: 2, px: 3,
              }}>
              Next Step
            </Button>
          ) : (
            <Button onClick={onClose} sx={{
              background: "#22c55e", color: "#fff", fontWeight: 700, borderRadius: 2, px: 3,
            }}>
              🎉 Done!
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

// ─── Shopping List Modal ──────────────────────────────────────────────────────
const CATEGORY_RULES = {
  "🥩 Meat & Protein": ["chicken", "beef", "pork", "lamb", "turkey", "fish", "salmon", "tuna", "shrimp", "tofu", "tempeh", "bacon", "sausage", "egg", "eggs"],
  "🥦 Produce": ["lettuce", "spinach", "kale", "onion", "garlic", "tomato", "carrot", "broccoli", "pepper", "celery", "zucchini", "cucumber", "potato", "sweet potato", "lemon", "lime", "avocado", "mushroom", "ginger", "herb", "basil", "cilantro", "parsley", "apple", "banana", "berry"],
  "🥛 Dairy": ["milk", "cheese", "butter", "cream", "yogurt", "parmesan", "mozzarella", "feta", "ricotta", "sour cream", "heavy cream"],
  "🌾 Grains & Pasta": ["flour", "rice", "pasta", "noodle", "bread", "oat", "quinoa", "barley", "cornmeal", "tortilla", "panko", "breadcrumb"],
  "🥫 Pantry": ["oil", "vinegar", "soy sauce", "tomato paste", "coconut milk", "broth", "stock", "can", "bean", "lentil", "chickpea", "sugar", "honey", "salt", "pepper", "cumin", "paprika", "turmeric", "cinnamon", "oregano", "thyme"],
};

function categorizeIngredient(name) {
  const n = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(k => n.includes(k))) return cat;
  }
  return "📦 Other";
}

const ShoppingListModal = ({ open, onClose, items, title }) => {
  const [checked, setChecked] = useState({});

  const grouped = {};
  items.forEach(item => {
    const cat = categorizeIngredient(item.name || item);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  const allText = Object.entries(grouped).map(([cat, its]) =>
    `${cat}\n${its.map(i => `  - ${typeof i === "string" ? i : [i.qty, i.unit, i.name].filter(Boolean).join(" ")}`).join("\n")}`
  ).join("\n\n");

  const toggleCheck = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const totalItems = items.length;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: "85vh" } }}>
      <DialogTitle sx={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <ShoppingCartIcon sx={{ color: "#b8714e" }} />
          <Box>
            <Typography fontWeight={800} color="#fff">{title || "Shopping List"}</Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
              {checkedCount}/{totalItems} items checked
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.5)" }}><CloseIcon /></IconButton>
      </DialogTitle>

      <LinearProgress
        variant="determinate"
        value={totalItems ? (checkedCount / totalItems) * 100 : 0}
        sx={{
          height: 4, background: "#f3f4f6",
          "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #b8714e, #22c55e)" },
        }}
      />

      <DialogContent sx={{ p: 0 }}>
        {Object.entries(grouped).map(([cat, its]) => (
          <Box key={cat}>
            <Box px={3} py={1.5} sx={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
              <Typography fontWeight={800} fontSize="0.8rem" color="#374151">{cat}</Typography>
            </Box>
            {its.map((item, i) => {
              const label = typeof item === "string" ? item : [item.qty, item.unit, item.name].filter(Boolean).join(" ");
              const key = `${cat}:${i}`;
              return (
                <Box key={i} onClick={() => toggleCheck(key)} sx={{
                  px: 3, py: 1.5, display: "flex", alignItems: "center", gap: 2,
                  cursor: "pointer", borderBottom: "1px solid #f9fafb",
                  "&:hover": { background: "#fafafa" },
                  opacity: checked[key] ? 0.45 : 1,
                  transition: "opacity 0.15s",
                }}>
                  {checked[key]
                    ? <CheckBoxIcon sx={{ color: "#22c55e", fontSize: 20 }} />
                    : <CheckBoxOutlineBlankIcon sx={{ color: "#d1d5db", fontSize: 20 }} />
                  }
                  <Typography fontSize="0.9rem" color="#374151"
                    sx={{ textDecoration: checked[key] ? "line-through" : "none" }}>
                    {label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ))}
      </DialogContent>

      <Box px={3} py={2} sx={{ borderTop: "1px solid #f3f4f6", display: "flex", gap: 1.5 }}>
        <Button startIcon={<ContentCopyIcon />} variant="outlined" size="small"
          onClick={() => { navigator.clipboard.writeText(allText); }}
          sx={{ borderColor: "#e5e7eb", color: "#374151", borderRadius: 2, fontSize: "0.8rem" }}>
          Copy List
        </Button>
        <Button startIcon={<PrintIcon />} variant="outlined" size="small"
          onClick={() => { const w = window.open(); w.document.write(`<pre style="font-family:sans-serif;font-size:14px;padding:24px">${allText}</pre>`); w.print(); }}
          sx={{ borderColor: "#e5e7eb", color: "#374151", borderRadius: 2, fontSize: "0.8rem" }}>
          Print
        </Button>
        <Button size="small" onClick={() => setChecked({})}
          sx={{ ml: "auto", color: "#9ca3af", fontSize: "0.8rem" }}>
          Uncheck All
        </Button>
      </Box>
    </Dialog>
  );
};

// ─── Substitution Modal ───────────────────────────────────────────────────────
const SubstitutionModal = ({ open, ingredient, recipeName, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
//  const API = "http://localhost:5000";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!open || !ingredient) return;
    setLoading(true); setResults([]); setError(null);
    axios.post(`${API}/ingredient-sub`, { ingredient, recipeName })
      .then(r => setResults(r.data.substitutions || []))
      .catch(() => setError("Failed to load substitutions"))
      .finally(() => setLoading(false));
  }, [open, ingredient, recipeName]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{
        background: "linear-gradient(135deg, #f0f4ec, #f0f3ec)",
        borderBottom: "1px solid #f3f4f6", fontWeight: 800,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <SwapHorizIcon sx={{ color: "#b8714e" }} />
          <Typography fontWeight={800}>Substitute: {ingredient}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {loading && (
          <Box display="flex" alignItems="center" gap={2} py={3}>
            <CircularProgress size={20} sx={{ color: "#b8714e" }} />
            <Typography color="text.secondary">Finding smart swaps…</Typography>
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
        {results.map((sub, i) => (
          <Box key={i} mb={2} p={2} sx={{ background: "#f0f4ec", borderRadius: 2, border: "1px solid #b8cead" }}>
            <Typography fontWeight={800} color="#5a7a48" mb={0.3}>{sub.name}</Typography>
            {sub.ratio && <Typography variant="caption" sx={{ color: "#b8714e", fontWeight: 700, display: "block", mb: 0.3 }}>Amount: {sub.ratio}</Typography>}
            <Typography fontSize="0.85rem" color="#374151">{sub.note}</Typography>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

// ─── Nutrition Dashboard ──────────────────────────────────────────────────────
const NutritionDashboard = ({ plan }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
 // const API = "http://localhost:5000";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const mealNames = React.useMemo(() => {
    if (!plan) return [];
    const names = [];
    plan.forEach(d => Object.values(d.meals).forEach(m => { if (m.name) names.push(m.name); }));
    return [...new Set(names)];
  }, [plan]);

  const analyze = async () => {
    setLoading(true); setData(null); setOpen(true);
    try {
      const res = await axios.post(`${API}/nutrition-summary`, { mealNames });
      const meals = res.data.meals || [];
      const totals = meals.reduce((acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein_g || 0),
        carbs: acc.carbs + (m.carbs_g || 0),
        fat: acc.fat + (m.fat_g || 0),
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
      setData({ meals, totals });
    } catch { setData(null); }
    setLoading(false);
  };

  if (!plan || plan.length === 0) return null;

  return (
    <>
      <Box mt={3} p={2.5} sx={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <BarChartIcon sx={{ color: "#b8714e" }} />
            <Box>
              <Typography fontWeight={800} color="#fff" fontSize="0.95rem">Weekly Nutrition Estimate</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                {mealNames.length} unique meals across the plan
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" size="small" onClick={analyze} disabled={loading}
            sx={{ background: "linear-gradient(135deg, #b8714e, #6b8c5a)", borderRadius: 2, fontWeight: 700 }}>
            {loading ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "📊 Analyze"}
          </Button>
        </Box>

        {data && (
          <Box mt={3}>
            <Grid container spacing={2} mb={2}>
              {[
                { label: "Total Calories", val: `${data.totals.calories.toLocaleString()} kcal`, color: "#b8714e", bg: "rgba(184,113,78,0.15)" },
                { label: "Total Protein", val: `${data.totals.protein}g`, color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
                { label: "Total Carbs", val: `${data.totals.carbs}g`, color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
                { label: "Total Fat", val: `${data.totals.fat}g`, color: "#a855f7", bg: "rgba(168,85,247,0.15)" },
              ].map((n, i) => (
                <Grid item xs={6} sm={3} key={i}>
                  <Box sx={{ background: n.bg, borderRadius: 2, p: 1.5, textAlign: "center" }}>
                    <Typography fontWeight={900} color={n.color} fontSize="1.1rem">{n.val}</Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>{n.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem" }}>
              * Estimates based on typical serving sizes. Actual values may vary.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

// ─── Onboarding Flow ──────────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  {
    title: "Welcome to Fridgely 🧊",
    desc: "Open your fridge. Look at what's there. That's your starting point — and Fridgely makes it enough.",
    icon: "🍳",
    highlight: null,
  },
  {
    title: "Type what you've got",
    desc: "Type what's in your fridge with quantity and unit, then hit Generate Recipes to see what you can cook!",
    icon: "📦",
    highlight: "recipes",
  },
  {
    title: "Save the ones you love",
    desc: "Star any recipe you love and leave personal notes. Access everything in Saved Recipes.",
    icon: "⭐",
    highlight: "saved",
  },
  {
    title: "Plan your whole week",
    desc: "Head to Meal Planner to auto-generate a full 5-day plan. You can even build a shopping list from it!",
    icon: "📅",
    highlight: "planner",
  },
];

const OnboardingFlow = ({ onFinish, setPage }) => {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;

  return (
    <Box sx={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Box sx={{
        background: "#fff", borderRadius: 4, p: 4, maxWidth: 420, width: "90%",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        "@keyframes popIn": {
          from: { transform: "scale(0.8)", opacity: 0 },
          to: { transform: "scale(1)", opacity: 1 },
        },
      }}>
        {/* Progress dots */}
        <Box display="flex" gap={0.7} mb={3}>
          {ONBOARDING_STEPS.map((_, i) => (
            <Box key={i} sx={{
              height: 4, flex: 1, borderRadius: "2px",
              background: i <= step ? "linear-gradient(90deg,#b8714e,#6b8c5a)" : "#e5e7eb",
              transition: "background 0.3s",
            }} />
          ))}
        </Box>

        <Typography fontSize="2.5rem" mb={1.5}>{current.icon}</Typography>
        <Typography fontWeight={900} fontSize="1.25rem" color="#1a1a1a" mb={1}>{current.title}</Typography>
        <Typography color="#6b7280" lineHeight={1.7} mb={3}>{current.desc}</Typography>

        <Box display="flex" gap={1.5}>
          <Button onClick={onFinish} sx={{ color: "#9ca3af", fontSize: "0.82rem" }}>
            Skip tour
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (current.highlight) setPage(current.highlight);
              if (isLast) { onFinish(); } else setStep(s => s + 1);
            }}
            sx={{
              background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)",
              borderRadius: 2, fontWeight: 700, flex: 1,
              boxShadow: "0 4px 16px rgba(107,140,90,0.3)",
            }}>
            {isLast ? "Let's see what I can cook 🧊" : "Next →"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Recipe Audio Player ──────────────────────────────────────────────────────
const RecipeAudioPlayer = ({ recipe, language = "English" }) => {
  const LANGUAGES_MAP = {
    English: "en-US", Hindi: "hi-IN", Tamil: "ta-IN", Telugu: "te-IN",
    Kannada: "kn-IN", Malayalam: "ml-IN", Marathi: "mr-IN", Bengali: "bn-IN",
    Punjabi: "pa-IN", Gujarati: "gu-IN", Odia: "or-IN", Assamese: "as-IN",
    Urdu: "ur-PK", Spanish: "es-ES", French: "fr-FR", German: "de-DE",
    Italian: "it-IT", Japanese: "ja-JP", Chinese: "zh-CN", Arabic: "ar-SA",
    Portuguese: "pt-BR", Korean: "ko-KR", Russian: "ru-RU", Turkish: "tr-TR",
  };
  const langCode = LANGUAGES_MAP[language] || "en-US";

  // Build segments: each segment is a text chunk with a label
  const buildSegments = () => {
    if (!recipe) return [];
    const segs = [];
    const title = recipe._title || recipe.title || "Recipe";
    segs.push({ label: "Title", text: title, type: "title" });
    if (recipe.servings || recipe.prep_time || recipe.cook_time) {
      const meta = [
        recipe.servings && `Serves ${recipe.servings}`,
        recipe.prep_time && `Preparation time: ${recipe.prep_time}`,
        recipe.cook_time && `Cooking time: ${recipe.cook_time}`,
      ].filter(Boolean).join(". ");
      segs.push({ label: "Details", text: meta, type: "meta" });
    }
    if (recipe.overview) {
      segs.push({ label: "Overview", text: recipe.overview, type: "overview" });
    }
    if (recipe.ingredients?.main?.length) {
      segs.push({ label: "Ingredients", text: "Here are the ingredients you will need.", type: "section" });
      recipe.ingredients.main.forEach((ing, i) => {
        segs.push({
          label: `Ingredient ${i + 1}`,
          text: `${ing.quantity || ""} ${ing.name}`.trim(),
          type: "ingredient",
          index: i,
        });
      });
    }
    if (recipe.steps?.length) {
      segs.push({ label: "Steps", text: "Now let's start cooking. Follow these steps.", type: "section" });
      recipe.steps.forEach((s, i) => {
        const text = typeof s === "string" ? s : s.text;
        const time = typeof s === "object" && s.time_min ? ` This step takes about ${s.time_min} minutes.` : "";
        segs.push({
          label: `Step ${i + 1}`,
          text: `Step ${i + 1}. ${text}${time}`,
          type: "step",
          index: i,
        });
      });
    }
    if (recipe.nutrition) {
      const n = recipe.nutrition;
      const parts = [
        n.calories && `${n.calories} calories`,
        n.protein  && `${n.protein} protein`,
        n.carbs    && `${n.carbs} carbohydrates`,
        n.fat      && `${n.fat} fat`,
      ].filter(Boolean);
      if (parts.length) {
        segs.push({ label: "Nutrition", text: `Nutrition per serving: ${parts.join(", ")}.`, type: "nutrition" });
      }
    }
    segs.push({ label: "Done", text: "That's the complete recipe. Enjoy your meal!", type: "end" });
    return segs;
  };

  const segments = buildSegments();
  const [status, setStatus]   = useState("idle"); // idle | playing | paused
  const [curIdx, setCurIdx]   = useState(0);
  const [speed, setSpeed]     = useState(1);
  const uttRef = useRef(null);
  const idxRef = useRef(0);
  const speedRef = useRef(1);
  const statusRef = useRef("idle");

  // Keep refs in sync
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { statusRef.current = status; }, [status]);

  // Stop everything when recipe changes or component unmounts
  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, [recipe]);

  const speakFrom = (startIdx) => {
    window.speechSynthesis.cancel();
    idxRef.current = startIdx;
    setCurIdx(startIdx);
    setStatus("playing");
    statusRef.current = "playing";
    speakNext();
  };

  const speakNext = () => {
    if (statusRef.current !== "playing") return;
    const idx = idxRef.current;
    if (idx >= segments.length) { setStatus("idle"); setCurIdx(0); return; }

    const seg = segments[idx];
    const utt = new SpeechSynthesisUtterance(seg.text);
    utt.lang = langCode;
    utt.rate = speedRef.current;
    utt.onend = () => {
      if (statusRef.current !== "playing") return;
      idxRef.current = idx + 1;
      setCurIdx(idx + 1);
      speakNext();
    };
    utt.onerror = () => { setStatus("idle"); };
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const handlePlay = () => {
    if (!window.speechSynthesis) return;
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      statusRef.current = "playing";
    } else {
      speakFrom(status === "idle" ? 0 : curIdx);
    }
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setStatus("paused");
    statusRef.current = "paused";
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setStatus("idle");
    setCurIdx(0);
    idxRef.current = 0;
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
    if (status === "playing") {
      // restart current segment at new speed
      window.speechSynthesis.cancel();
      setTimeout(() => speakNext(), 50);
    }
  };

  const handleSegmentClick = (idx) => {
    speakFrom(idx);
  };

  const progress = segments.length ? Math.round((curIdx / segments.length) * 100) : 0;
  const currentSeg = segments[Math.min(curIdx, segments.length - 1)];
  const isActive = status === "playing" || status === "paused";

  const segTypeColor = { title: "#6b8c5a", meta: "#b8714e", overview: "#8b5cf6", section: "#3b82f6", ingredient: "#10b981", step: "#c49a3c", nutrition: "#06b6d4", end: "#6b7280" };
  const segTypeIcon  = { title: "🍳", meta: "ℹ️", overview: "📖", section: "📢", ingredient: "🧂", step: "👨‍🍳", nutrition: "📊", end: "✅" };

  return (
    <Box sx={{ background: "linear-gradient(135deg, #141210 0%, #1c0f0a 100%)", borderRadius: 3, overflow: "hidden", mb: 3 }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, background: "linear-gradient(135deg,#6b8c5a,#b8714e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <VolumeUpIcon sx={{ fontSize: 18, color: "#fff" }} />
        </Box>
        <Box flex={1}>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.88rem", lineHeight: 1 }}>
            Listen to Recipe
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", mt: 0.3 }}>
            {language} · {segments.length} segments
          </Typography>
        </Box>
        {isActive && (
          <Box display="flex" alignItems="center" gap={0.5}>
            {[0,1,2].map(i => (
              <Box key={i} sx={{
                width: 3, borderRadius: 2, background: "#6b8c5a",
                height: status === "playing" ? `${8 + i * 4}px` : "4px",
                transition: "height 0.3s ease",
                animation: status === "playing" ? `bar${i} 0.8s ease-in-out infinite alternate` : "none",
                [`@keyframes bar${i}`]: {
                  from: { height: "4px" }, to: { height: `${8 + i * 6}px` }
                },
                animationDelay: `${i * 0.15}s`,
              }} />
            ))}
          </Box>
        )}
      </Box>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 3, borderRadius: 0,
          background: "rgba(255,255,255,0.08)",
          "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#6b8c5a,#b8714e)" },
        }}
      />

      {/* Current segment display */}
      {isActive && currentSeg && (
        <Box sx={{ px: 3, py: 1.5, background: "rgba(107,140,90,0.08)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Box display="flex" alignItems="flex-start" gap={1}>
            <Typography sx={{ fontSize: "0.9rem", flexShrink: 0, mt: 0.1 }}>{segTypeIcon[currentSeg.type] || "🔊"}</Typography>
            <Box>
              <Typography sx={{ color: segTypeColor[currentSeg.type] || "#6b8c5a", fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.2 }}>
                {currentSeg.label}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                {currentSeg.text.length > 120 ? currentSeg.text.substring(0, 120) + "…" : currentSeg.text}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Controls */}
      <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        {/* Play/Pause */}
        {status === "playing" ? (
          <IconButton onClick={handlePause} sx={{ width: 44, height: 44, background: "#6b8c5a", color: "#fff", "&:hover": { background: "#527a42" } }}>
            <PauseIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handlePlay} sx={{ width: 44, height: 44, background: "linear-gradient(135deg,#6b8c5a,#b8714e)", color: "#fff", "&:hover": { opacity: 0.9 } }}>
            <PlayArrowIcon />
          </IconButton>
        )}

        {/* Stop */}
        {isActive && (
          <IconButton onClick={handleStop} size="small" sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#6b8c5a" } }}>
            <StopIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        {/* Progress text */}
        <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", flex: 1 }}>
          {status === "idle" && curIdx === 0 && "Press play to listen"}
          {status === "idle" && curIdx > 0 && "Finished"}
          {status === "playing" && `${curIdx + 1} / ${segments.length}`}
          {status === "paused" && "Paused"}
        </Typography>

        {/* Speed selector */}
        <Box display="flex" alignItems="center" gap={0.5}>
          <GraphicEqIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }} />
          {[0.8, 1, 1.2, 1.5].map(s => (
            <Box key={s} onClick={() => handleSpeedChange(s)} sx={{
              px: 1, py: 0.4, borderRadius: 1.5, cursor: "pointer", fontSize: "0.72rem", fontWeight: 700,
              background: speed === s ? "#6b8c5a" : "rgba(255,255,255,0.08)",
              color: speed === s ? "#fff" : "rgba(255,255,255,0.4)",
              transition: "all 0.15s",
              "&:hover": { background: speed === s ? "#6b8c5a" : "rgba(255,255,255,0.15)" },
            }}>{s}×</Box>
          ))}
        </Box>
      </Box>

      {/* Segment list — scrollable jump-to */}
      <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)", px: 2, py: 1.5, maxHeight: 160, overflowY: "auto" }}>
        <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", mb: 1 }}>
          Jump to section
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={0.8}>
          {segments.map((seg, i) => (
            <Box key={i} onClick={() => handleSegmentClick(i)} sx={{
              display: "inline-flex", alignItems: "center", gap: 0.5,
              px: 1.2, py: 0.4, borderRadius: "12px", cursor: "pointer",
              background: curIdx === i && isActive ? "rgba(107,140,90,0.25)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${curIdx === i && isActive ? "rgba(107,140,90,0.5)" : "rgba(255,255,255,0.08)"}`,
              transition: "all 0.15s",
              "&:hover": { background: "rgba(107,140,90,0.15)", borderColor: "rgba(107,140,90,0.3)" },
            }}>
              <Typography sx={{ fontSize: "0.7rem" }}>{segTypeIcon[seg.type] || "🔊"}</Typography>
              <Typography sx={{ fontSize: "0.68rem", fontWeight: curIdx === i && isActive ? 700 : 400, color: curIdx === i && isActive ? "#a8c298" : "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
                {seg.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// ─── Low-Stock Detection Helpers ─────────────────────────────────────────────
//
//  "Nearing out of stock" definition — per unit type:
//
//  The thresholds are set to the point where you likely can't complete even
//  one full recipe without running out. A recipe usually needs:
//    - liquids:  at least 200–400 ml  → warn below 200 ml / 0.3 L
//    - dry bulk: at least 100 g        → warn below 100 g / 0.25 kg
//    - small dry: at least 4 tsp       → warn below 4 tsp / 2 tbsp / 0.5 cup
//    - proteins: at least 3 pieces     → warn at 2 or fewer
//    - flavour:  at least 3 cloves     → warn at 3 or fewer cloves
//    - cans/bunches: warn at last 1
//    - unlabelled count items: warn at 2 or fewer
//
const LOW_STOCK_THRESHOLDS = {
  g:       100,
  kg:      0.25,
  ml:      200,
  l:       0.3,
  tsp:     4,
  tbsp:    2,
  cup:     0.5,
  "fl oz": 6,
  oz:      4,
  lb:      0.5,
  piece:   2,
  slice:   2,
  clove:   3,
  can:     1,
  bunch:   1,
};

function getLowStockStatus(item) {
  if (!item.inStock) return null; // already handled as "out of stock"
  const qty = parseFloat(item.qty);
  if (isNaN(qty) || qty <= 0) return null;
  const unit = (item.unit || "").toLowerCase().trim();
  const threshold = LOW_STOCK_THRESHOLDS[unit] ?? 2; // default: count items ≤ 2
  return qty <= threshold ? { isLow: true, qty, unit, threshold } : null;
}

function getIngredientEmoji(name) {
  const n = name.toLowerCase();
  if (n.includes("egg"))         return "🥚";
  if (n.includes("milk"))        return "🥛";
  if (n.includes("butter"))      return "🧈";
  if (n.includes("cheese"))      return "🧀";
  if (n.includes("chicken"))     return "🍗";
  if (n.includes("beef") || n.includes("meat")) return "🥩";
  if (n.includes("fish") || n.includes("salmon") || n.includes("tuna")) return "🐟";
  if (n.includes("tofu"))        return "🍱";
  if (n.includes("tomato"))      return "🍅";
  if (n.includes("onion"))       return "🧅";
  if (n.includes("garlic"))      return "🧄";
  if (n.includes("lemon") || n.includes("lime")) return "🍋";
  if (n.includes("pepper"))      return "🌶️";
  if (n.includes("spinach") || n.includes("lettuce") || n.includes("kale")) return "🥬";
  if (n.includes("carrot"))      return "🥕";
  if (n.includes("potato"))      return "🥔";
  if (n.includes("rice"))        return "🍚";
  if (n.includes("flour") || n.includes("bread")) return "🍞";
  if (n.includes("pasta") || n.includes("noodle")) return "🍝";
  if (n.includes("oil"))         return "🫙";
  if (n.includes("salt"))        return "🧂";
  if (n.includes("sugar") || n.includes("honey")) return "🍯";
  if (n.includes("yogurt") || n.includes("cream")) return "🥗";
  if (n.includes("apple"))       return "🍎";
  if (n.includes("banana"))      return "🍌";
  if (n.includes("bean") || n.includes("lentil") || n.includes("chickpea")) return "🫘";
  return "🥄";
}

function getLowStockMessage(item) {
  const n = item.name.toLowerCase();
  const qtyStr = [item.qty, item.unit].filter(Boolean).join(" ");
  const name   = item.name;

  // Cooking essentials — worst to run out mid-recipe
  if (["oil", "butter"].some(k => n.includes(k)))
    return `Almost out of ${name} (${qtyStr}) — hard to cook anything without it. Restock soon.`;
  if (n.includes("salt"))
    return `Only ${qtyStr} of salt left. It's in every recipe — add it to your next shop.`;
  if (n.includes("flour"))
    return `Running low on ${name} (${qtyStr}). If you bake or bread anything, you'll need more.`;
  if (n.includes("sugar") || n.includes("honey"))
    return `Low on ${name} (${qtyStr}). Used for baking, sauces and marinades — worth grabbing.`;

  // Proteins — bulky items you plan meals around
  if (["chicken", "beef", "lamb", "pork", "turkey", "fish", "salmon", "tuna", "shrimp"].some(k => n.includes(k)))
    return `Only ${qtyStr} of ${name} left — probably not enough for a full meal. Time to stock up.`;
  if (n.includes("egg"))
    return `Just ${qtyStr} remaining. Eggs disappear fast — breakfasts, baking, and bindings all need them.`;
  if (n.includes("tofu"))
    return `Low on ${name} (${qtyStr}). Good protein base — add to your grocery list before your next cook.`;

  // Dairy — short shelf life, often needed urgently
  if (["milk", "cream", "yogurt"].some(k => n.includes(k)))
    return `${name} spoils quickly and you're almost out (${qtyStr}). Grab more before your next cooking session.`;
  if (n.includes("cheese"))
    return `Only ${qtyStr} of ${name} left. Widely used — from pasta to salads. Worth picking up fresh.`;
  if (n.includes("butter"))
    return `Down to ${qtyStr} of butter. A kitchen staple for cooking, baking, and finishing sauces.`;

  // Aromatics — used in almost every cuisine
  if (n.includes("garlic"))
    return `Garlic is in nearly every cuisine — you're down to ${qtyStr}. A cheap and essential restock.`;
  if (n.includes("onion"))
    return `Only ${qtyStr} of ${name} left. Onions are the backbone of most meals — restock soon.`;
  if (n.includes("ginger"))
    return `Running low on ginger (${qtyStr}). Grab fresh or dried — used across Asian, Indian, and Middle Eastern cooking.`;
  if (n.includes("lemon") || n.includes("lime"))
    return `Only ${qtyStr} of ${name} left. A squeeze can finish any dish — worth having on hand.`;

  // Spices — long shelf life, easy to forget
  if (["cumin", "turmeric", "paprika", "cinnamon", "coriander", "cardamom", "chili", "chilli", "oregano", "thyme", "basil"].some(k => n.includes(k)))
    return `Running low on ${name} (${qtyStr}). Spices are cheap and last long — top it up on your next trip.`;

  // Pantry staples
  if (n.includes("rice"))
    return `Only ${qtyStr} of rice left — a meal-plan essential. Easy and cheap to restock in bulk.`;
  if (n.includes("pasta") || n.includes("noodle"))
    return `Low on ${name} (${qtyStr}). Pasta is a quick-meal backbone — grab an extra pack.`;
  if (["lentil", "chickpea", "bean"].some(k => n.includes(k)))
    return `Down to ${qtyStr} of ${name}. A protein-rich pantry staple — great for soups, curries, and salads.`;
  if (n.includes("can") || n.includes("stock") || n.includes("broth"))
    return `Last ${qtyStr} of ${name}. Stocks and canned goods are recipe lifesavers — worth keeping 2–3 on hand.`;

  // Generic fallback — still contextual
  return `${name} is running low (${qtyStr}). Add it to your grocery list before it runs out completely.`;
}

// ─── Low Stock Notification Panel ────────────────────────────────────────────
const LowStockNotificationPanel = ({ open, onClose, lowStockItems, onAddToGrocery, onDismiss, onDismissAll }) => {
  if (!open) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 380,
          background: "#0f1009",
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid rgba(234,179,8,0.2)",
        },
      }}
    >
      {/* Header */}
      <Box sx={{
        px: 3, py: 2.5,
        background: "linear-gradient(135deg, #1a1800, #2a2000)",
        borderBottom: "1px solid rgba(234,179,8,0.15)",
        flexShrink: 0,
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2,
              background: "rgba(234,179,8,0.15)",
              border: "1px solid rgba(234,179,8,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <NotificationsActiveIcon sx={{ color: "#eab308", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography fontWeight={800} color="#fff" fontSize="1rem">Pantry Alerts</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                {lowStockItems.length} item{lowStockItems.length !== 1 ? "s" : ""} running low
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#fff" } }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Urgency bar */}
        <Box sx={{
          mt: 2, px: 2, py: 1.2,
          background: "rgba(234,179,8,0.08)",
          border: "1px solid rgba(234,179,8,0.18)",
          borderRadius: 2,
          display: "flex", alignItems: "center", gap: 1,
        }}>
          <Typography sx={{ fontSize: "0.9rem" }}>💡</Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>
            These items are below the minimum to complete most recipes. Click "Add to grocery list" to restock.
          </Typography>
        </Box>
      </Box>

      {/* Items list */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        {lowStockItems.length === 0 ? (
          <Box textAlign="center" py={8} px={3}>
            <Typography sx={{ fontSize: "2.5rem", mb: 1.5 }}>✅</Typography>
            <Typography fontWeight={700} color="#fff" mb={0.5}>All stocked up!</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
              No pantry items are running critically low right now.
            </Typography>
          </Box>
        ) : (
          lowStockItems.map((item, idx) => {
            const qtyStr = [item.qty, item.unit].filter(Boolean).join(" ");
            const emoji  = getIngredientEmoji(item.name);
            const msg    = getLowStockMessage(item);

            return (
              <Box key={`${item.name}-${idx}`} sx={{
                mx: 2, my: 1,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(234,179,8,0.14)",
                borderRadius: 2.5,
                overflow: "hidden",
                transition: "border-color 0.2s",
                "&:hover": { borderColor: "rgba(234,179,8,0.3)" },
              }}>
                {/* Item header */}
                <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{
                    width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(234,179,8,0.12)",
                    border: "1px solid rgba(234,179,8,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.2rem",
                  }}>
                    {emoji}
                  </Box>
                  <Box flex={1} minWidth={0}>
                    <Typography fontWeight={700} color="#fff" fontSize="0.9rem" noWrap>{item.name}</Typography>
                    <Box display="flex" alignItems="center" gap={0.8} mt={0.3}>
                      <Box sx={{
                        background: "rgba(239,68,68,0.2)",
                        border: "1px solid rgba(239,68,68,0.35)",
                        borderRadius: 1, px: 0.9, py: 0.2,
                      }}>
                        <Typography sx={{ color: "#fca5a5", fontSize: "0.68rem", fontWeight: 700 }}>
                          ⚠ {qtyStr || "almost out"} left
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {/* Dismiss × */}
                  <Tooltip title="Dismiss this alert">
                    <IconButton size="small" onClick={() => onDismiss(item.name)}
                      sx={{ color: "rgba(255,255,255,0.2)", p: 0.4, "&:hover": { color: "rgba(255,255,255,0.6)" } }}>
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Message */}
                <Box sx={{ px: 2, pb: 1.5 }}>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.55, display: "block" }}>
                    {msg}
                  </Typography>

                  {/* Action buttons */}
                  <Box display="flex" gap={1} mt={1.5}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 14 }} />}
                      onClick={() => onAddToGrocery(item)}
                      sx={{
                        background: "linear-gradient(135deg, #eab308, #ca8a04)",
                        color: "#1a1200",
                        borderRadius: 1.5,
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        py: 0.6, px: 1.5,
                        boxShadow: "none",
                        "&:hover": { background: "linear-gradient(135deg, #facc15, #eab308)", boxShadow: "0 4px 12px rgba(234,179,8,0.3)" },
                        transition: "all 0.15s",
                      }}
                    >
                      Add to grocery list
                    </Button>
                    <Button
                      size="small"
                      onClick={() => onDismiss(item.name)}
                      sx={{
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "0.72rem",
                        borderRadius: 1.5,
                        py: 0.6, px: 1.5,
                        "&:hover": { color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)" },
                      }}
                    >
                      Dismiss
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Footer */}
      {lowStockItems.length > 0 && (
        <Box sx={{ px: 3, py: 2, borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", gap: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
            onClick={() => { lowStockItems.forEach(i => onAddToGrocery(i)); onClose(); }}
            sx={{
              borderColor: "rgba(234,179,8,0.4)",
              color: "#eab308",
              borderRadius: 2,
              fontWeight: 700,
              fontSize: "0.8rem",
              "&:hover": { borderColor: "#eab308", background: "rgba(234,179,8,0.08)" },
            }}
          >
            Add all to grocery list
          </Button>
          <Button
            size="small"
            onClick={onDismissAll}
            sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem", whiteSpace: "nowrap", flexShrink: 0 }}
          >
            Dismiss all
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

// ─── Top Rated Page (proper component so hooks work) ─────────────────────────
const MEAT_KEYWORDS = ["chicken","beef","pork","lamb","turkey","fish","salmon","tuna","shrimp","bacon","sausage","steak","mutton","crab","lobster","meat","ham","pepperoni","prawn","anchovy","sardine","duck","venison"];
const isVegRecipe = (title, overview = "") => !MEAT_KEYWORDS.some(k => (title + " " + overview).toLowerCase().includes(k));

const TopRatedPage = ({ API, recipeRatings, savedRecipes, trFilter, setTrFilter, fetchDetails, setRating, setPage, cardSx }) => {
  const [communityRatings, setCommunityRatings] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [trView, setTrView] = useState("community");

  useEffect(() => {
    setCommunityLoading(true);
    fetch(`${API}/top-rated`)
      .then(r => r.json())
      .then(data => setCommunityRatings(data.recipes || []))
      .catch(() => {})
      .finally(() => setCommunityLoading(false));
  }, [API]);

  const myRated = Object.keys(recipeRatings)
    .filter(t => recipeRatings[t] > 0)
    .map(title => {
      const saved = savedRecipes.find(r => r._title === title);
      return { title, rating: recipeRatings[title], overview: saved?.overview || "" };
    })
    .sort((a, b) => b.rating - a.rating);

  const baseList = trView === "community" ? communityRatings : myRated;
  const displayList = baseList.filter(r => {
    if (trFilter === "veg")    return isVegRecipe(r.title, r.overview || "");
    if (trFilter === "nonveg") return !isVegRecipe(r.title, r.overview || "");
    return true;
  });

  const totalRaters = communityRatings.reduce((sum, r) => sum + (r.totalRatings || 0), 0);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #f5f2ec 0%, #f0eedc 45%, #f5f2ea 100%)", position: "relative", overflow: "hidden" }}>
      <Box sx={{ position: "fixed", top: 60, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.13) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
      <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.25, backgroundImage: "radial-gradient(circle, #c49a3c 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

      {/* Header */}
      <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(125deg, #161410 0%, #1e2b1a 40%, #3a5c30 70%, #4a6e3a 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(135deg, #d4aa4a 0px, #d4aa4a 1px, transparent 1px, transparent 18px)" }} />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#d4aa4a", boxShadow: "0 0 6px #d4aa4a" }} />
            <Typography sx={{ color: "#e8d48a", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Fridgely Community</Typography>
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>⭐ Top Rated Recipes</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
            {trView === "community"
              ? `Rated by ${totalRaters} cook${totalRaters !== 1 ? "s" : ""} across the Fridgely community`
              : `${myRated.length} recipe${myRated.length !== 1 ? "s" : ""} rated by you`}
          </Typography>
        </Box>
      </Box>

      <Box p={4} maxWidth={980} mx="auto" sx={{ position: "relative", zIndex: 1 }}>
        {/* View toggle */}
        <Box display="flex" gap={1} mb={3} sx={{ background: "#fff", borderRadius: 3, p: 1, border: "1px solid #e8d48a", width: "fit-content" }}>
          {[
            { key: "community", label: "🌍 Community Picks", sublabel: `${communityRatings.length} recipes` },
            { key: "mine",      label: "⭐ My Ratings",       sublabel: `${myRated.length} rated` },
          ].map(opt => (
            <Box key={opt.key} onClick={() => setTrView(opt.key)} sx={{
              px: 2.5, py: 1, borderRadius: 2, cursor: "pointer",
              background: trView === opt.key ? "linear-gradient(135deg, #c49a3c, #a8822e)" : "transparent",
              transition: "all 0.18s",
            }}>
              <Typography sx={{ color: trView === opt.key ? "#fff" : "#374151", fontWeight: 800, fontSize: "0.82rem" }}>{opt.label}</Typography>
              <Typography sx={{ color: trView === opt.key ? "rgba(255,255,255,0.65)" : "#9ca3af", fontSize: "0.65rem", fontWeight: 600 }}>{opt.sublabel}</Typography>
            </Box>
          ))}
        </Box>

        {/* Veg filter */}
        <Box display="flex" gap={1} mb={3}>
          {[{ key: "all", label: "🍽️ All" }, { key: "veg", label: "🌱 Veg" }, { key: "nonveg", label: "🥩 Non-Veg" }].map(opt => (
            <Box key={opt.key} onClick={() => setTrFilter(opt.key)} sx={{
              px: 1.8, py: 0.7, borderRadius: 2, cursor: "pointer",
              background: trFilter === opt.key ? "#f0f4ec" : "#fff",
              border: `1.5px solid ${trFilter === opt.key ? "#6b8c5a" : "#e5e7eb"}`,
              color: trFilter === opt.key ? "#5a7a48" : "#6b7280",
              fontWeight: 700, fontSize: "0.78rem", transition: "all 0.15s",
            }}>{opt.label}</Box>
          ))}
        </Box>

        {/* Stats */}
        {trView === "community" && communityRatings.length > 0 && (
          <Grid container spacing={2} mb={3.5}>
            {[
              { label: "Recipes rated",  val: communityRatings.length, icon: "🍽️", color: "#b8714e", bg: "rgba(184,113,78,0.1)" },
              { label: "Total ratings",  val: totalRaters,              icon: "⭐", color: "#c49a3c", bg: "rgba(196,154,60,0.1)" },
              { label: "Avg community ★", val: communityRatings.length ? (communityRatings.reduce((s,r) => s + r.avgRating, 0) / communityRatings.length).toFixed(1) : "—", icon: "📊", color: "#6b8c5a", bg: "rgba(107,140,90,0.1)" },
              { label: "Top rated",      val: communityRatings[0]?.avgRating ? `${communityRatings[0].avgRating}★` : "—", icon: "🥇", color: "#eab308", bg: "rgba(234,179,8,0.1)" },
            ].map((s, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Box sx={{ background: s.bg, borderRadius: 3, p: 2, textAlign: "center", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <Typography sx={{ fontSize: "1.4rem", mb: 0.5 }}>{s.icon}</Typography>
                  <Typography sx={{ color: s.color, fontWeight: 900, fontSize: "1.4rem", lineHeight: 1.2, mb: 0.3 }}>{s.val}</Typography>
                  <Typography sx={{ color: "#6b7280", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {trView === "community" && communityLoading && (
          <Box display="flex" alignItems="center" gap={2} py={6} justifyContent="center">
            <CircularProgress size={22} sx={{ color: "#c49a3c" }} />
            <Typography color="text.secondary">Loading community ratings…</Typography>
          </Box>
        )}

        {!communityLoading && displayList.length === 0 && (
          <Box textAlign="center" py={10}>
            <Typography fontSize="3rem" mb={2}>{trView === "community" ? "🌍" : "⭐"}</Typography>
            <Typography fontWeight={700} fontSize="1rem" color="#374151" mb={1}>
              {trView === "community" ? "No community ratings yet" : "You haven't rated any recipes yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3} maxWidth={340} mx="auto">
              {trView === "community" ? "Be the first! Rate any recipe — it shows up here for everyone." : "Cook something, rate it, and it'll appear here."}
            </Typography>
            <Button variant="contained" onClick={() => setPage("recipes")}
              sx={{ background: "linear-gradient(135deg, #c49a3c, #a8822e)", borderRadius: 2, fontWeight: 700 }}>
              Find Something to Cook →
            </Button>
          </Box>
        )}

        {!communityLoading && displayList.length > 0 && (
          <Grid container spacing={2.5}>
            {displayList.map((r, i) => {
              const myRatingForThis = recipeRatings[r.title] || 0;
              const isSaved = savedRecipes.some(s => s._title === r.title);
              return (
                <Grid item xs={12} sm={6} md={4} key={r.title}>
                  <Card sx={{ ...cardSx, "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(245,158,11,0.18)", borderColor: "#e8d48a" } }}>
                    <Box onClick={() => fetchDetails(r.title)}>
                      <Box sx={{ position: "relative", height: 155, overflow: "hidden" }}>
                        <RecipeImage title={r.title} height={155} />
                        {i < 3 && (
                          <Box sx={{ position: "absolute", top: 10, left: 10, background: i === 0 ? "#c49a3c" : i === 1 ? "#9ca3af" : "#b45309", color: "#fff", borderRadius: "8px", px: 1.2, py: 0.4, fontSize: "0.7rem", fontWeight: 800 }}>
                            {i === 0 ? "🥇 #1" : i === 1 ? "🥈 #2" : "🥉 #3"}
                          </Box>
                        )}
                        {isSaved && (
                          <Box sx={{ position: "absolute", top: i < 3 ? 38 : 10, left: 10, background: "rgba(34,197,94,0.88)", borderRadius: "8px", px: 1, py: 0.25, fontSize: "0.62rem", fontWeight: 800, color: "#fff" }}>💾 Saved</Box>
                        )}
                        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }} />
                      </Box>
                      <CardContent sx={{ p: 2, pb: 1 }}>
                        <Typography fontWeight={800} fontSize="0.95rem" color="#1a1a1a" mb={0.5} lineHeight={1.3}>{r.title}</Typography>
                        {trView === "community" && (
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Box display="flex" gap={0.2}>
                              {[1,2,3,4,5].map(s => (
                                <Box key={s} sx={{ fontSize: "0.75rem", color: s <= Math.round(r.avgRating) ? "#c49a3c" : "#e5e7eb" }}>★</Box>
                              ))}
                            </Box>
                            <Typography sx={{ color: "#c49a3c", fontSize: "0.72rem", fontWeight: 800 }}>{r.avgRating}</Typography>
                            <Typography sx={{ color: "#9ca3af", fontSize: "0.68rem" }}>({r.totalRatings} rating{r.totalRatings !== 1 ? "s" : ""})</Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Box>
                    <Box px={2} pb={1.5} display="flex" alignItems="center" justifyContent="space-between" onClick={e => e.stopPropagation()}>
                      <Box>
                        <Typography sx={{ fontSize: "0.62rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.3 }}>Your rating</Typography>
                        <StarRating value={myRatingForThis} onChange={(v) => setRating(r.title, v)} size={16} />
                      </Box>
                      {myRatingForThis > 0 && (
                        <Box sx={{ background: "#fef9e7", border: "1px solid #e8d48a", borderRadius: 1.5, px: 1, py: 0.4 }}>
                          <Typography sx={{ color: "#c49a3c", fontWeight: 900, fontSize: "0.78rem" }}>{myRatingForThis}/5 ⭐</Typography>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

// ─── Landing Page ────────────────────────────────────────────────────────────
const FridgeLogo = ({ size = 44 }) => (
  <Box sx={{ width: size, height: size, borderRadius: Math.round(size * 0.23), background: "linear-gradient(145deg, #4a7a3a, #5a7c4a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(107,140,90,0.5)", flexShrink: 0 }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 20 20" fill="none">
      <rect x="4" y="2" width="12" height="16" rx="2" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
      <rect x="4" y="7.5" width="12" height="0.8" fill="rgba(255,255,255,0.4)"/>
      <rect x="6" y="4.5" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.7)"/>
      <rect x="6" y="10.5" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.7)"/>
      <circle cx="13.5" cy="13.5" r="1" fill="#86efac"/>
    </svg>
  </Box>
);

const LandingPage = ({ onSignIn, onSignUp }) => {
  const features = [
    { icon: "🧊", title: "Open your fridge", desc: "Tell us what's inside — even a half-empty fridge — and get real recipes instantly. No phantom ingredients, no store runs." },
    { icon: "📅", title: "Plan your whole week", desc: "Auto-generate 5-day meal plans from what's already in your kitchen. Breakfast, lunch, dinner, snacks — all covered." },
    { icon: "🗄️", title: "Track your pantry", desc: "Know exactly what you have and when you're running low. Get alerts before you run out of the essentials." },
    { icon: "⭐", title: "Community top picks", desc: "See what recipes other cooks love. Rate what you make, discover what everyone's cooking across Fridgely." },
  ];
  const stats = [
    { num: "Any", label: "Ingredients work" }, { num: "5", label: "Day meal plans" },
    { num: "12", label: "Cuisine styles" },    { num: "∞",   label: "Recipe ideas" },
  ];
  return (
    <Box sx={{ minHeight: "100vh", background: "#0d0f0a", color: "#fff" }}>
      {/* ── Navbar ── */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: 3, md: 6 }, py: 2, background: "rgba(13,15,10,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <FridgeLogo size={36} />
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.1 }}>Fridgely</Typography>
            <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)" }}>Cook what you've got.</Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box onClick={onSignIn} sx={{ px: 2.5, py: 1, borderRadius: "10px", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.9rem", transition: "all 0.18s", "&:hover": { color: "#fff", background: "rgba(255,255,255,0.07)" } }}>Sign In</Box>
          <Box onClick={onSignUp} sx={{ px: 3, py: 1, borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", color: "#fff", boxShadow: "0 4px 16px rgba(107,140,90,0.4)", transition: "all 0.18s", "&:hover": { transform: "translateY(-1px)", boxShadow: "0 8px 24px rgba(107,140,90,0.5)" } }}>Sign Up Free →</Box>
        </Box>
      </Box>

      {/* ── Hero ── */}
      <Box sx={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", pt: 10 }}>
        <Box component="img" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=80" alt="food" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) saturate(1.2)" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(13,15,10,0.92) 0%, rgba(13,15,10,0.6) 60%, transparent 100%)" }} />
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, #6b8c5a 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <Box sx={{ position: "relative", zIndex: 1, px: { xs: 4, md: 8, lg: 12 }, maxWidth: 1200, width: "100%" }}>
          <Grid container alignItems="center" spacing={6}>
            <Grid item xs={12} lg={6}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(107,140,90,0.15)", border: "1px solid rgba(107,140,90,0.35)", borderRadius: "100px", px: 2, py: 0.6, mb: 3 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "heroPulse 2s ease-in-out infinite", "@keyframes heroPulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } } }} />
                <Typography sx={{ color: "#a8c298", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>AI-Powered Kitchen Assistant</Typography>
              </Box>
              <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 900, fontSize: { xs: "2.8rem", md: "4rem", lg: "5rem" }, lineHeight: 1.0, letterSpacing: "-2px", color: "#fff", mb: 1.5, textShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
                Open your fridge.
                <Box component="span" sx={{ display: "block", background: "linear-gradient(90deg, #b8714e, #6b8c5a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>We'll handle it.</Box>
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: { xs: "1rem", md: "1.15rem" }, lineHeight: 1.7, maxWidth: 500, mb: 4 }}>
                Tell Fridgely what's in your kitchen — anything at all — and it finds real, creative recipes you can make right now. No grocery run. No wasted food.
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap" mb={5}>
                <Box onClick={onSignUp} sx={{ px: 4, py: 1.8, borderRadius: "12px", cursor: "pointer", background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", color: "#fff", fontWeight: 800, fontSize: "1rem", boxShadow: "0 8px 32px rgba(107,140,90,0.45)", transition: "all 0.2s", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 40px rgba(107,140,90,0.55)" } }}>What can I cook? →</Box>
                <Box onClick={onSignIn} sx={{ px: 4, py: 1.8, borderRadius: "12px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: "1rem", backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.06)", transition: "all 0.2s", "&:hover": { borderColor: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.12)" } }}>Sign in</Box>
              </Box>
              <Box display="flex" gap={4} flexWrap="wrap">
                {stats.map((s, i) => (
                  <Box key={i}>
                    <Typography sx={{ color: "#b8714e", fontWeight: 900, fontSize: "1.8rem", lineHeight: 1, fontFamily: "'Georgia', serif" }}>{s.num}</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", mt: 0.3 }}>{s.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box sx={{ position: "relative", height: 500, display: { xs: "none", lg: "block" } }}>
                {/* Card 1 */}
                <Box sx={{ position: "absolute", top: 0, left: 30, width: 212, borderRadius: "18px", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)", transform: "rotate(-5deg)", overflow: "hidden", transition: "transform 0.3s", "&:hover": { transform: "rotate(-2deg) translateY(-5px)" } }}>
                  <Box component="img" src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80" sx={{ width: "100%", height: 95, objectFit: "cover" }} />
                  <Box sx={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 0.5, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", borderRadius: "8px", px: 1, py: 0.35 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "lp 2s ease-in-out infinite", "@keyframes lp": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } }} />
                    <Typography sx={{ color: "#86efac", fontSize: "0.58rem", fontWeight: 800 }}>Ready to cook</Typography>
                  </Box>
                  <Box sx={{ px: 1.8, py: 1.3 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.42)", fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.4 }}>☀️ Breakfast · 3 ingredients</Typography>
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.86rem", mb: 0.4 }}>Fluffy Pancakes</Typography>
                    <Box display="flex" gap={0.7}>{["🟢 Easy","⏱ 12 min"].map((t,i)=><Box key={i} sx={{ background:"rgba(184,113,78,0.22)",border:"1px solid rgba(184,113,78,0.38)",borderRadius:"6px",px:0.9,py:0.25,fontSize:"0.6rem",fontWeight:700,color:"#c4b08a"}}>{t}</Box>)}</Box>
                  </Box>
                </Box>
                {/* Card 2 */}
                <Box sx={{ position: "absolute", top: 162, left: 98, width: 215, borderRadius: "18px", background: "rgba(255,255,255,0.09)", backdropFilter: "blur(22px)", border: "1px solid rgba(255,255,255,0.16)", boxShadow: "0 18px 50px rgba(0,0,0,0.5)", transform: "rotate(5deg)", overflow: "hidden", transition: "transform 0.3s", "&:hover": { transform: "rotate(2deg) translateY(-5px)" } }}>
                  <Box component="img" src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80" sx={{ width: "100%", height: 95, objectFit: "cover" }} />
                  <Box sx={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 0.5, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", borderRadius: "8px", px: 1, py: 0.35 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "lp 2s ease-in-out 0.4s infinite" }} />
                    <Typography sx={{ color: "#86efac", fontSize: "0.58rem", fontWeight: 800 }}>Ready to cook</Typography>
                  </Box>
                  <Box sx={{ px: 1.8, py: 1.3 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.42)", fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.4 }}>🌿 Lunch · 5 ingredients</Typography>
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.86rem", mb: 0.4 }}>Herb Garden Bowl</Typography>
                    <Box display="flex" gap={0.7}>{["🌱 Vegan","⚡ No-cook"].map((t,i)=><Box key={i} sx={{ background:i===0?"rgba(34,197,94,0.18)":"rgba(184,113,78,0.22)",border:`1px solid ${i===0?"rgba(34,197,94,0.3)":"rgba(184,113,78,0.38)"}`,borderRadius:"6px",px:0.9,py:0.25,fontSize:"0.6rem",fontWeight:700,color:i===0?"#86efac":"#c4b08a"}}>{t}</Box>)}</Box>
                  </Box>
                </Box>
                {/* Card 3 */}
                <Box sx={{ position: "absolute", top: 330, left: 40, width: 220, borderRadius: "20px", background: "rgba(255,255,255,0.13)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 24px 60px rgba(0,0,0,0.55)", transform: "rotate(-4deg)", overflow: "hidden", transition: "transform 0.3s", "&:hover": { transform: "rotate(-1deg) translateY(-5px)" } }}>
                  <Box component="img" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" sx={{ width: "100%", height: 95, objectFit: "cover" }} />
                  <Box sx={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 0.5, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", borderRadius: "8px", px: 1, py: 0.35 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "lp 2s ease-in-out 0.8s infinite" }} />
                    <Typography sx={{ color: "#86efac", fontSize: "0.58rem", fontWeight: 800 }}>Ready to cook</Typography>
                  </Box>
                  <Box sx={{ px: 2, py: 1.4 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.35 }}>🌙 Dinner · from your fridge</Typography>
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.9rem", mb: 0.4 }}>Golden Veggie Stir-Fry</Typography>
                    <Box display="flex" gap={0.7}>{["🟢 Easy","⚡ Quick"].map((t,i)=><Box key={i} sx={{ background:"rgba(184,113,78,0.25)",border:"1px solid rgba(184,113,78,0.4)",borderRadius:"6px",px:0.9,py:0.25,fontSize:"0.6rem",fontWeight:700,color:"#c4b08a"}}>{t}</Box>)}</Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* ── Features ── */}
      <Box sx={{ background: "#111410", px: { xs: 4, md: 8 }, py: 10 }}>
        <Box textAlign="center" mb={7}>
          <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", mb: 1.5 }}>How it works</Typography>
          <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1px" }}>Your kitchen has more in it than you think.</Typography>
        </Box>
        <Grid container spacing={3} maxWidth={1100} mx="auto">
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box sx={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", p: 3.5, height: "100%", transition: "all 0.22s", "&:hover": { background: "rgba(255,255,255,0.07)", borderColor: "rgba(107,140,90,0.3)", transform: "translateY(-4px)" } }}>
                <Typography sx={{ fontSize: "2rem", mb: 2 }}>{f.icon}</Typography>
                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1rem", mb: 1 }}>{f.title}</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", lineHeight: 1.7 }}>{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── CTA ── */}
      <Box sx={{ background: "linear-gradient(135deg, #1a2414 0%, #0d1a0a 100%)", px: { xs: 4, md: 8 }, py: 10, textAlign: "center" }}>
        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", mb: 2 }}>Get started — free forever</Typography>
        <Typography sx={{ fontFamily: "'Georgia', serif", color: "#fff", fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.8rem" }, letterSpacing: "-1px", mb: 1.5 }}>Ready to cook what you've got?</Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", mb: 4, maxWidth: 480, mx: "auto", lineHeight: 1.7 }}>Join thousands of home cooks who waste less and eat better — using whatever's already in their fridge.</Typography>
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Box onClick={onSignUp} sx={{ px: 5, py: 1.8, borderRadius: "12px", cursor: "pointer", background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", color: "#fff", fontWeight: 800, fontSize: "1rem", boxShadow: "0 8px 32px rgba(107,140,90,0.45)", transition: "all 0.2s", "&:hover": { transform: "translateY(-2px)" } }}>Create free account →</Box>
          <Box onClick={onSignIn} sx={{ px: 5, py: 1.8, borderRadius: "12px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "1rem", transition: "all 0.2s", "&:hover": { borderColor: "rgba(255,255,255,0.5)", color: "#fff" } }}>Sign in</Box>
        </Box>
      </Box>

      {/* ── Footer ── */}
      <Box sx={{ background: "#0a0c08", px: { xs: 4, md: 8 }, py: 4, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Box display="flex" alignItems="center" gap={1.2}>
          <FridgeLogo size={28} />
          <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>© 2026 Fridgely. Cook what you've got.</Typography>
        </Box>
        <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>Made with ❤️ for home cooks everywhere.</Typography>
      </Box>
    </Box>
  );
};

// ─── Auth Screen ─────────────────────────────────────────────────────────────
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Password rule checker
const PW_RULES = [
  { id: "len",     label: "At least 8 characters",       test: p => p.length >= 8 },
  { id: "upper",   label: "One uppercase letter (A–Z)",   test: p => /[A-Z]/.test(p) },
  { id: "lower",   label: "One lowercase letter (a–z)",   test: p => /[a-z]/.test(p) },
  { id: "number",  label: "One number (0–9)",             test: p => /\d/.test(p) },
  { id: "special", label: "One special character (!@#…)", test: p => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p) },
];

const AuthScreen = ({ onAuth, initialMode = "login", onBack }) => {
  // mode: "login" | "signup" | "forgot" | "forgot-sent"
  const [mode, setMode]           = useState(initialMode);
  const [name, setName]           = useState("");
  const [username, setUsername]   = useState("");
  const [email, setEmail]         = useState("");
  const [identifier, setIdentifier] = useState(""); // email OR username for login
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [unameStatus, setUnameStatus] = useState(null); // null | "checking" | "available" | "taken"
  const unameTimer = useRef(null);

  // Live username availability check
  const checkUsername = (val) => {
    clearTimeout(unameTimer.current);
    setUnameStatus(null);
    if (!val || val.length < 3) return;
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(val)) { setUnameStatus("invalid"); return; }
    setUnameStatus("checking");
    unameTimer.current = setTimeout(async () => {
      try {
        const r = await fetch(`${API_BASE}/auth/check-username?username=${encodeURIComponent(val)}`);
        const d = await r.json();
        setUnameStatus(d.available ? "available" : "taken");
      } catch { setUnameStatus(null); }
    }, 500);
  };

  const pwRulePassed = PW_RULES.map(r => r.test(password));
  const allRulesPassed = pwRulePassed.every(Boolean);
  const showRules = mode === "signup" && password.length > 0;

  const switchMode = (m) => { setMode(m); setError(""); setSuccess(""); setPassword(""); };

  const submit = async () => {
    setError(""); setSuccess("");

    if (mode === "forgot") {
      if (!email.trim()) return setError("Please enter your email address");
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        setMode("forgot-sent");
      } catch (err) { setError(err.message); }
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      if (!name.trim() || !username.trim() || !email.trim() || !password)
        return setError("Please fill in all fields");
      if (!allRulesPassed) return setError("Password does not meet all requirements");
      if (unameStatus === "taken")     return setError("Username is already taken");
      if (unameStatus === "invalid")   return setError("Username must be 3–20 chars: letters, numbers, underscores only");
    } else {
      if (!identifier.trim() || !password.trim()) return setError("Please fill in all fields");
    }

    setLoading(true);
    try {
      const body = mode === "signup"
        ? { name: name.trim(), username: username.trim(), email: email.trim(), password }
        : { identifier: identifier.trim(), password };

      const res = await fetch(`${API_BASE}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      localStorage.setItem("fridgely_token", data.token);
      onAuth(data.token, data.user, mode === "signup");
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  // Shared input style
  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff", fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.15s",
  };
  const labelStyle = {
    color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6,
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0d0f0a 0%, #141210 50%, #1a1e14 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      px: 2,
    }}>
      {/* Background accents */}
      <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", opacity: 0.04, backgroundImage: "radial-gradient(circle, #6b8c5a 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <Box sx={{ position: "fixed", top: "20%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(107,140,90,0.12) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

      <Box sx={{
        width: "100%", maxWidth: 440,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 4,
        p: { xs: 3.5, sm: 5 },
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        animation: "authIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        "@keyframes authIn": { from: { opacity: 0, transform: "translateY(20px) scale(0.96)" }, to: { opacity: 1, transform: "translateY(0) scale(1)" } },
      }}>
        {/* Back to landing */}
        {onBack && (
          <Box onClick={onBack} sx={{ display:"inline-flex",alignItems:"center",gap:0.5,color:"rgba(255,255,255,0.35)",fontSize:"0.8rem",cursor:"pointer",mb:2.5,"&:hover":{color:"rgba(255,255,255,0.7)"},transition:"color 0.2s" }}>← Back to home</Box>
        )}
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.5} mb={4}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2.5, background: "linear-gradient(145deg, #4a7a3a, #5a7c4a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(107,140,90,0.5)" }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="2" width="12" height="16" rx="2" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
              <rect x="4" y="7.5" width="12" height="0.8" fill="rgba(255,255,255,0.4)"/>
              <rect x="6" y="4.5" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.7)"/>
              <rect x="6" y="10.5" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.7)"/>
              <circle cx="13.5" cy="13.5" r="1" fill="#86efac"/>
            </svg>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: "1.3rem", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.1 }}>Fridgely</Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", lineHeight: 1 }}>Cook what you've got.</Typography>
          </Box>
        </Box>

        {/* ── FORGOT PASSWORD SENT ── */}
        {mode === "forgot-sent" && (
          <>
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography sx={{ fontSize: "3rem", mb: 2 }}>📬</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: "#fff", mb: 1 }}>Check your inbox</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.87rem", lineHeight: 1.7 }}>
                If an account exists for <strong style={{ color: "#a8c298" }}>{email}</strong>, you'll receive a password reset link shortly. The link expires in 1 hour.
              </Typography>
            </Box>
            <Box textAlign="center" mt={3}>
              <Box component="span" onClick={() => switchMode("login")} sx={{ color: "#a8c298", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem", "&:hover": { color: "#6b8c5a" } }}>
                ← Back to sign in
              </Box>
            </Box>
          </>
        )}

        {/* ── FORGOT PASSWORD FORM ── */}
        {mode === "forgot" && (
          <>
            <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: "#fff", mb: 0.5 }}>Reset password</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", mb: 3.5 }}>
              Enter your account email and we'll send you a reset link.
            </Typography>

            <Box mb={3}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                onKeyDown={e => e.key === "Enter" && submit()}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#6b8c5a"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
            </Box>

            {error && (
              <Box mb={2} px={2} py={1} sx={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 2 }}>
                <Typography sx={{ color: "#fca5a5", fontSize: "0.82rem", fontWeight: 600 }}>⚠ {error}</Typography>
              </Box>
            )}

            <Box onClick={!loading ? submit : undefined} sx={{ width: "100%", py: 1.6, borderRadius: "12px", cursor: loading ? "not-allowed" : "pointer", background: loading ? "rgba(107,140,90,0.4)" : "linear-gradient(135deg, #5a7c4a, #4a6a3a)", boxShadow: loading ? "none" : "0 8px 28px rgba(107,140,90,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 3 }}>
              {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.95rem" }}>Send reset link →</Typography>}
            </Box>

            <Box textAlign="center">
              <Box component="span" onClick={() => switchMode("login")} sx={{ color: "#a8c298", fontWeight: 700, cursor: "pointer", fontSize: "0.84rem", "&:hover": { color: "#6b8c5a" } }}>
                ← Back to sign in
              </Box>
            </Box>
          </>
        )}

        {/* ── LOGIN / SIGNUP ── */}
        {(mode === "login" || mode === "signup") && (
          <>
            <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: "#fff", mb: 0.5 }}>
              {mode === "login" ? "Welcome back 👋" : "Create your account"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", mb: 3.5 }}>
              {mode === "login" ? "Sign in to access your pantry and saved recipes." : "Your kitchen, your history — all in one place."}
            </Typography>

            {/* Name (signup only) */}
            {mode === "signup" && (
              <Box mb={2}>
                <label style={labelStyle}>Your name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Hemanth" onKeyDown={e => e.key === "Enter" && submit()} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#6b8c5a"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
              </Box>
            )}

            {/* Username (signup only) */}
            {mode === "signup" && (
              <Box mb={2}>
                <label style={labelStyle}>Username</label>
                <Box sx={{ position: "relative" }}>
                  <input
                    value={username}
                    onChange={e => { setUsername(e.target.value); checkUsername(e.target.value); }}
                    placeholder="e.g. chef_hemanth"
                    onKeyDown={e => e.key === "Enter" && submit()}
                    style={{ ...inputStyle, paddingRight: 38 }}
                    onFocus={e => e.target.style.borderColor = "#6b8c5a"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                  />
                  {/* Status indicator */}
                  <Box sx={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.78rem", fontWeight: 700 }}>
                    {unameStatus === "checking"  && <CircularProgress size={13} sx={{ color: "#6b7280" }} />}
                    {unameStatus === "available" && <span style={{ color: "#22c55e" }}>✓</span>}
                    {unameStatus === "taken"     && <span style={{ color: "#f87171" }}>✗</span>}
                    {unameStatus === "invalid"   && <span style={{ color: "#f87171" }}>!</span>}
                  </Box>
                </Box>
                {unameStatus === "taken"     && <Typography sx={{ color: "#f87171", fontSize: "0.73rem", mt: 0.5 }}>Username already taken</Typography>}
                {unameStatus === "available" && <Typography sx={{ color: "#22c55e", fontSize: "0.73rem", mt: 0.5 }}>Username available!</Typography>}
                {unameStatus === "invalid"   && <Typography sx={{ color: "#f87171", fontSize: "0.73rem", mt: 0.5 }}>3–20 chars, letters/numbers/underscores only</Typography>}
              </Box>
            )}

            {/* Email / identifier */}
            <Box mb={2}>
              <label style={labelStyle}>{mode === "login" ? "Email or Username" : "Email"}</label>
              <input
                type={mode === "login" ? "text" : "email"}
                value={mode === "login" ? identifier : email}
                onChange={e => mode === "login" ? setIdentifier(e.target.value) : setEmail(e.target.value)}
                placeholder={mode === "login" ? "you@example.com or your_username" : "you@example.com"}
                onKeyDown={e => e.key === "Enter" && submit()}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#6b8c5a"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
            </Box>

            {/* Password */}
            <Box mb={mode === "signup" ? 1 : 3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.8}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                {mode === "login" && (
                  <Box component="span" onClick={() => switchMode("forgot")} sx={{ color: "#a8c298", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", "&:hover": { color: "#6b8c5a" } }}>
                    Forgot password?
                  </Box>
                )}
              </Box>
              <Box sx={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Create a strong password" : "Your password"}
                  onKeyDown={e => e.key === "Enter" && submit()}
                  style={{ ...inputStyle, paddingRight: 54 }}
                  onFocus={e => e.target.style.borderColor = "#6b8c5a"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                />
                <Box onClick={() => setShowPass(p => !p)} sx={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", "&:hover": { color: "rgba(255,255,255,0.7)" } }}>
                  {showPass ? "Hide" : "Show"}
                </Box>
              </Box>
            </Box>

            {/* Password rules (signup only, shown once user starts typing) */}
            {showRules && (
              <Box mb={3} p={1.5} sx={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2 }}>
                {PW_RULES.map((rule, i) => (
                  <Box key={rule.id} display="flex" alignItems="center" gap={1} mb={i < PW_RULES.length - 1 ? 0.6 : 0}>
                    <Box sx={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 900, background: pwRulePassed[i] ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)", color: pwRulePassed[i] ? "#22c55e" : "#6b7280", border: `1px solid ${pwRulePassed[i] ? "#22c55e" : "rgba(255,255,255,0.1)"}` }}>
                      {pwRulePassed[i] ? "✓" : "·"}
                    </Box>
                    <Typography sx={{ fontSize: "0.75rem", color: pwRulePassed[i] ? "#86efac" : "rgba(255,255,255,0.35)", fontWeight: pwRulePassed[i] ? 600 : 400, transition: "color 0.2s" }}>
                      {rule.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Error */}
            {error && (
              <Box mb={2} px={2} py={1} sx={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 2 }}>
                <Typography sx={{ color: "#fca5a5", fontSize: "0.82rem", fontWeight: 600 }}>⚠ {error}</Typography>
              </Box>
            )}

            {/* Submit */}
            <Box onClick={!loading ? submit : undefined} sx={{ width: "100%", py: 1.6, borderRadius: "12px", cursor: loading ? "not-allowed" : "pointer", background: loading ? "rgba(107,140,90,0.4)" : "linear-gradient(135deg, #5a7c4a, #4a6a3a)", boxShadow: loading ? "none" : "0 8px 28px rgba(107,140,90,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, transition: "all 0.2s", "&:hover": !loading ? { transform: "translateY(-1px)", boxShadow: "0 12px 36px rgba(107,140,90,0.5)" } : {}, mb: 3 }}>
              {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.95rem" }}>{mode === "login" ? "Sign in to Fridgely →" : "Create account →"}</Typography>}
            </Box>

            {/* Toggle login ↔ signup */}
            <Box textAlign="center">
              <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem" }}>
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <Box component="span" onClick={() => switchMode(mode === "login" ? "signup" : "login")} sx={{ color: "#a8c298", fontWeight: 700, cursor: "pointer", "&:hover": { color: "#6b8c5a" } }}>
                  {mode === "login" ? "Sign up free" : "Sign in"}
                </Box>
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [page, setPage] = useState("home");

  // ── Toast system ──
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = "success") => {
    const id = ++_toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // ── Auth ──
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("fridgely_token") || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState("landing"); // "landing" | "login" | "signup"

  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  }), [authToken]);

  const apiFetch = useCallback((path, opts = {}) =>
    fetch(`${API}${path}`, { ...opts, headers: { ...authHeaders(), ...(opts.headers || {}) } }),
  [API, authHeaders]);

  const hydrateFromUser = useCallback((u) => {
    if (u.pantryItems?.length)   setPantryItems(u.pantryItems);
    if (u.savedRecipes?.length)  setSavedRecipes(u.savedRecipes);
    if (u.groceryList?.length)   setGroceryList(u.groceryList);
    if (u.recipeHistory?.length) setRecipeHistory(u.recipeHistory);
    if (u.recipeRatings && Object.keys(u.recipeRatings).length) setRecipeRatings(u.recipeRatings);
    if (u.recipeNotes  && Object.keys(u.recipeNotes).length)   setRecipeNotes(u.recipeNotes);
    if (u.language)              setLanguage(u.language);
  }, []); // eslint-disable-line

  const handleAuth = useCallback((token, user, isNew = false) => {
    setAuthToken(token);
    setCurrentUser(user);
    hydrateFromUser(user);
    setAuthLoading(false);
    if (isNew) {
      localStorage.removeItem("onboardingDone");
      setShowOnboarding(true);
    }
  }, [hydrateFromUser]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("fridgely_token");
    setAuthToken(null); setCurrentUser(null);
    setPantryItems([]); setSavedRecipes([]); setGroceryList([]);
    setRecipeHistory([]); setRecipeRatings({}); setRecipeNotes({});
    showToast("Signed out — see you soon! 👋", "success");
  }, [showToast]);

  // Verify token on mount
  useEffect(() => {
    if (!authToken) { setAuthLoading(false); return; }
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${authToken}` } })
      .then(r => r.json())
      .then(data => {
        if (data.user) { setCurrentUser(data.user); hydrateFromUser(data.user); }
        else { localStorage.removeItem("fridgely_token"); setAuthToken(null); }
      })
      .catch(() => { localStorage.removeItem("fridgely_token"); setAuthToken(null); })
      .finally(() => setAuthLoading(false));
  }, []); // eslint-disable-line

  // Track page activity
  useEffect(() => {
    if (!authToken || !page) return;
    apiFetch("/user/activity", { method: "POST", body: JSON.stringify({ page }) }).catch(() => {});
  }, [page, authToken]); // eslint-disable-line

  // ── Language ──
  const [language, setLanguage] = useState(() => localStorage.getItem("cm_lang") || "English");
  useEffect(() => {
    localStorage.setItem("cm_lang", language);
    setRecipeCache({}); // clear cached details so they re-fetch in new language
  }, [language]);

  // ── Recipe Generator state ──
  const [inputName, setInputName] = useState("");
  const [inputQty, setInputQty] = useState("");
  const [inputUnit, setInputUnit] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [activeFoodTypes, setActiveFoodTypes] = useState([]);
  const [activeDiet, setActiveDiet] = useState([]);
  const [activeDifficulty, setActiveDifficulty] = useState(null);
  const [activeCuisine, setActiveCuisine] = useState([]);
  const [recipes, setRecipes] = useState({ strict: [], flexible: [] });
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ── Recipe by Name state ──
  const [recipeNameInput, setRecipeNameInput] = useState("");
  const [recipeByName, setRecipeByName] = useState(null);
  const [recipeByNameLoading, setRecipeByNameLoading] = useState(false);

  // ── Recipe Generator tab state ──
  const [recipeTab, setRecipeTab] = useState(0);

  // ── Nutrition-based recipe state ──
  const [nutritionTargets, setNutritionTargets] = useState({ calories: "", protein: "", carbs: "", fat: "", fiber: "" });
  const [nutritionRecipes, setNutritionRecipes] = useState([]);
  const [nutritionLoading, setNutritionLoading] = useState(false);

  // ── Recipe History (recently viewed) ──
  const [recipeHistory, setRecipeHistory] = useState(() =>
    JSON.parse(localStorage.getItem("recipeHistory") || "[]")
  );
  const [historyOpen, setHistoryOpen] = useState(false);

  // ── Calorie Budget Planner ──
  const [calorieBudget, setCalorieBudget] = useState("");
  const [budgetEnabled, setBudgetEnabled] = useState(false);

  // ── Meal Swap ──
  const [swapping, setSwapping] = useState({}); // { "Monday-Breakfast": true }

  // ── Meal Planner state ──
  const [mpTab, setMpTab] = useState(0);

  // Tab 1: user picks specific pantry items by checkbox
  const [mpSelectedPantryIdxs, setMpSelectedPantryIdxs] = useState([]);
  const [mpPantryFoodTypes, setMpPantryFoodTypes] = useState([]);
  const [mpPantryDiet, setMpPantryDiet] = useState([]);
  const [mpPantryDifficulty, setMpPantryDifficulty] = useState(null);
  const [mpPantryCuisine, setMpPantryCuisine] = useState([]);
  const [mpPantryPlan, setMpPantryPlan] = useState([]);
  const [mpPantryLoading, setMpPantryLoading] = useState(false);

  // Tab 2: uses all in-stock pantry items automatically
  const [mpGroceryFoodTypes, setMpGroceryFoodTypes] = useState([]);
  const [mpGroceryDiet, setMpGroceryDiet] = useState([]);
  const [mpGroceryDifficulty, setMpGroceryDifficulty] = useState(null);
  const [mpGroceryCuisine, setMpGroceryCuisine] = useState([]);
  const [mpGroceryPlan, setMpGroceryPlan] = useState([]);
  const [mpGroceryLoading, setMpGroceryLoading] = useState(false);

  // ── Recipe detail modal ──
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [recipeCache, setRecipeCache] = useState({});
  const [servingMultiplier, setServingMultiplier] = useState(1);

  // ── Cook mode ──
  const [cookModeOpen, setCookModeOpen] = useState(false);

  // ── Substitution modal ──
  const [subModal, setSubModal] = useState({ open: false, ingredient: null });

  // ── Shopping list ──
  const [shoppingList, setShoppingList] = useState({ open: false, items: [], title: "" });

  // ── Persistent Grocery List ──
  const [groceryList, setGroceryList] = useState(() =>
    JSON.parse(localStorage.getItem("groceryList") || "[]")
  );
  const [groceryListOpen, setGroceryListOpen] = useState(false);

  // ── Saved recipes ──
  const [savedRecipes, setSavedRecipes] = useState(() =>
    JSON.parse(localStorage.getItem("savedRecipes") || "[]")
  );
  const [savedSearch, setSavedSearch] = useState("");
  const [savedVegFilter, setSavedVegFilter] = useState("all");

  // ── Recipe ratings & notes ──
  const [recipeRatings, setRecipeRatings] = useState(() =>
    JSON.parse(localStorage.getItem("recipeRatings") || "{}")
  );
  const [recipeNotes, setRecipeNotes] = useState(() =>
    JSON.parse(localStorage.getItem("recipeNotes") || "{}")
  );
  const [editingNote, setEditingNote] = useState(null);

  // ── Pantry ──
  const [pantryItems, setPantryItems] = useState(() =>
    JSON.parse(localStorage.getItem("pantryItems") || "[]")
  );
  const [pantryInputName, setPantryInputName] = useState("");
  const [pantryInputQty, setPantryInputQty] = useState("");
  const [pantryInputUnit, setPantryInputUnit] = useState("");

  // ── Low-stock notifications ──
  // Names of items the user has dismissed — resets on page refresh (intentional)
  const [dismissedLowStock, setDismissedLowStock] = useState(new Set());
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState({ show: false, tab: "" });
  // Track which items we've already shown an auto-toast for (avoid repeat toasts)
  const notifToastedRef = React.useRef(new Set());
  const syncTimeout = React.useRef({});

  // ── Chef Chat widget ──
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hey! I'm Fridgely 🧊 Tell me what's in your kitchen right now — even a handful of things — and I'll find something genuinely good to cook." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = React.useRef(null);

  const sendChatMessage = useCallback(async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    const userMsg = { role: "user", content: text };
    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          pantry: pantryItems,
          savedRecipeNames: savedRecipes.map(r => r._title).filter(Boolean),
          language,
        }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: "assistant", content: data.reply || "Sorry, I couldn't respond right now." }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting — try again in a moment." }]);
    }
    setChatLoading(false);
  }, [chatInput, chatMessages, chatLoading, pantryItems, savedRecipes, language]);

  useEffect(() => {
    if (chatOpen) setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  }, [chatMessages, chatOpen]);

  // ── Onboarding ──
  const [showOnboarding, setShowOnboarding] = useState(false);

  // ── Top Rated filter ──
  const [trFilter, setTrFilter] = useState("all");

  // ── Sidebar ──
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const SIDEBAR_W = 240;
  const SIDEBAR_COLLAPSED_W = 64;

  // ── Persistence ──
  useEffect(() => {
    const saved = localStorage.getItem("ingredients");
    if (saved) setIngredients(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
  }, [ingredients]);
  useEffect(() => {
    localStorage.setItem("pantryItems", JSON.stringify(pantryItems));
  }, [pantryItems]);
  useEffect(() => {
    localStorage.setItem("recipeRatings", JSON.stringify(recipeRatings));
  }, [recipeRatings]);
  useEffect(() => {
    localStorage.setItem("recipeNotes", JSON.stringify(recipeNotes));
  }, [recipeNotes]);
  useEffect(() => {
    localStorage.setItem("recipeHistory", JSON.stringify(recipeHistory));
  }, [recipeHistory]);
  useEffect(() => {
    localStorage.setItem("groceryList", JSON.stringify(groceryList));
  }, [groceryList]);

  // ── DB Sync Effects (debounced, only when logged in) ──
  const dbSync = useCallback((key, path, body) => {
    if (!authToken) return;
    clearTimeout(syncTimeout.current[key]);
    syncTimeout.current[key] = setTimeout(() => {
      apiFetch(path, { method: "PUT", body: JSON.stringify(body) }).catch(() => {});
    }, 800);
  }, [authToken, apiFetch]);

  useEffect(() => { dbSync("pantry",   "/user/pantry",        { pantryItems });   }, [pantryItems]);   // eslint-disable-line
  useEffect(() => { dbSync("saved",    "/user/saved-recipes", { savedRecipes });  }, [savedRecipes]);  // eslint-disable-line
  useEffect(() => { dbSync("grocery",  "/user/grocery",       { groceryList });   }, [groceryList]);   // eslint-disable-line
  useEffect(() => { dbSync("history",  "/user/history",       { recipeHistory }); }, [recipeHistory]); // eslint-disable-line
  useEffect(() => { dbSync("notes",    "/user/notes",         { recipeNotes });   }, [recipeNotes]);   // eslint-disable-line
  useEffect(() => {
    if (authToken && language) apiFetch("/user/language", { method: "PUT", body: JSON.stringify({ language }) }).catch(() => {});
  }, [language]); // eslint-disable-line

  // ── Low-stock: computed items + auto-toast when qty drops low ──
  const lowStockItems = React.useMemo(
    () => pantryItems.filter(item => getLowStockStatus(item) && !dismissedLowStock.has(item.name)),
    [pantryItems, dismissedLowStock]
  );

  // Fire a brief toast (once per item per session) when quantity dips below threshold
  useEffect(() => {
    lowStockItems.forEach(item => {
      if (!notifToastedRef.current.has(item.name)) {
        notifToastedRef.current.add(item.name);
        const qtyStr = [item.qty, item.unit].filter(Boolean).join(" ");
        showToast(`⚠️ ${item.name} is running low (${qtyStr})`, "info");
      }
    });
    // If an item recovers (restocked), remove it from the toasted set so it can fire again later
    const lowNames = new Set(lowStockItems.map(i => i.name));
    notifToastedRef.current.forEach(name => {
      if (!lowNames.has(name)) notifToastedRef.current.delete(name);
    });
  }, [lowStockItems, showToast]);

  // ── Helpers ──
  const addIngredient = useCallback(() => {
    if (!inputName.trim()) return;
    setIngredients(prev => [...prev, { name: inputName.trim(), qty: inputQty.trim(), unit: inputUnit }]);
    setInputName(""); setInputQty(""); setInputUnit("");
  }, [inputName, inputQty, inputUnit]);

  const toggleArr = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const totalFilters = activeFoodTypes.length + activeDiet.length + (activeDifficulty ? 1 : 0) + activeCuisine.length;

  const scaleQty = (quantityStr, mult) => {
    if (!quantityStr || mult === 1) return quantityStr;
    const match = quantityStr.match(/^([\d./]+)/);
    if (!match) return quantityStr;
    const num = eval(match[1]);
    const scaled = Math.round(num * mult * 4) / 4;
    return quantityStr.replace(match[1], scaled % 1 === 0 ? scaled : scaled.toString());
  };

  // ── Recipe Generator ──
  const generateRecipes = async () => {
    if (!ingredients.length) return showToast("Add at least one ingredient first", "error");
    setRecipeLoading(true);
    try {
      const res = await axios.post(`${API}/generate-recipes`, {
        ingredients,
        filters: { cuisine: activeCuisine, foodTypes: activeFoodTypes, diet: activeDiet, difficulty: activeDifficulty },
        language,
      });
      setRecipes(res.data);
      setTimeout(() => document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch { showToast("Error generating recipes", "error"); }
    setRecipeLoading(false);
  };

  // ── Generate by name ──
  const generateByName = async () => {
    if (!recipeNameInput.trim()) return showToast("Enter a recipe name first", "error");
    setRecipeByNameLoading(true); setRecipeByName(null);
    try {
      const res = await axios.post(`${API}/generate-by-name`, {
        recipeName: recipeNameInput.trim(),
        filters: { cuisine: activeCuisine, foodTypes: activeFoodTypes, diet: activeDiet, difficulty: activeDifficulty },
        language,
      });
      setRecipeByName(res.data);
      setTimeout(() => document.getElementById("byname-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch { showToast("Error generating recipe", "error"); }
    setRecipeByNameLoading(false);
  };

  const generateByNutrition = async () => {
    const { calories, protein, carbs, fat, fiber } = nutritionTargets;
    if (!calories && !protein && !carbs && !fat && !fiber) return showToast("Enter at least one nutrition target", "error");
    setNutritionLoading(true); setNutritionRecipes([]);
    try {
      const res = await axios.post(`${API}/generate-by-nutrition`, {
        targets: nutritionTargets,
        filters: { cuisine: activeCuisine, foodTypes: activeFoodTypes, diet: activeDiet, difficulty: activeDifficulty },
        language,
      });
      setNutritionRecipes(res.data.recipes || []);
      setTimeout(() => document.getElementById("nutrition-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch { showToast("Error generating nutrition-based recipes", "error"); }
    setNutritionLoading(false);
  };

  const swapMeal = async (plan, setPlan, day, mealType, filters, ingredients = []) => {
    const key = `${day}-${mealType}`;
    setSwapping(prev => ({ ...prev, [key]: true }));
    const currentMeal = plan.find(d => d.day === day)?.meals?.[mealType]?.name || "";
    try {
      const res = await axios.post(`${API}/swap-meal`, {
        day, mealType, currentMeal, ingredients, filters, language,
      });
      const { name, note } = res.data;
      setPlan(prev => prev.map(d =>
        d.day !== day ? d : {
          ...d,
          meals: { ...d.meals, [mealType]: { name, note } },
        }
      ));
      showToast(`Swapped ${mealType} on ${day} → ${name}`, "success");
    } catch { showToast("Swap failed — try again", "error"); }
    setSwapping(prev => ({ ...prev, [key]: false }));
  };

  const generatePantryPlan = async () => {
    const selectedItems = mpSelectedPantryIdxs.map(idx => pantryItems[idx]).filter(Boolean);
    if (!selectedItems.length) return showToast("Select at least one pantry item to cook with", "error");
    setMpPantryLoading(true);
    try {
      const res = await axios.post(`${API}/generate-meal-plan`, {
        ingredients: selectedItems,
        filters: { cuisine: mpPantryCuisine, foodTypes: mpPantryFoodTypes, diet: mpPantryDiet, difficulty: mpPantryDifficulty },
        mode: "pantry",
        language,
      });
      setMpPantryPlan(res.data.plan);
      setTimeout(() => document.getElementById("pantry-plan-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch { showToast("Error generating pantry meal plan", "error"); }
    setMpPantryLoading(false);
  };

  const generateGroceryPlan = async () => {
    const inStockItems = pantryItems.filter(i => i.inStock);
    if (!inStockItems.length) return showToast("Your pantry is empty — add items in My Pantry first", "error");
    setMpGroceryLoading(true);
    try {
      const res = await axios.post(`${API}/generate-meal-plan`, {
        ingredients: inStockItems,
        filters: { cuisine: mpGroceryCuisine, foodTypes: mpGroceryFoodTypes, diet: mpGroceryDiet, difficulty: mpGroceryDifficulty },
        mode: "pantry",
        language,
      });
      setMpGroceryPlan(res.data.plan);
      setTimeout(() => document.getElementById("grocery-plan-anchor")?.scrollIntoView({ behavior: "smooth" }), 150);
    } catch { showToast("Error generating full pantry meal plan", "error"); }
    setMpGroceryLoading(false);
  };

  // ── Recipe details ──
  const fetchDetails = async (title) => {
    setOpen(true); setServingMultiplier(1);
    // Track in history — increment viewCount if already seen, expire after 30 days, cap at 30
    setRecipeHistory(prev => {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const existing = prev.find(h => h.title === title);
      const entry = {
        title,
        viewedAt: new Date().toISOString(),
        viewCount: existing ? (existing.viewCount || 1) + 1 : 1,
        firstViewedAt: existing?.firstViewedAt || new Date().toISOString(),
      };
      return [entry, ...prev.filter(h => h.title !== title)]
        .filter(h => new Date(h.viewedAt).getTime() > thirtyDaysAgo)
        .slice(0, 30);
    });
    if (recipeCache[title]) { setDetails(recipeCache[title]); return; }
    setDetails(null); setDetailsLoading(true);
    try {
      const res = await axios.post(`${API}/recipe-details`, { recipeName: title, language });
      const enriched = { ...res.data, _title: title };
      setRecipeCache(prev => ({ ...prev, [title]: enriched }));
      setDetails(enriched);
    } catch { showToast("Failed to load details", "error"); }
    setDetailsLoading(false);
  };

  const saveRecipe = () => {
    if (!details) return;
    if (savedRecipes.find(r => r._title === details._title)) {
      showToast("Already saved!", "error"); return;
    }
    const updated = [...savedRecipes, details];
    setSavedRecipes(updated);
    localStorage.setItem("savedRecipes", JSON.stringify(updated));
    showToast(`"${details._title}" saved to your cookbook! 📖`, "success");
  };

  const deleteRecipe = (index) => {
    const updated = savedRecipes.filter((_, i) => i !== index);
    setSavedRecipes(updated);
    localStorage.setItem("savedRecipes", JSON.stringify(updated));
    showToast("Recipe removed", "success");
  };

  const setRating = useCallback((title, rating) => {
    setRecipeRatings(prev => ({ ...prev, [title]: rating }));
    if (authToken) {
      apiFetch("/user/rating", { method: "POST", body: JSON.stringify({ recipe: title, rating }) }).catch(() => {});
    }
  }, [authToken, apiFetch]);

  const saveNote = (title, note) => {
    setRecipeNotes(prev => ({ ...prev, [title]: note }));
    setEditingNote(null);
    showToast("Note saved!", "success");
  };

  // ── Pantry handlers ──
  const addPantryItem = () => {
    if (!pantryInputName.trim()) return;
    setPantryItems(prev => [...prev, {
      name: pantryInputName.trim(), qty: pantryInputQty.trim(),
      unit: pantryInputUnit, inStock: true,
    }]);
    setPantryInputName(""); setPantryInputQty(""); setPantryInputUnit("");
  };

  const togglePantryItem = (idx) => {
    setPantryItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, inStock: !item.inStock } : item
    ));
  };

  const removePantryItem = (idx) => {
    setPantryItems(prev => prev.filter((_, i) => i !== idx));
  };

  const updatePantryQty = (idx, delta) => {
    setPantryItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const currentQty = parseFloat(item.qty) || 0;
      const newQty = Math.max(0, Math.round((currentQty + delta) * 100) / 100);
      return { ...item, qty: newQty === 0 ? "0" : String(newQty), inStock: newQty > 0 };
    }));
    if (delta < 0) showToast("Quantity updated — 1 consumed 🍽️", "info");
  };

  const setPantryQtyDirect = (idx, value) => {
    setPantryItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const newQty = Math.max(0, parseFloat(value) || 0);
      return { ...item, qty: String(newQty), inStock: newQty > 0 };
    }));
  };

  const importPantryToGenerator = () => {
    const inStock = pantryItems.filter(i => i.inStock);
    setIngredients(inStock);
    setPage("recipes");
    showToast(`${inStock.length} pantry items imported to Recipe Generator`, "success");
  };
const exportMealPlanPDF = (plan, title = "Weekly Meal Plan") => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // ── Header bar ──
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageW, 22, "F");
  doc.setFillColor(210, 38, 38);
  doc.roundedRect(10, 4, 14, 14, 3, 3, "F");
  // Logo text instead of emoji
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("CM", 17, 13, { align: "center" });
  doc.setFontSize(14);
  doc.text("Fridgely", 27, 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Cook what you've got.", 27, 16);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(title, pageW - 12, 10, { align: "right" });
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${today}`, pageW - 12, 17, { align: "right" });

  // ── Build table ──
  const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const MEAL_COLORS = {
    Breakfast: { fill: [255, 247, 237], text: [194, 65, 12] },
    Lunch:     { fill: [240, 253, 244], text: [21, 128, 61] },
    Dinner:    { fill: [239, 246, 255], text: [29, 78, 216] },
    Snack:     { fill: [253, 244, 255], text: [126, 34, 206] },
  };
  const DAY_COLORS_PDF = {
    Monday:    [249, 115, 22],
    Tuesday:   [168, 85, 247],
    Wednesday: [59, 130, 246],
    Thursday:  [34, 197, 94],
    Friday:    [239, 68, 68],
  };
  const days = plan.map(d => d.day);

  const tableBody = MEAL_TYPES.map(meal => {
    const mc = MEAL_COLORS[meal];
    const row = [{
      content: meal,
      styles: {
        fontStyle: "bold", fontSize: 8.5,
        fillColor: mc.fill, textColor: mc.text,
        halign: "center", valign: "middle",
      },
    }];
    days.forEach(day => {
      const entry = plan.find(d => d.day === day)?.meals?.[meal];
      const name  = entry?.name || "—";
      const note  = entry?.note || "";
      // Put name on first line bold-ish, note on second line smaller
      // We use \n to separate; willDrawCell will handle styling
      row.push({
        content: note ? `${name}\n${note}` : name,
        styles: {
          fontSize: 8, valign: "top", cellPadding: { top: 3, left: 3, right: 3, bottom: 3 },
          textColor: [30, 30, 30], fillColor: [255, 255, 255],
          overflow: "linebreak",
        },
      });
    });
    return row;
  });

  const headRow = [
    { content: "Meal", styles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], halign: "center", fontStyle: "bold", fontSize: 9 } },
    ...days.map(day => ({
      content: day,
      styles: { fillColor: DAY_COLORS_PDF[day] || [100, 100, 100], textColor: [255, 255, 255], halign: "center", fontStyle: "bold", fontSize: 9 },
    })),
  ];

  const usableW  = pageW - 20;
  const mealColW = 24;
  const dayColW  = (usableW - mealColW) / days.length;
  const colWidths = [mealColW, ...days.map(() => dayColW)];

  autoTable(doc, {
    startY: 26,
    head: [headRow],
    body: tableBody,
    columnStyles: colWidths.reduce((acc, w, i) => { acc[i] = { cellWidth: w }; return acc; }, {}),
    styles: {
      lineColor: [220, 220, 220],
      lineWidth: 0.25,
      font: "helvetica",
      cellPadding: 3,
      minCellHeight: 20,
      overflow: "linebreak",
    },
    headStyles: { minCellHeight: 11 },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: 10, right: 10 },
    tableLineColor: [200, 200, 200],
    tableLineWidth: 0.35,
    // Use willDrawCell to render name bold + note grey without double-drawing
    willDrawCell: (data) => {
      if (data.section !== "body" || data.column.index === 0) return;
      const entry = plan.find(d => d.day === days[data.column.index - 1])?.meals?.[MEAL_TYPES[data.row.index]];
      if (!entry?.name || !entry?.note) return;
      // Override the cell content to empty so autoTable draws nothing,
      // then we draw manually below in didDrawCell
      data.cell.text = [];
    },
    didDrawCell: (data) => {
      if (data.section !== "body" || data.column.index === 0) return;
      const entry = plan.find(d => d.day === days[data.column.index - 1])?.meals?.[MEAL_TYPES[data.row.index]];
      if (!entry?.name || !entry?.note) return;
      // Now draw name (bold) and note (grey) cleanly
      const x = data.cell.x + 3;
      const maxW = data.cell.width - 6;
      let cy = data.cell.y + 7;
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      const nameLines = doc.splitTextToSize(entry.name, maxW);
      doc.text(nameLines, x, cy);
      cy += nameLines.length * 4.5 + 1.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      const noteLines = doc.splitTextToSize(entry.note, maxW);
      doc.text(noteLines, x, cy);
    },
  });

  // ── Footer ──
  const finalY = doc.lastAutoTable.finalY || pageH - 20;
  if (finalY < pageH - 14) {
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.4);
    doc.line(10, finalY + 5, pageW - 10, finalY + 5);
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.setFont("helvetica", "normal");
    doc.text("Generated by Fridgely", 10, finalY + 10);
    doc.text("Page 1", pageW - 10, finalY + 10, { align: "right" });
  }

  const fileName = `${title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};
 
  // ── Export single recipe as PDF ──
const exportRecipePDF = (recipe, servingMult = 1) => {
  if (!recipe) return;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW   = doc.internal.pageSize.getWidth();
  const pageH   = doc.internal.pageSize.getHeight();
  const margin  = 16;
  const contentW = pageW - margin * 2;
  let y = 0;

  const checkPage = (needed = 10) => {
    if (y + needed > pageH - 16) { doc.addPage(); y = 18; }
  };

  // Header bar
  doc.setFillColor(239, 68, 68);
  doc.rect(0, 0, pageW, 26, "F");
  doc.setFillColor(200, 30, 30);
  doc.roundedRect(margin, 5, 16, 16, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CM", margin + 8, 14.5, { align: "center" });
  doc.setFontSize(15);
  doc.text("Fridgely", margin + 20, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Cook what you've got.", margin + 20, 19);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.setFontSize(7.5);
  doc.text(today, pageW - margin, 15, { align: "right" });
  y = 34;

  // Recipe title
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(recipe._title || recipe.title || "Recipe", contentW);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 9 + 2;

  // Orange accent line
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(1.2);
  doc.line(margin, y, margin + 36, y);
  y += 7;

  // Meta pills (no emojis)
  const metaItems = [
    recipe.servings  && ("Serves: " + recipe.servings),
    recipe.prep_time && ("Prep: "   + recipe.prep_time),
    recipe.cook_time && ("Cook: "   + recipe.cook_time),
    servingMult > 1  && ("Multiplier: x" + servingMult),
  ].filter(Boolean);
  if (metaItems.length) {
    let px = margin;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    metaItems.forEach(item => {
      const tw = doc.getTextWidth(item) + 8;
      doc.setFillColor(255, 247, 237);
      doc.setDrawColor(254, 215, 170);
      doc.setLineWidth(0.4);
      doc.roundedRect(px, y - 4, tw, 7, 1.5, 1.5, "FD");
      doc.setTextColor(194, 65, 12);
      doc.text(item, px + 4, y + 1);
      px += tw + 3;
    });
    y += 10;
  }

  // Overview box
  if (recipe.overview) {
    checkPage(20);
    const overviewLines = doc.splitTextToSize(recipe.overview, contentW - 8);
    const boxH = overviewLines.length * 5.2 + 11;
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(254, 215, 170);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentW, boxH, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(194, 65, 12);
    doc.text("OVERVIEW", margin + 4, y + 5.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    doc.text(overviewLines, margin + 4, y + 11);
    y += boxH + 7;
  }

  // Ingredients (two-column)
  if (recipe.ingredients && recipe.ingredients.main && recipe.ingredients.main.length) {
    checkPage(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(20, 20, 20);
    doc.text("Ingredients", margin, y);
    y += 7;

    const halfW  = (contentW - 6) / 2;
    const ings   = recipe.ingredients.main;
    const mid    = Math.ceil(ings.length / 2);
    const col1   = ings.slice(0, mid);
    const col2   = ings.slice(mid);
    const startY = y;

    const scaleQtyPDF = (qty) => {
      if (!qty || servingMult === 1) return qty;
      const match = qty.match(/^([\d./]+)/);
      if (!match) return qty;
      try {
        const num    = eval(match[1]);
        const scaled = Math.round(num * servingMult * 4) / 4;
        return qty.replace(match[1], scaled % 1 === 0 ? String(scaled) : scaled.toString());
      } catch { return qty; }
    };

    const drawIngCol = (list, xStart) => {
      let cy = startY;
      doc.setFontSize(9);
      list.forEach(ing => {
        const qty     = scaleQtyPDF(ing.quantity || "");
        const text    = (qty + " " + ing.name).trim();
        const wrapped = doc.splitTextToSize(text, halfW - 8);
        doc.setTextColor(249, 115, 22);
        doc.setFont("helvetica", "normal");
        doc.text("-", xStart + 2, cy);
        doc.setTextColor(55, 65, 81);
        doc.text(wrapped, xStart + 7, cy);
        cy += wrapped.length * 5 + 1;
      });
      return cy;
    };

    const endY1 = drawIngCol(col1, margin);
    const endY2 = drawIngCol(col2, margin + halfW + 6);
    y = Math.max(endY1, endY2) + 6;
  }

  // Steps
  if (recipe.steps && recipe.steps.length) {
    checkPage(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(20, 20, 20);
    doc.text("Instructions", margin, y);
    y += 7;

    recipe.steps.forEach((s, idx) => {
      const text     = typeof s === "string" ? s : (s.text || "");
      const timeNote = (typeof s === "object" && s.time_min) ? ("  [" + s.time_min + " min]") : "";
      const fullText = text + timeNote;
      const lines    = doc.splitTextToSize(fullText, contentW - 14);
      const blockH   = lines.length * 5.2 + 5;
      checkPage(blockH + 4);

      doc.setFillColor(249, 115, 22);
      doc.circle(margin + 4.5, y + 3, 4, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(String(idx + 1), margin + 4.5, y + 4.5, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      doc.text(lines, margin + 11, y + 3);
      y += blockH + 2;
    });
    y += 4;
  }

  // Nutrition
  if (recipe.nutrition) {
    const nutItems = [
      { label: "Calories", val: recipe.nutrition.calories, fill: [255,247,237], tc: [194,65,12] },
      { label: "Protein",  val: recipe.nutrition.protein,  fill: [240,253,244], tc: [21,128,61] },
      { label: "Carbs",    val: recipe.nutrition.carbs,    fill: [239,246,255], tc: [29,78,216] },
      { label: "Fat",      val: recipe.nutrition.fat,      fill: [253,244,255], tc: [126,34,206] },
    ].filter(n => n.val);
    if (nutItems.length) {
      checkPage(26);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(20, 20, 20);
      doc.text("Nutrition (per serving" + (servingMult > 1 ? (" x" + servingMult) : "") + ")", margin, y);
      y += 6;
      const colW = contentW / nutItems.length;
      nutItems.forEach((n, i) => {
        doc.setFillColor(...n.fill);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin + i * colW, y, colW - 2, 16, 2, 2, "FD");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...n.tc);
        doc.text(String(n.val), margin + i * colW + (colW - 2) / 2, y + 7, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 100, 100);
        doc.text(n.label, margin + i * colW + (colW - 2) / 2, y + 13, { align: "center" });
      });
      y += 22;
    }
  }

  // Footer
  checkPage(10);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 2, pageW - margin, y + 2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text("Generated by Fridgely", margin, y + 7);
  doc.text("mise.app", pageW - margin, y + 7, { align: "right" });

  const safeName = (recipe._title || recipe.title || "recipe").replace(/[\s/\\?%*:|"<>]/g, "_");
  doc.save(safeName + "_recipe.pdf");
};
  // ── Shopping list from plan ──
  const openShoppingList = (plan, title) => {
    const allIngredients = [];
    plan.forEach(d => Object.values(d.meals).forEach(m => {
      if (m.name) allIngredients.push({ name: m.name });
    }));
    setShoppingList({ open: true, items: allIngredients, title: title || "Shopping List" });
  };

  const openFlexibleShoppingList = (recipe) => {
    if (!recipe?.missing_ingredients?.length) {
      showToast("No extra ingredients needed for this recipe", "error"); return;
    }
    setShoppingList({ open: true, items: recipe.missing_ingredients, title: `Shopping: ${recipe.title}` });
  };

  // ── Grocery List helpers ──
  const isInPantryFuzzy = (ingName) => {
    if (!ingName) return false;
    const n = ingName.toLowerCase();
    return pantryItems.some(p => {
      if (p.inStock === false) return false;
      const pn = (p.name || "").toLowerCase();
      return pn.includes(n) || n.includes(pn);
    });
  };

  const isInGroceryList = (ingName) => {
    if (!ingName) return false;
    const n = ingName.toLowerCase();
    return groceryList.some(g => (g.name || "").toLowerCase() === n);
  };

  const addToGroceryList = (ing) => {
    const name = ing.name || ing;
    if (isInGroceryList(name)) {
      showToast(`"${name}" is already in your grocery list`, "info"); return;
    }
    setGroceryList(prev => [...prev, {
      name,
      qty: ing.qty || ing.quantity || "",
      unit: ing.unit || "",
      addedFrom: details?._title || "",
    }]);
    showToast(`"${name}" added to grocery list 🛒`, "success");
  };

  const removeFromGroceryList = (name) => {
    setGroceryList(prev => prev.filter(g => g.name.toLowerCase() !== name.toLowerCase()));
  };

  const addIngredientToPantry = (ing) => {
    const name = ing.name || ing;
    if (isInPantryFuzzy(name)) {
      showToast(`"${name}" is already in your pantry`, "info"); return;
    }
    setPantryItems(prev => [...prev, {
      name,
      qty: ing.qty || ing.quantity || "",
      unit: ing.unit || "",
      inStock: true,
    }]);
    showToast(`"${name}" added to pantry ✅`, "success");
  };

  const addAllMissingToGrocery = (ingredients) => {
    const missing = (ingredients || []).filter(ing => !isInPantryFuzzy(ing.name));
    if (!missing.length) { showToast("All ingredients are already in your pantry!", "success"); return; }
    let added = 0;
    missing.forEach(ing => {
      if (!isInGroceryList(ing.name)) {
        setGroceryList(prev => [...prev, {
          name: ing.name,
          qty: ing.qty || ing.quantity || "",
          unit: ing.unit || "",
          addedFrom: details?._title || "",
        }]);
        added++;
      }
    });
    showToast(added > 0 ? `${added} missing ingredient${added !== 1 ? "s" : ""} added to grocery list 🛒` : "All missing items already in grocery list", added > 0 ? "success" : "info");
  };

  // ── Shared card styles ──
  const cardSx = {
    cursor: "pointer", borderRadius: 3, overflow: "hidden",
    border: "1px solid #f3f4f6", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    transition: "all 0.22s ease",
    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(107,140,90,0.14)", borderColor: "#a8c298" },
  };

  const badgeSx = (color) => ({
    position: "absolute", top: 10, left: 10,
    background: color, color: "#fff", borderRadius: "8px",
    px: 1, py: 0.3, fontSize: "0.66rem", fontWeight: 800, letterSpacing: "0.06em",
  });

  const GenerateBtn = ({ onClick, loading, disabled, label }) => (
    <Button variant="contained" fullWidth size="large" onClick={onClick}
      disabled={loading || disabled}
      sx={{
        background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)",
        borderRadius: 3, py: 1.6, fontSize: "1rem", fontWeight: 800,
        boxShadow: "0 4px 20px rgba(107,140,90,0.25)",
        "&:hover": { boxShadow: "0 6px 28px rgba(107,140,90,0.38)" },
      }}>
      {loading
        ? <Box display="flex" alignItems="center" gap={1.5}>
            <CircularProgress size={20} sx={{ color: "#fff" }} />
            <span>Generating…</span>
          </Box>
        : label}
    </Button>
  );

  const navItems = [
    { muiIcon: <HomeIcon sx={{ fontSize: 20 }} />, label: "Home", key: "home" },
    { muiIcon: <RestaurantIcon sx={{ fontSize: 20 }} />, label: "Recipe Generator", key: "recipes" },
    { muiIcon: <CalendarMonthIcon sx={{ fontSize: 20 }} />, label: "Meal Planner", key: "planner" },
    { muiIcon: <InventoryIcon sx={{ fontSize: 20 }} />, label: "My Pantry", key: "pantry" },
    { muiIcon: <BookmarkIcon sx={{ fontSize: 20 }} />, label: "Saved Recipes", key: "saved" },
    { muiIcon: <StarIcon sx={{ fontSize: 20 }} />, label: "Top Rated Recipes", key: "toprated" },
    { muiIcon: <HistoryIcon sx={{ fontSize: 20 }} />, label: "Recipe History", key: "history" },
  ];

  // ── Auth gate ──
  if (authLoading) return (
    <Box sx={{ minHeight: "100vh", background: "#141210", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
      <Box sx={{ width: 44, height: 44, borderRadius: 2.5, background: "linear-gradient(145deg, #4a7a3a, #5a7c4a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(107,140,90,0.5)", animation: "pulse 1.5s ease-in-out infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.5 } } }}>
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
          <rect x="4" y="2" width="12" height="16" rx="2" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
          <rect x="4" y="7.5" width="12" height="0.8" fill="rgba(255,255,255,0.4)"/>
          <rect x="6" y="4.5" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.7)"/>
          <rect x="6" y="10.5" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.7)"/>
          <circle cx="13.5" cy="13.5" r="1" fill="#86efac"/>
        </svg>
      </Box>
      <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>Loading Fridgely…</Typography>
    </Box>
  );

  if (!authToken) {
    if (authMode === "login" || authMode === "signup") {
      return <AuthScreen onAuth={handleAuth} initialMode={authMode} onBack={() => setAuthMode("landing")} />;
    }
    return <LandingPage onSignIn={() => setAuthMode("login")} onSignUp={() => setAuthMode("signup")} />;
  }

  return (
    <Box display="flex" sx={{ background: "#f5f1eb", minHeight: "100vh" }}>

      {/* ── Onboarding ── */}
      {showOnboarding && (
        <OnboardingFlow
          setPage={setPage}
          onFinish={() => {
            setShowOnboarding(false);
            localStorage.setItem("onboardingDone", "1");
          }}
        />
      )}

      {/* ── Toast container ── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ── Shopping list modal ── */}
      <ShoppingListModal
        open={shoppingList.open}
        onClose={() => setShoppingList(s => ({ ...s, open: false }))}
        items={shoppingList.items}
        title={shoppingList.title}
      />

      {/* ── Grocery List Modal ── */}
      <Dialog open={groceryListOpen} onClose={() => setGroceryListOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, maxHeight: "85vh" } }}>
        <DialogTitle sx={{ background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)", color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <ShoppingCartIcon sx={{ color: "#60a5fa" }} />
            <Box>
              <Typography fontWeight={800} color="#fff">Grocery List</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                {groceryList.length} item{groceryList.length !== 1 ? "s" : ""} · persists across all tabs
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setGroceryListOpen(false)} sx={{ color: "rgba(255,255,255,0.5)" }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {groceryList.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography fontSize="2.5rem" mb={1.5}>🛒</Typography>
              <Typography fontWeight={700} color="#374151" mb={0.5}>Your grocery list is empty</Typography>
              <Typography variant="body2" color="text.secondary" maxWidth={280} mx="auto">
                Open any recipe and click the cart icon next to ingredients you need to buy
              </Typography>
            </Box>
          ) : (
            <>
              {/* Group by recipe source */}
              {(() => {
                const grouped = {};
                groceryList.forEach(item => {
                  const src = item.addedFrom || "Other";
                  if (!grouped[src]) grouped[src] = [];
                  grouped[src].push(item);
                });
                return Object.entries(grouped).map(([src, items]) => (
                  <Box key={src}>
                    <Box px={3} py={1.2} sx={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontWeight={800} fontSize="0.78rem" color="#374151">
                        {src === "Other" ? "📦 Added manually" : `🍳 From: ${src}`}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#9ca3af", ml: "auto" }}>{items.length} item{items.length !== 1 ? "s" : ""}</Typography>
                    </Box>
                    {items.map((item, i) => (
                      <Box key={i} sx={{ px: 3, py: 1.4, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #f9fafb", "&:hover": { background: "#fafafa" } }}>
                        <ShoppingCartIcon sx={{ color: "#93c5fd", fontSize: 16, flexShrink: 0 }} />
                        <Typography fontSize="0.9rem" color="#374151" flex={1}>
                          {[item.qty, item.unit, item.name].filter(Boolean).join(" ")}
                        </Typography>
                        <Box display="flex" gap={0.5}>
                          <Tooltip title="Add to pantry instead">
                            <IconButton size="small" onClick={() => { addIngredientToPantry(item); removeFromGroceryList(item.name); }}
                              sx={{ color: "#d1d5db", "&:hover": { color: "#22c55e", background: "#f0fdf4" }, p: 0.4, borderRadius: 1 }}>
                              <InventoryIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove from list">
                            <IconButton size="small" onClick={() => removeFromGroceryList(item.name)}
                              sx={{ color: "#d1d5db", "&:hover": { color: "#6b8c5a" }, p: 0.4 }}>
                              <CloseIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ));
              })()}
            </>
          )}
        </DialogContent>
        {groceryList.length > 0 && (
          <Box px={3} py={2} sx={{ borderTop: "1px solid #f3f4f6", display: "flex", gap: 1.5 }}>
            <Button startIcon={<ContentCopyIcon />} variant="outlined" size="small"
              onClick={() => {
                const text = groceryList.map(i => `- ${[i.qty, i.unit, i.name].filter(Boolean).join(" ")}${i.addedFrom ? ` (for ${i.addedFrom})` : ""}`).join("\n");
                navigator.clipboard.writeText(text);
                showToast("Grocery list copied!", "success");
              }}
              sx={{ borderColor: "#e5e7eb", color: "#374151", borderRadius: 2, fontSize: "0.8rem" }}>
              Copy List
            </Button>
            <Button size="small" onClick={() => { setGroceryList([]); showToast("Grocery list cleared", "success"); }}
              sx={{ ml: "auto", color: "#9ca3af", fontSize: "0.8rem" }}>
              Clear All
            </Button>
          </Box>
        )}
      </Dialog>

      {/* ── Substitution modal ── */}
      <SubstitutionModal
        open={subModal.open}
        ingredient={subModal.ingredient}
        recipeName={details?._title}
        onClose={() => setSubModal({ open: false, ingredient: null })}
      />

      {/* ── Low-Stock Notification Panel ── */}
      <LowStockNotificationPanel
        open={notifPanelOpen}
        onClose={() => setNotifPanelOpen(false)}
        lowStockItems={lowStockItems}
        onAddToGrocery={(item) => {
          const name = item.name;
          if (!isInGroceryList(name)) {
            setGroceryList(prev => [...prev, {
              name,
              qty: item.qty || "",
              unit: item.unit || "",
              addedFrom: "Pantry alert",
            }]);
            showToast(`"${name}" added to grocery list 🛒`, "success");
          } else {
            showToast(`"${name}" is already in your grocery list`, "info");
          }
          setDismissedLowStock(prev => new Set([...prev, name]));
        }}
        onDismiss={(name) => setDismissedLowStock(prev => new Set([...prev, name]))}
        onDismissAll={() => {
          setDismissedLowStock(prev => new Set([...prev, ...lowStockItems.map(i => i.name)]));
          setNotifPanelOpen(false);
        }}
      />

      {/* ── Cook mode ── */}
      <CookMode
        open={cookModeOpen}
        recipe={details}
        language={language}
        onClose={() => setCookModeOpen(false)}
      />

      {/* ── Recipe History Drawer ── */}
      <Drawer
        anchor="right"
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        PaperProps={{ sx: { width: 340, background: "#141210", display: "flex", flexDirection: "column" } }}
      >
        <Box sx={{ px: 3, py: 2.5, background: "linear-gradient(135deg, #161410, #1e2b1a)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <HistoryIcon sx={{ color: "#b8714e", fontSize: 22 }} />
            <Box>
              <Typography fontWeight={800} color="#fff" fontSize="1rem">Recently Viewed</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>{recipeHistory.length} recipes</Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            {recipeHistory.length > 0 && (
              <Button size="small" onClick={() => { setRecipeHistory([]); localStorage.removeItem("recipeHistory"); }}
                sx={{ color: "#9ca3af", fontSize: "0.72rem", minWidth: 0 }}>Clear</Button>
            )}
            <IconButton size="small" onClick={() => setHistoryOpen(false)} sx={{ color: "rgba(255,255,255,0.5)" }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {recipeHistory.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography fontSize="2.5rem" mb={1}>🍳</Typography>
              <Typography fontWeight={600} color="#6b7280" fontSize="0.9rem">No history yet</Typography>
              <Typography variant="caption" color="#4b5563">View any recipe and it'll appear here</Typography>
            </Box>
          ) : (
            recipeHistory.map((item, i) => {
              const timeAgo = (() => {
                const diff = Date.now() - new Date(item.viewedAt).getTime();
                const mins = Math.floor(diff / 60000);
                if (mins < 1) return "just now";
                if (mins < 60) return `${mins}m ago`;
                const hrs = Math.floor(mins / 60);
                if (hrs < 24) return `${hrs}h ago`;
                return `${Math.floor(hrs / 24)}d ago`;
              })();
              return (
                <Box key={i}
                  onClick={() => { fetchDetails(item.title); setHistoryOpen(false); }}
                  sx={{
                    display: "flex", alignItems: "center", gap: 1.5,
                    px: 2, py: 1.5, mb: 0.8, borderRadius: 2, cursor: "pointer",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    transition: "all 0.15s",
                    "&:hover": { background: "rgba(184,113,78,0.12)", borderColor: "rgba(184,113,78,0.3)" },
                  }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 1.5, background: "rgba(184,113,78,0.15)", border: "1px solid rgba(184,113,78,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>🍽️</Box>
                  <Box flex={1} minWidth={0}>
                    <Typography fontWeight={700} color="#fff" fontSize="0.85rem" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)" }}>{timeAgo}</Typography>
                  </Box>
                  <ChevronRightIcon sx={{ color: "rgba(255,255,255,0.2)", fontSize: 16, flexShrink: 0 }} />
                </Box>
              );
            })
          )}
        </Box>
      </Drawer>

      {/* ══ FIXED TOP-RIGHT: Topbar pill ══ */}
      <Box sx={{ position: "fixed", top: 12, right: 16, zIndex: 1300, display: "flex", alignItems: "center", gap: 1.5, background: "rgba(20,20,18,0.75)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", px: 1.5, py: 0.8, boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>

        {/* User chip */}
        {currentUser && (
          <Box display="flex" alignItems="center" gap={1} sx={{ pr: 1, borderRight: "1px solid rgba(255,255,255,0.1)" }}>
            <Box sx={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #5a7c4a, #b8714e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#fff" }}>
              {currentUser.name?.charAt(0).toUpperCase() || "U"}
            </Box>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography sx={{ color: "#fff", fontSize: "0.72rem", fontWeight: 700, lineHeight: 1.2 }}>{currentUser.name}</Typography>
              {currentUser.username && <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.6rem" }}>@{currentUser.username}</Typography>}
            </Box>
          </Box>
        )}

        {/* Bell */}
        <Tooltip title={lowStockItems.length > 0 ? `${lowStockItems.length} pantry alert${lowStockItems.length !== 1 ? "s" : ""}` : "Pantry alerts"} arrow placement="bottom">
          <IconButton onClick={() => setNotifPanelOpen(true)} sx={{ width: 36, height: 36, background: lowStockItems.length > 0 ? "rgba(234,179,8,0.15)" : "transparent", border: `1.5px solid ${lowStockItems.length > 0 ? "rgba(234,179,8,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", transition: "all 0.2s", animation: lowStockItems.length > 0 ? "bellPulse 2.5s ease-in-out infinite" : "none", "@keyframes bellPulse": { "0%,100%": { boxShadow: "0 0 0 0 rgba(234,179,8,0)" }, "50%": { boxShadow: "0 0 0 6px rgba(234,179,8,0.12)" } }, "&:hover": { background: lowStockItems.length > 0 ? "rgba(234,179,8,0.22)" : "rgba(255,255,255,0.1)", transform: "scale(1.05)" } }}>
            <Badge badgeContent={lowStockItems.length} invisible={lowStockItems.length === 0} sx={{ "& .MuiBadge-badge": { fontSize: "0.55rem", fontWeight: 900, minWidth: 14, height: 14, padding: "0 3px", background: "#eab308", color: "#1a1200", top: -2, right: -2 } }}>
              {lowStockItems.length > 0 ? <NotificationsActiveIcon sx={{ fontSize: 17, color: "#eab308" }} /> : <NotificationsNoneIcon sx={{ fontSize: 17, color: "rgba(255,255,255,0.4)" }} />}
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Logout */}
        {currentUser && (
          <Tooltip title="Sign out" arrow placement="bottom">
            <IconButton onClick={handleLogout} size="small" sx={{ width: 36, height: 36, borderRadius: "10px", border: "1.5px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", transition: "all 0.2s", "&:hover": { color: "#ef4444", background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" } }}>
              <Typography sx={{ fontSize: "1rem" }}>⎋</Typography>
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* ══ Auth Prompt Modal ══ */}
      {showAuthPrompt.show && (
        <Box sx={{ position: "fixed", inset: 0, zIndex: 1400, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }} onClick={() => setShowAuthPrompt({ show: false, tab: "" })}>
          <Box sx={{ background: "rgba(20,22,18,0.98)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", p: 4, maxWidth: 400, width: "100%", boxShadow: "0 32px 80px rgba(0,0,0,0.7)", animation: "promptIn 0.3s cubic-bezier(0.34,1.56,0.64,1)", "@keyframes promptIn": { from: { opacity: 0, transform: "scale(0.92) translateY(10px)" }, to: { opacity: 1, transform: "scale(1) translateY(0)" } } }} onClick={e => e.stopPropagation()}>
            <Typography sx={{ fontSize: "2.5rem", mb: 2, textAlign: "center" }}>🔒</Typography>
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem", textAlign: "center", mb: 0.8 }}>Sign in to access {showAuthPrompt.tab}</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", textAlign: "center", mb: 3, lineHeight: 1.6 }}>Create a free account to unlock your full kitchen — pantry tracking, saved recipes, meal plans and more.</Typography>
            <Box display="flex" flexDirection="column" gap={1.5}>
              <Box onClick={() => { setShowAuthPrompt({ show: false, tab: "" }); setAuthToken(null); setCurrentUser(null); setTimeout(() => window.location.reload(), 10); }}
                sx={{ py: 1.4, borderRadius: "12px", cursor: "pointer", background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", color: "#fff", fontWeight: 800, fontSize: "0.95rem", textAlign: "center", boxShadow: "0 6px 20px rgba(107,140,90,0.4)", "&:hover": { transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                Create free account →
              </Box>
              <Box onClick={() => { setShowAuthPrompt({ show: false, tab: "" }); setAuthToken(null); setCurrentUser(null); setTimeout(() => window.location.reload(), 10); }}
                sx={{ py: 1.4, borderRadius: "12px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.95rem", textAlign: "center", "&:hover": { borderColor: "rgba(255,255,255,0.4)", color: "#fff" }, transition: "all 0.2s" }}>
                Sign in
              </Box>
              <Box onClick={() => setShowAuthPrompt({ show: false, tab: "" })} sx={{ py: 0.6, cursor: "pointer", color: "rgba(255,255,255,0.25)", fontSize: "0.8rem", textAlign: "center", "&:hover": { color: "rgba(255,255,255,0.5)" } }}>Maybe later</Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* ══ FLOATING CHEF CHAT WIDGET (bottom-right) ══ */}
      <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1400, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1.5 }}>

        {/* Chat window */}
        {chatOpen && (
          <Box sx={{
            width: 360, height: 520,
            background: "#141210",
            border: "1px solid rgba(107,140,90,0.3)",
            borderRadius: 3,
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            animation: "chatSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            "@keyframes chatSlideUp": {
              from: { opacity: 0, transform: "translateY(20px) scale(0.95)" },
              to:   { opacity: 1, transform: "translateY(0) scale(1)" },
            },
          }}>
            {/* Header */}
            <Box sx={{
              px: 2, py: 1.5,
              background: "linear-gradient(135deg, #1a1612, #1e2b1a)",
              borderBottom: "1px solid rgba(107,140,90,0.2)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <Box display="flex" alignItems="center" gap={1.2}>
                <Box sx={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6b8c5a, #b8714e)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", flexShrink: 0,
                  boxShadow: "0 0 12px rgba(107,140,90,0.4)",
                }}>🧑‍🍳</Box>
                <Box>
                  <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.88rem", lineHeight: 1.2 }}>Fridgely AI</Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}>
                      {chatLoading ? "Thinking…" : "Online"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" gap={0.5}>
                <Tooltip title="Clear chat">
                  <IconButton
                    size="small"
                    onClick={() => setChatMessages([{ role: "assistant", content: "Hey! I'm Fridgely 🧊 Tell me what's in your kitchen right now — even a handful of things — and I'll find something genuinely good to cook." }])}
                    sx={{ color: "rgba(255,255,255,0.3)", "&:hover": { color: "#fff" }, p: 0.5 }}
                  >
                    <AutorenewIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" onClick={() => setChatOpen(false)} sx={{ color: "rgba(255,255,255,0.3)", "&:hover": { color: "#fff" }, p: 0.5 }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5, display: "flex", flexDirection: "column", gap: 1,
              "&::-webkit-scrollbar": { width: 4 },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": { background: "rgba(107,140,90,0.3)", borderRadius: 2 },
            }}>
              {chatMessages.map((msg, i) => (
                <Box key={i} sx={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end", gap: 0.8,
                }}>
                  {msg.role === "assistant" && (
                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #6b8c5a, #b8714e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", flexShrink: 0, mb: 0.2 }}>🧑‍🍳</Box>
                  )}
                  <Box sx={{
                    maxWidth: "78%",
                    px: 1.5, py: 1,
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #5a7c4a, #4a6a3a)"
                      : "rgba(255,255,255,0.07)",
                    border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                  }}>
                    <Typography sx={{
                      color: msg.role === "user" ? "#fff" : "rgba(255,255,255,0.85)",
                      fontSize: "0.82rem", lineHeight: 1.55, whiteSpace: "pre-wrap",
                    }}>
                      {msg.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {chatLoading && (
                <Box display="flex" alignItems="flex-end" gap={0.8}>
                  <Box sx={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #6b8c5a, #b8714e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", flexShrink: 0 }}>🧑‍🍳</Box>
                  <Box sx={{ px: 1.5, py: 1, borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Box display="flex" gap={0.4} alignItems="center" height={18}>
                      {[0,1,2].map(i => (
                        <Box key={i} sx={{
                          width: 6, height: 6, borderRadius: "50%", background: "#6b8c5a",
                          animation: "typingDot 1.2s ease-in-out infinite",
                          animationDelay: `${i * 0.2}s`,
                          "@keyframes typingDot": {
                            "0%,60%,100%": { transform: "translateY(0)", opacity: 0.4 },
                            "30%": { transform: "translateY(-5px)", opacity: 1 },
                          },
                        }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
              <div ref={chatEndRef} />
            </Box>

            {/* Quick suggestions (only when first open) */}
            {chatMessages.length === 1 && !chatLoading && (
              <Box sx={{ px: 2, pb: 1, display: "flex", flexWrap: "wrap", gap: 0.7, flexShrink: 0 }}>
                {[
                  "What can I cook with my pantry?",
                  "Suggest a quick dinner",
                  "I have eggs and rice — ideas?",
                  "How do I fix an over-salted dish?",
                ].map(s => (
                  <Box key={s} onClick={() => { setChatInput(s); }}
                    sx={{
                      px: 1.2, py: 0.5, borderRadius: "12px", cursor: "pointer",
                      background: "rgba(107,140,90,0.1)", border: "1px solid rgba(107,140,90,0.25)",
                      fontSize: "0.7rem", color: "#a8c298", fontWeight: 600,
                      transition: "all 0.15s",
                      "&:hover": { background: "rgba(107,140,90,0.2)", borderColor: "rgba(107,140,90,0.5)" },
                    }}
                  >{s}</Box>
                ))}
              </Box>
            )}

            {/* Input */}
            <Box sx={{
              px: 2, py: 1.5,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              flexShrink: 0,
              display: "flex", gap: 1, alignItems: "flex-end",
            }}>
              <TextField
                multiline maxRows={3}
                fullWidth
                placeholder="Ask anything about cooking…"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 2.5,
                    color: "#fff",
                    fontSize: "0.82rem",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: "rgba(107,140,90,0.4)" },
                    "&.Mui-focused fieldset": { borderColor: "#6b8c5a" },
                  },
                  "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.25)", opacity: 1 },
                }}
              />
              <IconButton
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || chatLoading}
                sx={{
                  width: 36, height: 36, flexShrink: 0,
                  background: chatInput.trim() ? "linear-gradient(135deg, #5a7c4a, #4a6a3a)" : "rgba(255,255,255,0.06)",
                  color: chatInput.trim() ? "#fff" : "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  transition: "all 0.2s",
                  "&:hover": { background: "linear-gradient(135deg, #6b8c5a, #5a7a4a)" },
                  "&:disabled": { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.15)" },
                }}
              >
                {chatLoading
                  ? <CircularProgress size={14} sx={{ color: "#6b8c5a" }} />
                  : <PlayArrowIcon sx={{ fontSize: 18 }} />
                }
              </IconButton>
            </Box>
          </Box>
        )}

        {/* FAB — clean pill */}
        <Box
          onClick={() => setChatOpen(o => !o)}
          sx={{
            display: "flex", alignItems: "center", gap: 1.2,
            pl: 0.8, pr: 2.2, height: 54,
            borderRadius: "100px",
            cursor: "pointer",
            userSelect: "none",
            background: chatOpen
              ? "linear-gradient(135deg, #1f2937, #374151)"
              : "linear-gradient(135deg, #5a7c4a 0%, #3d5c2e 100%)",
            boxShadow: chatOpen
              ? "0 6px 20px rgba(0,0,0,0.4)"
              : "0 6px 24px rgba(107,140,90,0.55)",
            border: chatOpen
              ? "1px solid rgba(255,255,255,0.08)"
              : "1.5px solid rgba(255,255,255,0.15)",
            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: chatOpen
                ? "0 10px 28px rgba(0,0,0,0.5)"
                : "0 10px 32px rgba(107,140,90,0.65)",
            },
          }}
        >
          {/* Avatar */}
          <Box sx={{
            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
            background: "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.15rem",
          }}>
            {chatOpen ? <CloseIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }} /> : "🧑‍🍳"}
          </Box>

          {/* Text */}
          {!chatOpen ? (
            <Box>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.85rem", lineHeight: 1.25, letterSpacing: "-0.1px", whiteSpace: "nowrap" }}>
                Your Kitchen Buddy
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.68rem", fontWeight: 500, lineHeight: 1.2, whiteSpace: "nowrap" }}>
                Got ingredients? Let's cook 🧊
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "0.8rem", whiteSpace: "nowrap" }}>
              Close
            </Typography>
          )}
        </Box>
      </Box>

      {/* ── SIDEBAR ── */}
      <Box sx={{
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 1200,
        width: sidebarOpen ? SIDEBAR_W : SIDEBAR_COLLAPSED_W,
        transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
        background: "linear-gradient(180deg, #141210 0%, #1e1b16 50%, #141210 100%)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.22)",
        borderRight: "1px solid rgba(107,140,90,0.15)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Logo row */}
        <Box sx={{
          display: "flex", alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          px: sidebarOpen ? 2.5 : 1, pt: 2.5, pb: 1.5,
          minHeight: 64, flexShrink: 0,
        }}>
          {sidebarOpen && (
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{
                width: 34, height: 34, borderRadius: 2, flexShrink: 0,
                background: "linear-gradient(145deg, #4a7a3a 0%, #5a7c4a 50%, #3d6b2a 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(107,140,90,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
                overflow: "hidden",
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="4" y="2" width="12" height="16" rx="2" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
                  <rect x="4" y="7.5" width="12" height="0.8" fill="rgba(255,255,255,0.4)"/>
                  <rect x="6" y="4.5" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.7)"/>
                  <rect x="6" y="10.5" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.7)"/>
                  <circle cx="13.5" cy="13.5" r="1" fill="#86efac"/>
                </svg>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                  Fridgely
                </Typography>
                <Typography sx={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", lineHeight: 1 }}>
                  Cook what you've got.
                </Typography>
              </Box>
            </Box>
          )}
          {!sidebarOpen && (
            <Box sx={{
              width: 34, height: 34, borderRadius: 2,
              background: "linear-gradient(145deg, #4a7a3a 0%, #5a7c4a 50%, #3d6b2a 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(107,140,90,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
              overflow: "hidden",
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="4" y="2" width="12" height="16" rx="2" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
                <rect x="4" y="7.5" width="12" height="0.8" fill="rgba(255,255,255,0.4)"/>
                <rect x="6" y="4.5" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.7)"/>
                <rect x="6" y="10.5" width="4" height="1.2" rx="0.6" fill="rgba(255,255,255,0.7)"/>
                <circle cx="13.5" cy="13.5" r="1" fill="#86efac"/>
              </svg>
            </Box>
          )}
          {sidebarOpen && (
            <IconButton onClick={() => setSidebarOpen(false)} size="small"
              sx={{ color: "rgba(255,255,255,0.4)", ml: 0.5, "&:hover": { background: "rgba(107,140,90,0.15)", color: "#a8c298" } }}>
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Box>

        {!sidebarOpen && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 0.5 }}>
            <IconButton onClick={() => setSidebarOpen(true)} size="small"
              sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { background: "rgba(107,140,90,0.15)", color: "#a8c298" } }}>
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ height: "1px", background: "rgba(255,255,255,0.06)", mx: sidebarOpen ? 2.5 : 1, mb: 1.5, flexShrink: 0 }} />

        <Box sx={{ px: sidebarOpen ? 1.5 : 1, flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {navItems.map(({ muiIcon, label, key }) => {
            const isActive = page === key;
            const protectedTabs = ["recipes","planner","pantry","saved","history","toprated"];
            const requiresAuth = protectedTabs.includes(key);
            const item = (
              <Box key={key} onClick={() => setPage(key)} sx={{
                display: "flex", alignItems: "center",
                gap: sidebarOpen ? 1.5 : 0,
                justifyContent: sidebarOpen ? "flex-start" : "center",
                px: sidebarOpen ? 1.5 : 0, py: 1.1, borderRadius: 2, mb: 0.5,
                cursor: "pointer",
                background: isActive ? "rgba(107,140,90,0.2)" : "transparent",
                border: isActive ? "1px solid rgba(107,140,90,0.38)" : "1px solid transparent",
                color: isActive ? "#a8c298" : "rgba(255,255,255,0.45)",
                transition: "all 0.18s ease",
                "&:hover": { background: "rgba(107,140,90,0.12)", color: "#a8c298", borderColor: "rgba(107,140,90,0.22)" },
                overflow: "hidden", whiteSpace: "nowrap", minHeight: 42,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0, color: "inherit" }}>
                  {muiIcon}
                </Box>
                {sidebarOpen && (
                  <Typography sx={{ fontWeight: isActive ? 700 : 500, fontSize: "0.88rem", color: "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {label}
                  </Typography>
                )}
              </Box>
            );
            return sidebarOpen ? item : (
              <Tooltip key={key} title={label} placement="right" arrow>{item}</Tooltip>
            );
          })}
        </Box>

        {savedRecipes.length > 0 && (
          <Box sx={{
            mx: sidebarOpen ? 1.5 : 1, mb: 1, flexShrink: 0,
            p: sidebarOpen ? 1.5 : 1,
            background: "rgba(107,140,90,0.12)", borderRadius: 2,
            border: "1px solid rgba(107,140,90,0.2)",
            display: "flex", alignItems: "center",
            justifyContent: sidebarOpen ? "flex-start" : "center",
            gap: 1, overflow: "hidden",
          }}>
            <Typography sx={{ fontSize: sidebarOpen ? "0.75rem" : "0.9rem", flexShrink: 0 }}>💾</Typography>
            {sidebarOpen && (
              <Typography variant="caption" sx={{ color: "#a8c298", fontWeight: 700, whiteSpace: "nowrap" }}>
                {savedRecipes.length} saved recipe{savedRecipes.length !== 1 ? "s" : ""}
              </Typography>
            )}
          </Box>
        )}
        {/* Grocery list badge */}
        <Box onClick={() => setGroceryListOpen(true)} sx={{
          mx: sidebarOpen ? 1.5 : 1, mb: 2.5, flexShrink: 0,
          p: sidebarOpen ? 1.5 : 1,
          background: groceryList.length > 0 ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
          borderRadius: 2,
          border: `1px solid ${groceryList.length > 0 ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.08)"}`,
          display: "flex", alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          gap: 1, overflow: "hidden", cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { background: "rgba(59,130,246,0.22)", borderColor: "rgba(59,130,246,0.5)" },
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCartIcon sx={{ fontSize: sidebarOpen ? "0.9rem" : "1rem", color: "#60a5fa", flexShrink: 0 }} />
            {sidebarOpen && (
              <Typography variant="caption" sx={{ color: "#93c5fd", fontWeight: 700, whiteSpace: "nowrap" }}>
                Grocery List
              </Typography>
            )}
          </Box>
          {groceryList.length > 0 && (
            <Box sx={{ background: "#3b82f6", color: "#fff", borderRadius: "10px", px: 0.8, py: 0.1, fontSize: "0.65rem", fontWeight: 800, minWidth: 18, textAlign: "center", flexShrink: 0 }}>
              {groceryList.length}
            </Box>
          )}
        </Box>


      </Box>
      <Box flex={1} sx={{
        ml: sidebarOpen ? `${SIDEBAR_W}px` : `${SIDEBAR_COLLAPSED_W}px`,
        transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* ══ HOME ══ */}
        {page === "home" && (
          <Box sx={{ minHeight: "100vh", background: "#141210" }}>
            <Box sx={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden", display: "flex", alignItems: "center" }}>
              <Box component="img"
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=80"
                alt="hero food"
                sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "brightness(0.45) saturate(1.2)", transform: "scale(1.03)" }}
              />
              <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(18,16,12,0.80) 0%, rgba(18,16,12,0.2) 60%, transparent 100%)" }} />
              <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "38%", background: "linear-gradient(to top, #141210 0%, transparent 100%)" }} />

              <Box sx={{ position: "relative", zIndex: 2, px: { xs: 4, md: 8 }, maxWidth: 780 }}>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(107,140,90,0.18)", border: "1px solid rgba(107,140,90,0.4)", borderRadius: "100px", px: 2, py: 0.6, mb: 3, backdropFilter: "blur(8px)" }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#6b8c5a", boxShadow: "0 0 8px #6b8c5a" }} />
                  <Typography sx={{ color: "#a8c298", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Cook what you've got.</Typography>
                </Box>
                <Typography sx={{ fontFamily: "'Georgia', serif", fontWeight: 900, fontSize: { xs: "3.2rem", md: "5rem" }, lineHeight: 1.02, letterSpacing: "-2px", color: "#fff", mb: 1, textShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
                  Open your fridge.
                  <Box component="span" sx={{ background: "linear-gradient(90deg, #b8714e, #6b8c5a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {" "}We'll handle it.
                  </Box>
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "1.15rem", fontWeight: 400, lineHeight: 1.65, maxWidth: 520, mb: 4.5, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
                  Tell Fridgely what's in your kitchen — anything at all — and it finds real, creative recipes you can make right now. No grocery run. No wasted food.
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button variant="contained" size="large" onClick={() => setPage("recipes")}
                    sx={{ background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", borderRadius: "12px", px: 4, py: 1.6, fontSize: "1rem", fontWeight: 700, boxShadow: "0 8px 32px rgba(107,140,90,0.45)", "&:hover": { boxShadow: "0 12px 40px rgba(107,140,90,0.55)", transform: "translateY(-2px)" }, transition: "all 0.2s ease" }}>
                    What can I cook? →
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => setPage("planner")}
                    sx={{ borderColor: "rgba(255,255,255,0.35)", color: "#fff", borderRadius: "12px", px: 4, py: 1.6, fontSize: "1rem", fontWeight: 600, backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.07)", "&:hover": { borderColor: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.13)" } }}>
                    Plan My Week
                  </Button>
                </Box>
                <Box display="flex" gap={4} mt={5} flexWrap="wrap">
                  {[{ num: "Any", label: "Ingredients work" }, { num: "5", label: "Day meal plans" }, { num: "12", label: "Cuisine styles" }].map((s, i) => (
                    <Box key={i}>
                      <Typography sx={{ color: "#b8714e", fontWeight: 900, fontSize: "1.8rem", lineHeight: 1, fontFamily: "'Georgia', serif" }}>{s.num}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: 500, mt: 0.3 }}>{s.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* ── Three recipe cards — zig-zag staircase ── */}
              <Box sx={{
                display: { xs: "none", lg: "block" },
                position: "absolute", right: 50, top: "50%",
                transform: "translateY(-50%)",
                width: 290, height: 500,
                zIndex: 2,
              }}>
                {/* Card 1 — top-left, Breakfast */}
                <Box sx={{
                  position: "absolute", top: 0, left: 0,
                  width: 212, borderRadius: "18px",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                  transform: "rotate(-5deg)", overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { transform: "rotate(-2deg) translateY(-5px)", boxShadow: "0 24px 60px rgba(0,0,0,0.55)" },
                }}>
                  <Box component="img" src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80" sx={{ width: "100%", height: 95, objectFit: "cover", display: "block" }} />
                  <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 95, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />
                  <Box sx={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 0.5, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", borderRadius: "8px", px: 1, py: 0.35 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "lp 2s ease-in-out infinite", "@keyframes lp": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } }} />
                    <Typography sx={{ color: "#86efac", fontSize: "0.58rem", fontWeight: 800 }}>Ready to cook</Typography>
                  </Box>
                  <Box sx={{ px: 1.8, py: 1.3 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.42)", fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.4 }}>☀️ Breakfast · 3 ingredients</Typography>
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.86rem", mb: 0.4 }}>Fluffy Pancakes</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", mb: 0.9, lineHeight: 1.4 }}>Golden, soft, ready in 12 min.</Typography>
                    <Box display="flex" gap={0.7}>
                      {["🟢 Easy", "⏱ 12 min"].map((tag, i) => (
                        <Box key={i} sx={{ background: "rgba(184,113,78,0.22)", border: "1px solid rgba(184,113,78,0.38)", borderRadius: "6px", px: 0.9, py: 0.25, fontSize: "0.6rem", fontWeight: 700, color: "#c4b08a" }}>{tag}</Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                {/* Card 2 — middle-right, Lunch */}
                <Box sx={{
                  position: "absolute", top: 162, left: 68,
                  width: 215, borderRadius: "18px",
                  background: "rgba(255,255,255,0.09)",
                  backdropFilter: "blur(22px)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.5)",
                  transform: "rotate(5deg)", overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { transform: "rotate(2deg) translateY(-5px)", boxShadow: "0 26px 62px rgba(0,0,0,0.55)" },
                }}>
                  <Box component="img" src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80" sx={{ width: "100%", height: 95, objectFit: "cover", display: "block" }} />
                  <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 95, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />
                  <Box sx={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 0.5, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", borderRadius: "8px", px: 1, py: 0.35 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "lp 2s ease-in-out 0.4s infinite" }} />
                    <Typography sx={{ color: "#86efac", fontSize: "0.58rem", fontWeight: 800 }}>Ready to cook</Typography>
                  </Box>
                  <Box sx={{ px: 1.8, py: 1.3 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.42)", fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.4 }}>🌿 Lunch · 5 ingredients</Typography>
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.86rem", mb: 0.4 }}>Herb Garden Bowl</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", mb: 0.9, lineHeight: 1.4 }}>Fresh, crisp, zero cooking needed.</Typography>
                    <Box display="flex" gap={0.7}>
                      {["🌱 Vegan", "⚡ No-cook"].map((tag, i) => (
                        <Box key={i} sx={{ background: i === 0 ? "rgba(34,197,94,0.18)" : "rgba(184,113,78,0.22)", border: `1px solid ${i === 0 ? "rgba(34,197,94,0.3)" : "rgba(184,113,78,0.38)"}`, borderRadius: "6px", px: 0.9, py: 0.25, fontSize: "0.6rem", fontWeight: 700, color: i === 0 ? "#86efac" : "#c4b08a" }}>{tag}</Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                {/* Card 3 — bottom-left, Dinner */}
                <Box sx={{
                  position: "absolute", top: 330, left: 8,
                  width: 220, borderRadius: "20px",
                  background: "rgba(255,255,255,0.13)",
                  backdropFilter: "blur(28px)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
                  transform: "rotate(-4deg)", overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { transform: "rotate(-1deg) translateY(-5px)", boxShadow: "0 32px 72px rgba(0,0,0,0.6)" },
                }}>
                  <Box component="img" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" sx={{ width: "100%", height: 95, objectFit: "cover", display: "block" }} />
                  <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 95, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />
                  <Box sx={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 0.5, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", borderRadius: "8px", px: 1, py: 0.35 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", animation: "lp 2s ease-in-out 0.8s infinite" }} />
                    <Typography sx={{ color: "#86efac", fontSize: "0.58rem", fontWeight: 800 }}>Ready to cook</Typography>
                  </Box>
                  <Box sx={{ px: 2, py: 1.4 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.35 }}>🌙 Dinner · from your fridge</Typography>
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.9rem", mb: 0.4 }}>Golden Veggie Stir-Fry</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", mb: 0.9, lineHeight: 1.4 }}>Crispy, colourful, 20 min flat.</Typography>
                    <Box display="flex" gap={0.7}>
                      {["🟢 Easy", "⚡ Quick"].map((tag, i) => (
                        <Box key={i} sx={{ background: "rgba(184,113,78,0.25)", border: "1px solid rgba(184,113,78,0.4)", borderRadius: "6px", px: 0.9, py: 0.25, fontSize: "0.6rem", fontWeight: 700, color: "#c4b08a" }}>{tag}</Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Features strip */}
            <Box sx={{ background: "#141210", px: { xs: 4, md: 8 }, py: 8 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", mb: 4 }}>
                How Fridgely works
              </Typography>
              <Grid container spacing={3}>
                {[
                  { icon: "🔒", title: "Zero assumptions", desc: "Fridgely only uses what you actually have. No phantom ingredients, no 'just pick up X at the store'.", accent: "#b8714e", page: "recipes" },
                  { icon: "⚡", title: "Smart stretches", desc: "See how one or two extra items could open up a completely different dish — you decide if it's worth it.", accent: "#6b8c5a", page: "recipes" },
                  { icon: "📅", title: "A whole week, sorted", desc: "Fridgely maps 5 days of breakfasts, lunches, dinners and snacks from your existing kitchen stock.", accent: "#c49a3c", page: "planner" },
                  { icon: "🌍", title: "Any cuisine you crave", desc: "Italian, Japanese, Indian, Mexican and 9 more — your ingredients, their flavours.", accent: "#22c55e", page: "recipes" },
                ].map((feat, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Box onClick={() => setPage(feat.page)} sx={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", p: 3, cursor: "pointer",
                      transition: "all 0.22s ease",
                      "&:hover": { background: "rgba(255,255,255,0.08)", borderColor: `${feat.accent}55`, transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(0,0,0,0.3)" },
                    }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: "12px", background: `${feat.accent}22`, border: `1px solid ${feat.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", mb: 2 }}>{feat.icon}</Box>
                      <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", mb: 0.8 }}>{feat.title}</Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.6 }}>{feat.desc}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box mt={8} sx={{ borderRadius: "20px", overflow: "hidden", height: 260, position: "relative", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
                <Box component="img" src="https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1600&q=80" alt="food spread"
                  sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%", filter: "brightness(0.6) saturate(1.1)" }} />
                <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2, background: "rgba(0,0,0,0.25)" }}>
                  <Typography sx={{ fontFamily: "'Georgia', serif", color: "#fff", fontWeight: 900, fontSize: { xs: "1.6rem", md: "2.4rem" }, textAlign: "center", textShadow: "0 4px 24px rgba(0,0,0,0.6)", letterSpacing: "-0.5px" }}>
                    Your kitchen has more in it than you think.
                  </Typography>
                  <Button variant="contained" onClick={() => setPage("recipes")} sx={{ background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", borderRadius: "10px", px: 4, py: 1.3, fontWeight: 700, fontSize: "0.95rem", boxShadow: "0 8px 24px rgba(107,140,90,0.4)", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 32px rgba(107,140,90,0.5)" }, transition: "all 0.2s ease" }}>
                    Show me what I've got →
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* ══ RECIPE GENERATOR ══ */}
        {page === "recipes" && (
          <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #f5f2ec 0%, #eef2e8 45%, #f5f2ec 100%)", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "fixed", top: 60, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,113,78,0.12) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />
            <Box sx={{ position: "fixed", bottom: 100, left: 100, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(107,140,90,0.09) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
            <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.45, backgroundImage: "radial-gradient(circle, #8faa7c 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            {/* Page banner */}
            <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(125deg, #161410 0%, #1e2b1a 40%, #243a1e 70%, #3a5c30 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
              <Box sx={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(45deg, #b8714e 0px, #b8714e 1px, transparent 1px, transparent 12px)" }} />
              {["🥚","🧅","🫑","🧄","🍋","🥬","🌶️","🧂"].map((e, i) => (
                <Box key={i} sx={{ position: "absolute", fontSize: i % 2 === 0 ? "1.6rem" : "1.1rem", opacity: 0.12, pointerEvents: "none", userSelect: "none", top: `${10 + (i * 11) % 70}%`, right: `${4 + (i * 7) % 40}%`, transform: `rotate(${-20 + i * 11}deg)` }}>{e}</Box>
              ))}
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
                  <Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(184,113,78,0.2)", border: "1px solid rgba(184,113,78,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#b8714e", boxShadow: "0 0 6px #b8714e" }} />
                      <Typography sx={{ color: "#c4b08a", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Recipe Studio</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>
                      🍳 Recipe Generator
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", maxWidth: 520 }}>
                      Add your ingredients, set your filters (including cuisine!), and get perfectly crafted recipes
                    </Typography>
                  </Box>
                  {/* Language selector */}
                  <Box sx={{ mt: 0.5 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.8 }}>
                      Recipe Language
                    </Typography>
                    <LanguagePill value={language} onChange={setLanguage} accentColor="#b8714e" accentBg="#f0f4ec" />
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box p={4} maxWidth={1000} mx="auto" sx={{ position: "relative", zIndex: 1 }}>

              {/* ── Shared Filters (always visible above tabs) ── */}
              <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden", mb: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between"
                  px={3} py={2} sx={{ cursor: "pointer", "&:hover": { background: "#fafafa" } }}
                  onClick={() => setFiltersOpen(!filtersOpen)}>
                  <Box display="flex" alignItems="center" gap={1.2}>
                    <TuneIcon sx={{ color: "#6b8c5a", fontSize: 20 }} />
                    <Typography fontWeight={700} color="#374151">Filters</Typography>
                    {totalFilters > 0 && (
                      <Box sx={{ background: "#6b8c5a", color: "#fff", borderRadius: "12px", px: 1, py: 0.1, fontSize: "0.7rem", fontWeight: 800, minWidth: 22, textAlign: "center" }}>{totalFilters}</Box>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {filtersOpen ? "▲ Hide" : "▼ Show"} · cuisine, food type, diet, difficulty
                  </Typography>
                </Box>
                {filtersOpen && (
                  <Box px={3} pb={3}>
                    <Divider sx={{ mb: 2.5 }} />
                    <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>🌍 Cuisine</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={3}>
                      {CUISINE_OPTIONS.map(c => (
                        <FilterPill key={c.label} item={c} active={activeCuisine.includes(c.label)} onClick={() => toggleArr(activeCuisine, setActiveCuisine, c.label)} />
                      ))}
                    </Box>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>🍽️ Food Type</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={3}>
                      {FOOD_TYPES.map(f => (
                        <FilterPill key={f.label} item={f} active={activeFoodTypes.includes(f.label)} onClick={() => toggleArr(activeFoodTypes, setActiveFoodTypes, f.label)} />
                      ))}
                    </Box>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>🥦 Dietary Preferences</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {DIET_OPTIONS.map(d => (
                        <FilterPill key={d.label} item={d} active={activeDiet.includes(d.label)} onClick={() => toggleArr(activeDiet, setActiveDiet, d.label)} />
                      ))}
                    </Box>
                    <Box mt={3}>
                      <Typography variant="overline" sx={{ fontWeight: 800, color: "#6b7280", letterSpacing: "0.08em", fontSize: "0.68rem" }}>🎯 Difficulty Level</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {DIFFICULTY_OPTIONS.map(d => (
                          <FilterPill key={d.label} item={d} active={activeDifficulty === d.label} onClick={() => setActiveDifficulty(prev => prev === d.label ? null : d.label)} />
                        ))}
                      </Box>
                    </Box>
                    {totalFilters > 0 && (
                      <Box mt={2}>
                        <Button size="small" onClick={() => { setActiveFoodTypes([]); setActiveDiet([]); setActiveDifficulty(null); setActiveCuisine([]); }}
                          sx={{ color: "#9ca3af", fontSize: "0.75rem" }}>✕ Clear all filters</Button>
                      </Box>
                    )}
                  </Box>
                )}
                {totalFilters > 0 && (
                  <Box px={3} pb={2} display="flex" flexWrap="wrap" gap={0.8} alignItems="center">
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Active filters:</Typography>
                    {[...activeCuisine, ...activeFoodTypes, ...activeDiet, ...(activeDifficulty ? [activeDifficulty] : [])].map(f => (
                      <Chip key={f} label={f} size="small" sx={{ background: "#f0f3ec", color: "#6b8c5a", border: "1px solid #a8c298", fontWeight: 600, fontSize: "0.72rem", height: 22 }} />
                    ))}
                  </Box>
                )}
              </Box>

              {/* ── 3 Tabs ── */}
              <Tabs
                value={recipeTab}
                onChange={(_, v) => setRecipeTab(v)}
                sx={{
                  mb: 3,
                  background: "#fff",
                  borderRadius: 3,
                  border: "1px solid #f3f4f6",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "& .MuiTab-root": { fontWeight: 700, fontSize: "0.85rem", textTransform: "none", py: 2, px: 3 },
                  "& .MuiTabs-indicator": { background: "linear-gradient(90deg, #6b8c5a, #b8714e)", height: 3, borderRadius: "3px 3px 0 0" },
                  "& .Mui-selected": { color: "#6b8c5a !important" },
                }}
              >
                <Tab label="🥦 By Ingredients" />
                <Tab label="🔎 By Name" />
                <Tab label="📊 By Nutrition" />
              </Tabs>

              {/* ══ TAB 0: By Ingredients ══ */}
              {recipeTab === 0 && (
                <Box>
                  {/* Ingredient input */}
                  <Box sx={{ background: "#fff", borderRadius: 3, p: 3, border: "1px solid #f3f4f6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", mb: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
                      <Typography fontWeight={700} color="#374151">📦 Your Ingredients</Typography>
                      <Button size="small" variant="outlined" onClick={() => { setIngredients(pantryItems.filter(i => i.inStock)); showToast("Pantry imported!", "success"); }}
                        sx={{ borderColor: "#b8714e", color: "#b8714e", borderRadius: 2, fontWeight: 700, fontSize: "0.75rem" }}>
                        Import from Pantry
                      </Button>
                    </Box>
                    <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="flex-start">
                      <TextField label="Ingredient" value={inputName}
                        onChange={e => setInputName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addIngredient()}
                        placeholder="e.g. eggs" size="small" sx={{ flex: "1 1 150px", minWidth: 130 }} />
                      <TextField label="Qty" type="number" value={inputQty}
                        onChange={e => setInputQty(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addIngredient()}
                        placeholder="2" size="small" inputProps={{ min: 0, step: "any" }} sx={{ width: 80 }} />
                      <FormControl size="small" sx={{ minWidth: 110 }}>
                        <InputLabel>Unit</InputLabel>
                        <Select value={inputUnit} label="Unit" onChange={e => setInputUnit(e.target.value)}>
                          {UNITS.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}
                        </Select>
                      </FormControl>
                      <Button variant="contained" onClick={addIngredient} startIcon={<AddCircleOutlineIcon />}
                        sx={{ background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", borderRadius: 2, fontWeight: 700, height: 40, boxShadow: "none", "&:hover": { boxShadow: "0 2px 12px rgba(107,140,90,0.3)" } }}>
                        Add
                      </Button>
                    </Box>
                    {/* ── Smart Input Panel ── */}
                    <SmartInputPanel
                      language={language}
                      onAddIngredients={(items) => setIngredients(prev => [
                        ...prev, ...items.map(i => ({ name: i.name || "", qty: i.qty || "", unit: i.unit || "" }))
                      ])}
                    />
                    {ingredients.length === 0 ? (
                      <Box mt={2} py={2} textAlign="center" sx={{ border: "1.5px dashed #f3f4f6", borderRadius: 2 }}>
                        <Typography fontSize="0.85rem" color="text.disabled">No ingredients yet — add some above or import from My Pantry</Typography>
                        <Button size="small" onClick={() => setPage("pantry")} sx={{ mt: 1, color: "#b8714e", fontSize: "0.78rem" }}>Go to My Pantry →</Button>
                      </Box>
                    ) : (
                      <Box mt={1.5} display="flex" flexWrap="wrap" gap={1}>
                        {ingredients.map((ing, idx) => (
                          <Chip key={idx}
                            label={[ing.qty, ing.unit, ing.name].filter(Boolean).join(" ")}
                            onDelete={() => setIngredients(ingredients.filter((_, i) => i !== idx))}
                            deleteIcon={<CloseIcon sx={{ fontSize: "0.85rem !important" }} />}
                            sx={{ background: "#f0f4ec", color: "#6b8c5a", border: "1px solid #a8c298", fontWeight: 600, fontSize: "0.8rem", "& .MuiChip-deleteIcon": { color: "#8aaa7a" } }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <GenerateBtn onClick={generateRecipes} loading={recipeLoading} disabled={!ingredients.length} label="✨ Generate Recipes from Ingredients" />
                  <div id="results-anchor" />

                  {recipeLoading && (
                    <>
                      <SectionHeader accent="lock" icon={<LockIcon sx={{ color: "#b8714e", fontSize: 22 }} />} title="🔒 Cook With Exactly What You Have" subtitle="Generating strict recipes…" />
                      <Grid container spacing={2.5}>{[1,2,3].map(i => <Grid item xs={12} sm={6} md={4} key={i}><SkeletonCard /></Grid>)}</Grid>
                      <SectionHeader accent="bolt" icon={<BoltIcon sx={{ color: "#22c55e", fontSize: 22 }} />} title="⚡ Expand Your Options" subtitle="Generating flexible recipes…" />
                      <Grid container spacing={2.5}>{[1,2,3].map(i => <Grid item xs={12} sm={6} md={4} key={i}><SkeletonCard /></Grid>)}</Grid>
                    </>
                  )}

                  {!recipeLoading && (recipes.strict.length > 0 || recipes.flexible.length > 0) && (
                    <>
                      <SectionHeader accent="lock" icon={<LockIcon sx={{ color: "#b8714e", fontSize: 22 }} />} title="🔒 Cook With Exactly What You Have" subtitle="Recipes use only the exact ingredients you listed — no extras" />
                      <Grid container spacing={2.5}>
                        {recipes.strict.map((r, i) => (
                          <Grid item xs={12} sm={6} md={4} key={i}>
                            <Card sx={cardSx}>
                              <Box onClick={() => fetchDetails(r.title)}>
                                <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
                                  <RecipeImage title={r.title} height={160} />
                                  <Box sx={badgeSx("rgba(184,113,78,0.92)")}>🔒 EXACT MATCH</Box>
                                </Box>
                                <CardContent sx={{ p: 2, pb: 1 }}>
                                  <Typography fontWeight={700} fontSize="0.93rem" color="#1a1a1a" mb={0.5}>{r.title}</Typography>
                                  <Typography variant="body2" color="text.secondary" fontSize="0.82rem">{r.preview}</Typography>
                                </CardContent>
                              </Box>
                              <Box px={2} pb={1.5} display="flex" alignItems="center" justifyContent="space-between" onClick={e => e.stopPropagation()}>
                                <StarRating value={recipeRatings[r.title] || 0} onChange={(v) => setRating(r.title, v)} size={16} />
                                {(recipeRatings[r.title] || 0) > 0 && <Typography variant="caption" color="#c49a3c" fontWeight={700} fontSize="0.65rem">{recipeRatings[r.title]}/5 ⭐</Typography>}
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>

                      <SectionHeader accent="bolt" icon={<BoltIcon sx={{ color: "#22c55e", fontSize: 22 }} />} title="⚡ Expand Your Options" subtitle="Your ingredients as the base — plus smart extras suggested" />
                      <Grid container spacing={2.5}>
                        {recipes.flexible.map((r, i) => (
                          <Grid item xs={12} sm={6} md={4} key={i}>
                            <Card sx={cardSx}>
                              <Box onClick={() => fetchDetails(r.title)}>
                                <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
                                  <RecipeImage title={r.title} height={160} />
                                  <Box sx={badgeSx("rgba(34,197,94,0.92)")}>⚡ EXPANDED</Box>
                                </Box>
                                <CardContent sx={{ p: 2, pb: 1 }}>
                                  <Typography fontWeight={700} fontSize="0.93rem" color="#1a1a1a" mb={0.5}>{r.title}</Typography>
                                  <Typography variant="body2" color="text.secondary" fontSize="0.82rem" mb={1}>{r.preview}</Typography>
                                  {r.missing_ingredients?.length > 0 && (
                                    <Box>
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.64rem" }}>You'll also need:</Typography>
                                      <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                                        {r.missing_ingredients.map((m, idx) => (
                                          <Chip key={idx} label={[m.qty, m.unit, m.name].filter(Boolean).join(" ")} size="small"
                                            sx={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #86efac", fontWeight: 600, fontSize: "0.71rem", height: 22 }} />
                                        ))}
                                      </Box>
                                    </Box>
                                  )}
                                </CardContent>
                              </Box>
                              {r.missing_ingredients?.length > 0 && (
                                <Box px={2} pb={1}>
                                  <Button size="small" startIcon={<ShoppingCartIcon sx={{ fontSize: 14 }} />}
                                    onClick={() => openFlexibleShoppingList(r)}
                                    sx={{ color: "#15803d", fontSize: "0.75rem", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 1.5, py: 0.3 }}>
                                    Shopping List
                                  </Button>
                                </Box>
                              )}
                              <Box px={2} pb={1.5} display="flex" alignItems="center" justifyContent="space-between" onClick={e => e.stopPropagation()}>
                                <StarRating value={recipeRatings[r.title] || 0} onChange={(v) => setRating(r.title, v)} size={16} />
                                {(recipeRatings[r.title] || 0) > 0 && <Typography variant="caption" color="#c49a3c" fontWeight={700} fontSize="0.65rem">{recipeRatings[r.title]}/5 ⭐</Typography>}
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </Box>
              )}

              {/* ══ TAB 1: By Name ══ */}
              {recipeTab === 1 && (
                <Box>
                  <Box sx={{ background: "linear-gradient(135deg, #f0f4ec 0%, #fff 60%)", borderRadius: 4, border: "1.5px solid #b8cead", boxShadow: "0 4px 24px rgba(184,113,78,0.08)", overflow: "hidden", mb: 3 }}>
                    <Box sx={{ background: "linear-gradient(135deg, #161410, #1e2b1a)", px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ width: 38, height: 38, borderRadius: 2, background: "rgba(184,113,78,0.25)", border: "1px solid rgba(184,113,78,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>🔎</Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: "#fff", fontSize: "1rem", lineHeight: 1.2 }}>Generate a Specific Recipe</Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", mt: 0.2 }}>Name any dish — active filters apply strictly. Try "Ramen" + Japanese + Easy.</Typography>
                      </Box>
                    </Box>
                    <Box p={3}>
                      {totalFilters > 0 && (
                        <Box mb={2.5} px={2} py={1.2} sx={{ background: "#f0f3ec", borderRadius: 2, border: "1px solid #a8c298", display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "#6b8c5a", mr: 0.5 }}>🎯 Active filters will be applied:</Typography>
                          {[...activeCuisine, ...activeFoodTypes, ...activeDiet, ...(activeDifficulty ? [activeDifficulty] : [])].map(f => (
                            <Chip key={f} label={f} size="small" sx={{ background: "#f0f4ec", color: "#6b8c5a", border: "1px solid #a8c298", fontWeight: 600, fontSize: "0.7rem", height: 20 }} />
                          ))}
                        </Box>
                      )}
                      <Box display="flex" gap={1.5} alignItems="flex-start" flexWrap="wrap">
                        <TextField value={recipeNameInput} onChange={e => setRecipeNameInput(e.target.value)} onKeyDown={e => e.key === "Enter" && generateByName()}
                          placeholder="e.g. Mayonnaise, Pad Thai, Tiramisu, Butter Chicken…" size="small"
                          sx={{ flex: "1 1 260px", "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
                          InputProps={{
                            startAdornment: <Box component="span" sx={{ mr: 1, fontSize: "1rem" }}>🍽️</Box>,
                            endAdornment: recipeNameInput ? (<IconButton size="small" onClick={() => { setRecipeNameInput(""); setRecipeByName(null); }} sx={{ p: 0.3 }}><CloseIcon sx={{ fontSize: 15, color: "#9ca3af" }} /></IconButton>) : null,
                          }} />
                        <Button variant="contained" onClick={generateByName} disabled={recipeByNameLoading || !recipeNameInput.trim()}
                          sx={{ background: "linear-gradient(135deg, #b8714e, #6b8c5a)", borderRadius: 2, fontWeight: 700, height: 40, boxShadow: "0 4px 14px rgba(107,140,90,0.3)", whiteSpace: "nowrap" }}>
                          {recipeByNameLoading ? <Box display="flex" alignItems="center" gap={1}><CircularProgress size={16} sx={{ color: "#fff" }} /><span>Generating…</span></Box> : "✨ Generate Recipe"}
                        </Button>
                      </Box>
                      <Box mt={1.5} display="flex" flexWrap="wrap" gap={0.8}>
                        {["Mayonnaise","Pad Thai","Tiramisu","Ramen","Guacamole","Pancakes","Biryani","Hummus"].map(s => (
                          <Box key={s} onClick={() => setRecipeNameInput(s)} sx={{
                            px: 1.4, py: 0.4, borderRadius: "20px", cursor: "pointer",
                            background: recipeNameInput === s ? "#f0f4ec" : "#f9fafb",
                            border: `1px solid ${recipeNameInput === s ? "#b8714e" : "#e5e7eb"}`,
                            color: recipeNameInput === s ? "#5a7a48" : "#6b7280",
                            fontSize: "0.75rem", fontWeight: 600, transition: "all 0.15s",
                            "&:hover": { borderColor: "#b8714e", color: "#5a7a48", background: "#f0f4ec" },
                          }}>{s}</Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  <div id="byname-anchor" />

                  {recipeByNameLoading && (
                    <Box sx={{ background: "#fff", borderRadius: 4, border: "1.5px solid #b8cead", overflow: "hidden", mb: 4 }}>
                      <Box sx={{ height: 220, ...shimmerSx }} />
                      <Box p={3}><Box sx={{ height: 20, width: "60%", borderRadius: 1, mb: 2, ...shimmerSx }} /><Box sx={{ height: 14, width: "90%", borderRadius: 1, mb: 1, ...shimmerSx }} /></Box>
                    </Box>
                  )}

                  {recipeByName && !recipeByNameLoading && (
                    <Box sx={{ background: "#fff", borderRadius: 4, border: "1.5px solid #b8cead", boxShadow: "0 8px 32px rgba(184,113,78,0.12)", overflow: "hidden", mb: 4 }}>
                      <Box sx={{ position: "relative", height: 220, overflow: "hidden" }}>
                        <RecipeImage title={recipeByName._title} height={220} />
                        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
                        {recipeByName.filter_notes && (
                          <Box sx={{ position: "absolute", top: 12, left: 12, background: "rgba(107,140,90,0.9)", backdropFilter: "blur(8px)", borderRadius: "8px", px: 1.5, py: 0.5 }}>
                            <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>🎯 {recipeByName.filter_notes}</Typography>
                          </Box>
                        )}
                        {recipeByName.difficulty_label && (
                          <Box sx={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: "8px", px: 1.5, py: 0.5 }}>
                            <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 700 }}>
                              {recipeByName.difficulty_label === "Easy" ? "🟢" : recipeByName.difficulty_label === "Medium" ? "🟡" : "🔴"} {recipeByName.difficulty_label}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
                          <Typography sx={{ fontWeight: 900, fontSize: "1.6rem", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>{recipeByName._title}</Typography>
                        </Box>
                      </Box>
                      <Box p={3}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
                          <Box display="flex" gap={1.5} flexWrap="wrap">
                            {[{ icon: "🍽️", val: recipeByName.servings, label: "Servings" }, { icon: "⏱️", val: recipeByName.prep_time, label: "Prep" }, { icon: "🔥", val: recipeByName.cook_time, label: "Cook" }].filter(m => m.val).map((m, i) => (
                              <Box key={i} sx={{ background: "#f0f4ec", borderRadius: 2, px: 2, py: 1, border: "1px solid #b8cead", textAlign: "center" }}>
                                <Typography fontSize="1.1rem">{m.icon}</Typography>
                                <Typography fontWeight={700} fontSize="0.85rem">{m.val}</Typography>
                                <Typography variant="caption" color="text.secondary">{m.label}</Typography>
                              </Box>
                            ))}
                          </Box>
                          <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
                            <Button variant="outlined" startIcon={<BookmarkBorderIcon />}
                              onClick={() => {
                                if (savedRecipes.find(r => r._title === recipeByName._title)) { showToast("Already saved!", "error"); return; }
                                const updated = [...savedRecipes, recipeByName];
                                setSavedRecipes(updated);
                                localStorage.setItem("savedRecipes", JSON.stringify(updated));
                                showToast(`"${recipeByName._title}" saved! 📖`, "success");
                              }}
                              sx={{ borderColor: "#b8714e", color: "#b8714e", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#f0f4ec" } }}>
                              Save Recipe
                            </Button>
                            <Button variant="outlined" startIcon={<DownloadIcon />}
                              onClick={() => exportRecipePDF(recipeByName)}
                              sx={{ borderColor: "#22c55e", color: "#15803d", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#f0fdf4" } }}>
                              Download PDF
                            </Button>
                            <Box display="flex" alignItems="center" gap={1} onClick={e => e.stopPropagation()}>
                              <StarRating value={recipeRatings[recipeByName._title] || 0} onChange={(v) => setRating(recipeByName._title, v)} size={20} />
                              {(recipeRatings[recipeByName._title] || 0) > 0 && <Typography variant="caption" color="#c49a3c" fontWeight={700}>{recipeRatings[recipeByName._title]}/5</Typography>}
                            </Box>
                          </Box>
                        </Box>
                        <RecipeAudioPlayer recipe={recipeByName} language={language} />
                        <Box mb={3} p={2} sx={{ background: "#f0f4ec", borderRadius: 2, border: "1px solid #b8cead" }}>
                          <Typography fontWeight={800} fontSize="0.8rem" color="#5a7a48" mb={0.5} sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>Overview</Typography>
                          <Typography color="#374151" fontSize="0.92rem" lineHeight={1.6}>{recipeByName.overview}</Typography>
                        </Box>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={5}>
                            <Typography variant="h6" fontWeight={800} mb={1} color="#1a1a1a">🧂 Ingredients</Typography>

                            {/* Pantry summary bar */}
                            {(() => {
                              const ings = recipeByName.ingredients?.main || [];
                              const inPantryCount = ings.filter(i => isInPantryFuzzy(i.name)).length;
                              const missing = ings.filter(i => !isInPantryFuzzy(i.name));
                              return (
                                <Box display="flex" alignItems="center" gap={1} mb={1.5} flexWrap="wrap">
                                  <Chip
                                    label={`● ${inPantryCount}/${ings.length} in pantry`}
                                    size="small"
                                    sx={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #86efac", fontWeight: 700, fontSize: "0.72rem" }}
                                  />
                                  {missing.length > 0 && (
                                    <Chip
                                      icon={<AddShoppingCartIcon sx={{ fontSize: "14px !important" }} />}
                                      label={`ADD ${missing.length} MISSING TO GROCERY LIST`}
                                      size="small"
                                      onClick={() => addAllMissingToGrocery(ings)}
                                      sx={{
                                        background: "#fff", color: "#1d4ed8",
                                        border: "1.5px solid #93c5fd", fontWeight: 700, fontSize: "0.68rem",
                                        cursor: "pointer",
                                        "&:hover": { background: "#eff6ff" },
                                      }}
                                    />
                                  )}
                                </Box>
                              );
                            })()}

                            {/* Ingredient rows */}
                            <Box sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #f3f4f6" }}>
                              {recipeByName.ingredients?.main?.map((ing, idx) => {
                                const inPantry  = isInPantryFuzzy(ing.name);
                                const inGrocery = isInGroceryList(ing.name);
                                return (
                                  <Box key={idx} sx={{
                                    px: 2, py: 1.2,
                                    display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap",
                                    borderBottom: idx < (recipeByName.ingredients.main.length - 1) ? "1px solid #f9fafb" : "none",
                                    background: inPantry ? "#f0fdf4" : inGrocery ? "#eff6ff" : "#fff",
                                    transition: "background 0.15s",
                                  }}>
                                    {/* Status dot */}
                                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: inPantry ? "#22c55e" : inGrocery ? "#3b82f6" : "#e5e7eb" }} />

                                    {/* Name + qty */}
                                    <Typography fontSize="0.88rem" flex={1} fontWeight={inPantry ? 600 : 400} color={inPantry ? "#15803d" : "#374151"}>
                                      <Box component="span" fontWeight={700}>{ing.quantity} </Box>{ing.name}
                                    </Typography>

                                    {/* Badges + actions */}
                                    <Box display="flex" alignItems="center" gap={0.8} flexShrink={0}>
                                      {inPantry ? (
                                        <Chip label="✓ In pantry" size="small" sx={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", fontWeight: 700, fontSize: "0.65rem", height: 20 }} />
                                      ) : inGrocery ? (
                                        <>
                                          <Chip label="🛒 In grocery list" size="small" sx={{ background: "#dbeafe", color: "#1d4ed8", border: "1px solid #93c5fd", fontWeight: 700, fontSize: "0.65rem", height: 20 }} />
                                          <Tooltip title="Remove from grocery list">
                                            <IconButton size="small" onClick={() => removeFromGroceryList(ing.name)}
                                              sx={{ color: "#93c5fd", "&:hover": { color: "#6b8c5a" }, p: 0.3 }}>
                                              <RemoveShoppingCartIcon sx={{ fontSize: 13 }} />
                                            </IconButton>
                                          </Tooltip>
                                        </>
                                      ) : (
                                        <>
                                          <Tooltip title="Add to pantry">
                                            <IconButton size="small" onClick={() => addIngredientToPantry(ing)}
                                              sx={{ color: "#d1d5db", "&:hover": { color: "#22c55e", background: "#f0fdf4" }, p: 0.4, borderRadius: 1 }}>
                                              <InventoryIcon sx={{ fontSize: 14 }} />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Add to grocery list">
                                            <IconButton size="small" onClick={() => addToGroceryList(ing)}
                                              sx={{ color: "#d1d5db", "&:hover": { color: "#3b82f6", background: "#eff6ff" }, p: 0.4, borderRadius: 1 }}>
                                              <AddShoppingCartIcon sx={{ fontSize: 14 }} />
                                            </IconButton>
                                          </Tooltip>
                                        </>
                                      )}
                                      <Tooltip title={`Substitute ${ing.name}`}>
                                        <IconButton size="small" onClick={() => setSubModal({ open: true, ingredient: ing.name })}
                                          sx={{ color: "#d1d5db", "&:hover": { color: "#b8714e" }, p: 0.4 }}>
                                          <SwapHorizIcon sx={{ fontSize: 14 }} />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={7}>
                            <Typography variant="h6" fontWeight={800} mb={1.5} color="#1a1a1a">👨‍🍳 Instructions</Typography>
                            <Box>
                              {recipeByName.steps?.map((s, idx) => (
                                <Box key={idx} display="flex" gap={1.5} mb={1.5}>
                                  <Box sx={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #b8714e, #6b8c5a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.72rem", fontWeight: 800, mt: 0.1 }}>{idx + 1}</Box>
                                  <Typography fontSize="0.9rem" color="#374151" lineHeight={1.6}>{typeof s === "string" ? s : s.text}</Typography>
                                </Box>
                              ))}
                            </Box>
                          </Grid>
                        </Grid>
                        {recipeByName.nutrition && (
                          <Box mt={3} pt={3} sx={{ borderTop: "1px solid #f3f4f6" }}>
                            <Typography fontWeight={800} mb={1.5} color="#1a1a1a">📊 Nutrition (per serving)</Typography>
                            <Box display="flex" gap={1.5} flexWrap="wrap">
                              {[
                                { label: "Calories", val: recipeByName.nutrition.calories, bg: "#f0f4ec", border: "#b8cead", color: "#5a7a48" },
                                { label: "Protein",  val: recipeByName.nutrition.protein,  bg: "#f0fdf4", border: "#86efac", color: "#15803d" },
                                { label: "Carbs",    val: recipeByName.nutrition.carbs,    bg: "#eff6ff", border: "#93c5fd", color: "#1d4ed8" },
                                { label: "Fat",      val: recipeByName.nutrition.fat,      bg: "#fdf4ff", border: "#d8b4fe", color: "#7e22ce" },
                              ].filter(n => n.val).map((n, i) => (
                                <Box key={i} sx={{ background: n.bg, border: `1px solid ${n.border}`, borderRadius: 2, px: 2, py: 1, textAlign: "center", minWidth: 80 }}>
                                  <Typography fontWeight={800} fontSize="1rem" color={n.color}>{n.val}</Typography>
                                  <Typography variant="caption" color="text.secondary">{n.label}</Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* ══ TAB 2: By Nutrition ══ */}
              {recipeTab === 2 && (
                <Box>
                  <Box sx={{ background: "linear-gradient(135deg, #f0fdf4 0%, #fff 60%)", borderRadius: 4, border: "1.5px solid #86efac", boxShadow: "0 4px 24px rgba(34,197,94,0.08)", overflow: "hidden", mb: 3 }}>
                    <Box sx={{ background: "linear-gradient(135deg, #052e16, #14532d)", px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ width: 38, height: 38, borderRadius: 2, background: "rgba(34,197,94,0.25)", border: "1px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>📊</Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: "#fff", fontSize: "1rem", lineHeight: 1.2 }}>Generate by Nutrition Targets</Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", mt: 0.2 }}>
                          Set your macro goals — Fridgely finds recipes that match. Enter any combination of targets.
                        </Typography>
                      </Box>
                    </Box>
                    <Box p={3}>
                      {totalFilters > 0 && (
                        <Box mb={2.5} px={2} py={1.2} sx={{ background: "#f0fdf4", borderRadius: 2, border: "1px solid #86efac", display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "#15803d", mr: 0.5 }}>🎯 Active filters will be applied:</Typography>
                          {[...activeCuisine, ...activeFoodTypes, ...activeDiet, ...(activeDifficulty ? [activeDifficulty] : [])].map(f => (
                            <Chip key={f} label={f} size="small" sx={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", fontWeight: 600, fontSize: "0.7rem", height: 20 }} />
                          ))}
                        </Box>
                      )}

                      {/* Nutrition target inputs */}
                      <Grid container spacing={2} mb={3}>
                        {[
                          { key: "calories", label: "Calories", unit: "kcal", icon: "🔥", color: "#5a7a48", bg: "#f0f4ec", border: "#b8cead", placeholder: "e.g. 500" },
                          { key: "protein",  label: "Protein",  unit: "g",    icon: "💪", color: "#15803d", bg: "#f0fdf4", border: "#86efac", placeholder: "e.g. 30" },
                          { key: "carbs",    label: "Carbs",    unit: "g",    icon: "🌾", color: "#1d4ed8", bg: "#eff6ff", border: "#93c5fd", placeholder: "e.g. 60" },
                          { key: "fat",      label: "Fat",      unit: "g",    icon: "🥑", color: "#7e22ce", bg: "#fdf4ff", border: "#d8b4fe", placeholder: "e.g. 15" },
                          { key: "fiber",    label: "Fiber",    unit: "g",    icon: "🥦", color: "#0f766e", bg: "#f0fdfa", border: "#99f6e4", placeholder: "e.g. 8"  },
                        ].map(field => (
                          <Grid item xs={6} sm={4} md={2.4} key={field.key}>
                            <Box sx={{ background: field.bg, border: `1.5px solid ${field.border}`, borderRadius: 3, p: 2, textAlign: "center" }}>
                              <Typography fontSize="1.5rem" mb={0.5}>{field.icon}</Typography>
                              <Typography fontWeight={800} fontSize="0.82rem" color={field.color} mb={1}>{field.label}</Typography>
                              <TextField
                                value={nutritionTargets[field.key]}
                                onChange={e => setNutritionTargets(prev => ({ ...prev, [field.key]: e.target.value }))}
                                onKeyDown={e => e.key === "Enter" && generateByNutrition()}
                                placeholder={field.placeholder}
                                size="small"
                                type="number"
                                inputProps={{ min: 0, step: 1 }}
                                sx={{ "& .MuiOutlinedInput-root": { background: "#fff", borderRadius: 2 }, "& input": { textAlign: "center", fontWeight: 700, fontSize: "1rem", color: field.color } }}
                              />
                              <Typography variant="caption" color="text.secondary" mt={0.5} display="block">{field.unit} per serving</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Quick presets */}
                      <Box mb={3}>
                        <Typography variant="caption" fontWeight={700} color="#6b7280" sx={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>Quick Presets</Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {[
                            { label: "High Protein",    values: { calories: "400", protein: "40", carbs: "30", fat: "12", fiber: "8"  } },
                            { label: "Low Carb / Keto", values: { calories: "450", protein: "30", carbs: "10", fat: "35", fiber: "5"  } },
                            { label: "Balanced Meal",   values: { calories: "500", protein: "25", carbs: "55", fat: "15", fiber: "10" } },
                            { label: "Light & Lean",    values: { calories: "300", protein: "20", carbs: "35", fat: "8",  fiber: "6"  } },
                            { label: "Bulking",         values: { calories: "700", protein: "50", carbs: "80", fat: "20", fiber: "12" } },
                          ].map(preset => (
                            <Box key={preset.label} onClick={() => setNutritionTargets(preset.values)} sx={{
                              px: 1.6, py: 0.5, borderRadius: "20px", cursor: "pointer",
                              background: JSON.stringify(nutritionTargets) === JSON.stringify(preset.values) ? "#f0fdf4" : "#f9fafb",
                              border: `1px solid ${JSON.stringify(nutritionTargets) === JSON.stringify(preset.values) ? "#22c55e" : "#e5e7eb"}`,
                              color: JSON.stringify(nutritionTargets) === JSON.stringify(preset.values) ? "#15803d" : "#6b7280",
                              fontSize: "0.78rem", fontWeight: 600, transition: "all 0.15s",
                              "&:hover": { borderColor: "#22c55e", color: "#15803d", background: "#f0fdf4" },
                            }}>{preset.label}</Box>
                          ))}
                        </Box>
                      </Box>

                      <Button variant="contained" fullWidth size="large"
                        onClick={generateByNutrition}
                        disabled={nutritionLoading || (!nutritionTargets.calories && !nutritionTargets.protein && !nutritionTargets.carbs && !nutritionTargets.fat && !nutritionTargets.fiber)}
                        sx={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: 3, py: 1.6, fontSize: "1rem", fontWeight: 800, boxShadow: "0 4px 20px rgba(34,197,94,0.3)", "&:hover": { boxShadow: "0 6px 28px rgba(34,197,94,0.45)" } }}>
                        {nutritionLoading
                          ? <Box display="flex" alignItems="center" gap={1.5}><CircularProgress size={20} sx={{ color: "#fff" }} /><span>Finding matching recipes…</span></Box>
                          : "📊 Find Matching Recipes"}
                      </Button>
                    </Box>
                  </Box>

                  <div id="nutrition-anchor" />

                  {/* Nutrition results */}
                  {nutritionLoading && (
                    <Grid container spacing={2.5}>{[1,2,3,4].map(i => <Grid item xs={12} sm={6} key={i}><SkeletonCard /></Grid>)}</Grid>
                  )}

                  {!nutritionLoading && nutritionRecipes.length > 0 && (
                    <>
                      <Box mb={2} display="flex" alignItems="center" gap={1.5}>
                        <Typography fontWeight={800} fontSize="1.1rem" color="#15803d">✅ {nutritionRecipes.length} Matching Recipes Found</Typography>
                        <Typography variant="caption" color="text.secondary">sorted by best macro match</Typography>
                      </Box>
                      <Grid container spacing={2.5}>
                        {nutritionRecipes.map((r, i) => (
                          <Grid item xs={12} sm={6} key={i}>
                            <Card sx={{ ...cardSx, "&:hover": { borderColor: "#86efac", boxShadow: "0 8px 24px rgba(34,197,94,0.14)" } }}>
                              <Box onClick={() => fetchDetails(r.title)}>
                                <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
                                  <RecipeImage title={r.title} height={160} />
                                  <Box sx={{ ...badgeSx("rgba(34,197,94,0.92)") }}>📊 NUTRITION MATCH</Box>
                                </Box>
                                <CardContent sx={{ p: 2, pb: 1 }}>
                                  <Typography fontWeight={700} fontSize="0.93rem" color="#1a1a1a" mb={0.3}>{r.title}</Typography>
                                  <Typography variant="body2" color="text.secondary" fontSize="0.82rem" mb={1.5}>{r.preview}</Typography>
                                  {/* Macro chips */}
                                  <Box display="flex" flexWrap="wrap" gap={0.7} mb={1}>
                                    {r.calories && <Chip label={`🔥 ${r.calories} kcal`} size="small" sx={{ background: "#f0f4ec", color: "#5a7a48", border: "1px solid #b8cead", fontWeight: 700, fontSize: "0.7rem", height: 22 }} />}
                                    {r.protein_g && <Chip label={`💪 ${r.protein_g}g protein`} size="small" sx={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #86efac", fontWeight: 700, fontSize: "0.7rem", height: 22 }} />}
                                    {r.carbs_g && <Chip label={`🌾 ${r.carbs_g}g carbs`} size="small" sx={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #93c5fd", fontWeight: 700, fontSize: "0.7rem", height: 22 }} />}
                                    {r.fat_g && <Chip label={`🥑 ${r.fat_g}g fat`} size="small" sx={{ background: "#fdf4ff", color: "#7e22ce", border: "1px solid #d8b4fe", fontWeight: 700, fontSize: "0.7rem", height: 22 }} />}
                                    {r.fiber_g && <Chip label={`🥦 ${r.fiber_g}g fiber`} size="small" sx={{ background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4", fontWeight: 700, fontSize: "0.7rem", height: 22 }} />}
                                  </Box>
                                  {r.match_note && (
                                    <Box px={1.5} py={0.8} sx={{ background: "#f0fdf4", borderRadius: 1.5, border: "1px solid #bbf7d0" }}>
                                      <Typography fontSize="0.75rem" color="#15803d" fontWeight={600}>✓ {r.match_note}</Typography>
                                    </Box>
                                  )}
                                </CardContent>
                              </Box>
                              <Box px={2} pb={1.5} display="flex" alignItems="center" justifyContent="space-between" onClick={e => e.stopPropagation()}>
                                <StarRating value={recipeRatings[r.title] || 0} onChange={(v) => setRating(r.title, v)} size={16} />
                                {(recipeRatings[r.title] || 0) > 0 && <Typography variant="caption" color="#c49a3c" fontWeight={700} fontSize="0.65rem">{recipeRatings[r.title]}/5 ⭐</Typography>}
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </Box>
              )}

            </Box>
          </Box>
        )}
        {/* ══ MEAL PLANNER ══ */}
        {page === "planner" && (
          <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0f2f5 0%, #e8edf5 45%, #f0f2f5 100%)", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "fixed", top: 60, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.11) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
            <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.3, backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

            <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(125deg, #03071e 0%, #06245c 40%, #0a3580 70%, #1d4ed8 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
              <Box sx={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(135deg, #60a5fa 0px, #60a5fa 1px, transparent 1px, transparent 18px)" }} />
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
                  <Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(96,165,250,0.2)", border: "1px solid rgba(96,165,250,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 6px #60a5fa" }} />
                      <Typography sx={{ color: "#93c5fd", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Meal Planner</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>📅 Meal Planner</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", maxWidth: 520 }}>Generate 5-day meal plans with shopping list and nutrition analysis</Typography>
                  </Box>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.8 }}>
                      Plan Language
                    </Typography>
                    <LanguagePill value={language} onChange={setLanguage} accentColor="#3b82f6" accentBg="#eff6ff" />
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box p={4} maxWidth={1000} mx="auto" sx={{ position: "relative", zIndex: 1 }}>
              <Tabs value={mpTab} onChange={(_, v) => setMpTab(v)} sx={{
                mb: 3, background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6",
                "& .MuiTab-root": { fontWeight: 700, fontSize: "0.85rem", textTransform: "none", py: 1.8 },
                "& .MuiTabs-indicator": { background: "#3b82f6" },
              }}>
                <Tab label="🧺 Cook from Selection" />
                <Tab label="🗄️ Full Pantry Plan" />
              </Tabs>

              {/* ── Tab 1: Pick specific items from pantry ── */}
              {mpTab === 0 && (
                <Box>
                  {/* Explain */}
                  <Box sx={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 3, px: 3, py: 2, mb: 3, display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Typography fontSize="1.3rem" flexShrink={0}>🧺</Typography>
                    <Box>
                      <Typography fontWeight={700} color="#1d4ed8" fontSize="0.92rem">Cook from a selection</Typography>
                      <Typography color="#3b82f6" fontSize="0.82rem" mt={0.3}>
                        Tick the specific pantry items you want to cook with today. Only the checked items will be used to generate your meal plan.
                      </Typography>
                    </Box>
                  </Box>

                  {/* Pantry item checklist */}
                  <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden", mb: 2 }}>
                    <Box px={3} py={1.8} sx={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                      <Typography fontWeight={700} color="#374151" fontSize="0.9rem">
                        Select items from My Pantry
                        {mpSelectedPantryIdxs.length > 0 && (
                          <Box component="span" sx={{ ml: 1.5, background: "#3b82f6", color: "#fff", borderRadius: "10px", px: 1, py: 0.1, fontSize: "0.7rem", fontWeight: 800 }}>
                            {mpSelectedPantryIdxs.length} selected
                          </Box>
                        )}
                      </Typography>
                      <Box display="flex" gap={1} alignItems="center">
                        {/* Voice select: speak item name → auto-checks matching pantry item */}
                        <Tooltip title="Say an ingredient name to select it" arrow>
                          <Box display="flex" alignItems="center" gap={0.5} sx={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 2, px: 1.2, py: 0.4 }}>

                          </Box>
                        </Tooltip>

                        {mpSelectedPantryIdxs.length > 0 && (
                          <Button size="small" onClick={() => setMpSelectedPantryIdxs([])} sx={{ color: "#9ca3af", fontSize: "0.72rem" }}>Deselect all</Button>
                        )}
                        {pantryItems.filter(i => i.inStock).length > 0 && (
                          <Button size="small" onClick={() => setMpSelectedPantryIdxs(pantryItems.map((_, i) => i).filter(i => pantryItems[i].inStock))}
                            sx={{ color: "#3b82f6", fontSize: "0.72rem" }}>Select all</Button>
                        )}
                      </Box>
                    </Box>

                    {pantryItems.filter(i => i.inStock).length === 0 ? (
                      <Box py={5} textAlign="center">
                        <Typography fontSize="2rem" mb={1}>🗄️</Typography>
                        <Typography fontWeight={600} color="#374151" mb={0.5}>Your pantry is empty</Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>Add items in My Pantry first, then come back to select what to cook with.</Typography>
                        <Button variant="outlined" size="small" onClick={() => setPage("pantry")}
                          sx={{ borderColor: "#3b82f6", color: "#3b82f6", borderRadius: 2, fontWeight: 700 }}>
                          Go to My Pantry →
                        </Button>
                      </Box>
                    ) : (
                      pantryItems.map((item, idx) => {
                        if (!item.inStock) return null;
                        const checked = mpSelectedPantryIdxs.includes(idx);
                        return (
                          <Box key={idx}
                            onClick={() => setMpSelectedPantryIdxs(prev =>
                              checked ? prev.filter(i => i !== idx) : [...prev, idx]
                            )}
                            sx={{
                              px: 3, py: 1.4, display: "flex", alignItems: "center", gap: 2,
                              borderBottom: "1px solid #f9fafb", cursor: "pointer",
                              background: checked ? "#eff6ff" : "transparent",
                              transition: "background 0.15s",
                              "&:hover": { background: checked ? "#dbeafe" : "#f9fafb" },
                            }}>
                            <Box sx={{
                              width: 20, height: 20, borderRadius: 1, flexShrink: 0,
                              border: `2px solid ${checked ? "#3b82f6" : "#d1d5db"}`,
                              background: checked ? "#3b82f6" : "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.15s",
                            }}>
                              {checked && <Typography sx={{ color: "#fff", fontSize: "0.72rem", fontWeight: 900, lineHeight: 1 }}>✓</Typography>}
                            </Box>
                            <Typography fontSize="0.9rem" color="#374151" flex={1}>
                              <Box component="span" fontWeight={700}>{[item.qty, item.unit].filter(Boolean).join(" ")}</Box>
                              {" "}{item.name}
                            </Typography>
                            {checked && (
                              <Chip label="Selected" size="small" sx={{ background: "#dbeafe", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 700, fontSize: "0.68rem", height: 20 }} />
                            )}
                          </Box>
                        );
                      })
                    )}
                  </Box>

                  {mpSelectedPantryIdxs.length > 0 && (
                    <Box mb={2} px={2} py={1.5} sx={{ background: "#f0fdf4", borderRadius: 2, border: "1px solid #86efac", display: "flex", flexWrap: "wrap", gap: 0.8, alignItems: "center" }}>
                      <Typography variant="caption" fontWeight={700} color="#15803d" mr={0.5}>Cooking with:</Typography>
                      {mpSelectedPantryIdxs.map(idx => (
                        <Chip key={idx}
                          label={[pantryItems[idx]?.qty, pantryItems[idx]?.unit, pantryItems[idx]?.name].filter(Boolean).join(" ")}
                          size="small"
                          sx={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", fontWeight: 600, fontSize: "0.72rem", height: 22 }} />
                      ))}
                    </Box>
                  )}

                  <FiltersPanel
                    activeFoodTypes={mpPantryFoodTypes} setActiveFoodTypes={setMpPantryFoodTypes}
                    activeDiet={mpPantryDiet} setActiveDiet={setMpPantryDiet}
                    activeDifficulty={mpPantryDifficulty} setActiveDifficulty={setMpPantryDifficulty}
                    activeCuisine={mpPantryCuisine} setActiveCuisine={setMpPantryCuisine}
                    subtitle="applied to all 5 days"
                  />
                  {/* Add more pantry items via Smart Input */}
                  <SmartInputPanel
                    language={language}
                    accentColor="#3b82f6"
                    onAddIngredients={(items) => {
                      setPantryItems(prev => {
                        const newItems = items.map(i => ({ name: i.name || "", qty: i.qty || "", unit: i.unit || "", inStock: true }));
                        const updated = [...prev, ...newItems];
                        const newIdxs = newItems.map((_, j) => prev.length + j);
                        setMpSelectedPantryIdxs(sel => [...new Set([...sel, ...newIdxs])]);
                        return updated;
                      });
                      showToast(`Added ${items.length} item${items.length !== 1 ? "s" : ""} to pantry & selected ✓`, "success");
                    }}
                  />

                  <GenerateBtn onClick={generatePantryPlan} loading={mpPantryLoading} disabled={!mpSelectedPantryIdxs.length} label="🧺 Generate Plan from Selection" />
                  {/* Calorie Budget */}
                  <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", p: 2.5, mb: 2, mt: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1.5}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontSize="1rem">🔥</Typography>
                        <Box>
                          <Typography fontWeight={700} fontSize="0.9rem" color="#374151">Daily Calorie Budget</Typography>
                          <Typography variant="caption" color="text.secondary">Distributes across all 4 meals</Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                        <TextField
                          value={calorieBudget}
                          onChange={e => setCalorieBudget(e.target.value)}
                          placeholder="e.g. 1800"
                          size="small"
                          type="number"
                          inputProps={{ min: 500, max: 5000, step: 100 }}
                          sx={{ width: 120, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          InputProps={{ endAdornment: <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>kcal</Typography> }}
                        />
                        <Box display="flex" gap={0.8}>
                          {[1500, 1800, 2000, 2500].map(cal => (
                            <Box key={cal} onClick={() => setCalorieBudget(String(cal))} sx={{
                              px: 1.2, py: 0.4, borderRadius: "20px", cursor: "pointer", fontSize: "0.72rem", fontWeight: 700,
                              background: calorieBudget === String(cal) ? "#f0f4ec" : "#f9fafb",
                              border: `1px solid ${calorieBudget === String(cal) ? "#b8714e" : "#e5e7eb"}`,
                              color: calorieBudget === String(cal) ? "#5a7a48" : "#9ca3af",
                              "&:hover": { borderColor: "#b8714e", color: "#5a7a48" },
                            }}>{cal}</Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                    {calorieBudget && (
                      <Box mt={1.5} display="flex" flexWrap="wrap" gap={1}>
                        {[
                          { label: "Breakfast", pct: 25, color: "#b8714e" },
                          { label: "Lunch",     pct: 35, color: "#22c55e" },
                          { label: "Dinner",    pct: 30, color: "#3b82f6" },
                          { label: "Snack",     pct: 10, color: "#a855f7" },
                        ].map(m => (
                          <Chip key={m.label} size="small"
                            label={`${m.label}: ~${Math.round(Number(calorieBudget) * m.pct / 100)} kcal`}
                            sx={{ background: "#f9fafb", border: `1px solid ${m.color}33`, color: m.color, fontWeight: 700, fontSize: "0.72rem" }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                  <div id="pantry-plan-anchor" />
                  <MealPlanGrid plan={mpPantryPlan} onViewRecipe={fetchDetails} recipeRatings={recipeRatings} onRate={setRating}
                    onSwap={(day, meal) => swapMeal(mpPantryPlan, setMpPantryPlan, day, meal,
                      { cuisine: mpPantryCuisine, foodTypes: mpPantryFoodTypes, diet: mpPantryDiet, difficulty: mpPantryDifficulty },
                      mpSelectedPantryIdxs.map(idx => pantryItems[idx]).filter(Boolean)
                    )}
                    swapping={swapping}
                  />
                  {mpPantryPlan.length > 0 && (
                    <>
 <Box mt={3} display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
  <Button startIcon={<ShoppingCartIcon />} variant="outlined"
    onClick={() => openShoppingList(mpPantryPlan, "Selection Plan Shopping List")}
    sx={{ borderColor: "#3b82f6", color: "#3b82f6", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#eff6ff" } }}>
    Shopping List
  </Button>
  <Button startIcon={<DownloadIcon />} variant="outlined"
    onClick={() => exportMealPlanPDF(mpPantryPlan, "Pantry Selection Meal Plan")}
    sx={{ borderColor: "#22c55e", color: "#15803d", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#f0fdf4" } }}>
    Download PDF
  </Button>
</Box>
                      <NutritionDashboard plan={mpPantryPlan} />
                    </>
                  )}
                </Box>
              )}

              {/* ── Tab 2: Full Pantry Plan (all in-stock items) ── */}
              {mpTab === 1 && (
                <Box>
                  {/* Explain */}
                  <Box sx={{ background: "#f0f4ec", border: "1px solid #b8cead", borderRadius: 3, px: 3, py: 2, mb: 3, display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Typography fontSize="1.3rem" flexShrink={0}>🗄️</Typography>
                    <Box flex={1}>
                      <Typography fontWeight={700} color="#5a7a48" fontSize="0.92rem">Full Pantry Plan</Typography>
                      <Typography color="#a06040" fontSize="0.82rem" mt={0.3}>
                        Uses <strong>everything currently in stock</strong> in your pantry to generate the most comprehensive 5-day meal plan. Keep your pantry updated and regenerate anytime.
                      </Typography>
                    </Box>
                    <Button size="small" variant="outlined" onClick={() => setPage("pantry")}
                      sx={{ borderColor: "#b8714e", color: "#b8714e", borderRadius: 2, fontWeight: 700, fontSize: "0.72rem", flexShrink: 0, "&:hover": { background: "#f0f4ec" } }}>
                      Update Pantry →
                    </Button>
                  </Box>

                  {/* Live pantry snapshot */}
                  <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden", mb: 2 }}>
                    <Box px={3} py={1.8} sx={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography fontWeight={700} color="#374151" fontSize="0.9rem">
                        Current pantry snapshot
                        <Box component="span" sx={{ ml: 1.5, background: pantryItems.filter(i => i.inStock).length > 0 ? "#b8714e" : "#d1d5db", color: "#fff", borderRadius: "10px", px: 1, py: 0.1, fontSize: "0.7rem", fontWeight: 800 }}>
                          {pantryItems.filter(i => i.inStock).length} in stock
                        </Box>
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontSize="0.72rem">auto-updated from My Pantry</Typography>
                    </Box>

                    {pantryItems.filter(i => i.inStock).length === 0 ? (
                      <Box py={5} textAlign="center">
                        <Typography fontSize="2rem" mb={1}>🗄️</Typography>
                        <Typography fontWeight={600} color="#374151" mb={0.5}>Pantry is empty</Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>Add and track items in My Pantry. This tab will automatically pick them all up.</Typography>
                        <Button variant="outlined" size="small" onClick={() => setPage("pantry")}
                          sx={{ borderColor: "#b8714e", color: "#b8714e", borderRadius: 2, fontWeight: 700 }}>
                          Go to My Pantry →
                        </Button>
                      </Box>
                    ) : (
                      <Box display="flex" flexWrap="wrap" gap={1} p={2.5}>
                        {pantryItems.filter(i => i.inStock).map((item, idx) => (
                          <Chip key={idx}
                            label={[item.qty, item.unit, item.name].filter(Boolean).join(" ")}
                            sx={{ background: "#f0f4ec", color: "#5a7a48", border: "1px solid #b8cead", fontWeight: 600, fontSize: "0.78rem" }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <FiltersPanel
                    activeFoodTypes={mpGroceryFoodTypes} setActiveFoodTypes={setMpGroceryFoodTypes}
                    activeDiet={mpGroceryDiet} setActiveDiet={setMpGroceryDiet}
                    activeDifficulty={mpGroceryDifficulty} setActiveDifficulty={setMpGroceryDifficulty}
                    activeCuisine={mpGroceryCuisine} setActiveCuisine={setMpGroceryCuisine}
                    subtitle="applied to all 5 days"
                  />
                  <GenerateBtn onClick={generateGroceryPlan} loading={mpGroceryLoading} disabled={pantryItems.filter(i => i.inStock).length === 0} label="🗄️ Generate Full Pantry Plan" />
                  <div id="grocery-plan-anchor" />
                  <MealPlanGrid plan={mpGroceryPlan} onViewRecipe={fetchDetails} recipeRatings={recipeRatings} onRate={setRating}
                    onSwap={(day, meal) => swapMeal(mpGroceryPlan, setMpGroceryPlan, day, meal,
                      { cuisine: mpGroceryCuisine, foodTypes: mpGroceryFoodTypes, diet: mpGroceryDiet, difficulty: mpGroceryDifficulty },
                      pantryItems.filter(i => i.inStock)
                    )}
                    swapping={swapping}
                  />
                  {mpGroceryPlan.length > 0 && (
                    <>
 <Box mt={3} display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
  <Button startIcon={<ShoppingCartIcon />} variant="outlined"
    onClick={() => openShoppingList(mpGroceryPlan, "Full Pantry Plan Shopping List")}
    sx={{ borderColor: "#3b82f6", color: "#3b82f6", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#eff6ff" } }}>
    Shopping List
  </Button>
  <Button startIcon={<DownloadIcon />} variant="outlined"
    onClick={() => exportMealPlanPDF(mpGroceryPlan, "Full Pantry Meal Plan")}
    sx={{ borderColor: "#22c55e", color: "#15803d", borderRadius: 2, fontWeight: 700, "&:hover": { background: "#f0fdf4" } }}>
    Download PDF
  </Button>
</Box>
                      <NutritionDashboard plan={mpGroceryPlan} />
                    </>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* ══ MY PANTRY ══ */}
        {page === "pantry" && (
          <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0f4ec 0%, #fef3e2 45%, #fffbeb 100%)", position: "relative", overflow: "hidden" }}>
            <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.35, backgroundImage: "radial-gradient(circle, #8faa7c 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(125deg, #141210 0%, #1e1a10 40%, #2a2016 70%, #332c14 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
              <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 3 }}>
                <Box>
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#d4aa4a" }} />
                    <Typography sx={{ color: "#e8d48a", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Pantry Manager</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>🗄️ My Pantry</Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
                    {pantryItems.length} items · {pantryItems.filter(i => i.inStock).length} in stock
                  </Typography>
                </Box>
                <Box display="flex" alignItems="flex-end" gap={2} flexWrap="wrap">
                  {/* Language selector */}
                  <Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.8 }}>
                      Recipe Language
                    </Typography>
                    <LanguagePill value={language} onChange={setLanguage} accentColor="#b8714e" accentBg="#f0f4ec" />
                  </Box>
                  {pantryItems.some(i => i.inStock) && (
                    <Button variant="contained" onClick={importPantryToGenerator}
                      sx={{ background: "linear-gradient(135deg, #b8714e, #6b8c5a)", borderRadius: 2, fontWeight: 700, boxShadow: "0 4px 16px rgba(107,140,90,0.3)" }}>
                      🍳 Use in Recipe Generator
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            <Box p={4} maxWidth={800} mx="auto" sx={{ position: "relative", zIndex: 1 }}>
              {/* Add item */}
              <Box sx={{ background: "#fff", borderRadius: 3, p: 3, border: "1px solid #f3f4f6", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", mb: 3 }}>
                <Typography fontWeight={700} mb={2} color="#374151">Add to Pantry</Typography>
                <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="flex-start">
                  <TextField label="Item name" value={pantryInputName} onChange={e => setPantryInputName(e.target.value)} onKeyDown={e => e.key === "Enter" && addPantryItem()}
                    placeholder="e.g. olive oil" size="small" sx={{ flex: "1 1 150px", minWidth: 130 }} />
                  <TextField label="Qty" type="number" value={pantryInputQty} onChange={e => setPantryInputQty(e.target.value)} onKeyDown={e => e.key === "Enter" && addPantryItem()}
                    placeholder="1" size="small" inputProps={{ min: 0, step: "any" }} sx={{ width: 80 }} />
                  <FormControl size="small" sx={{ minWidth: 110 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select value={pantryInputUnit} label="Unit" onChange={e => setPantryInputUnit(e.target.value)}>
                      {UNITS.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={addPantryItem} startIcon={<AddCircleOutlineIcon />}
                    sx={{ background: "linear-gradient(135deg, #b8714e, #a06040)", borderRadius: 2, fontWeight: 700, height: 40, boxShadow: "none" }}>
                    Add
                  </Button>
                </Box>
                {/* ── Smart Input Panel — pantry accent color ── */}
                <SmartInputPanel
                  language={language}
                  accentColor="#b8714e"
                  onAddIngredients={(items) =>
                    setPantryItems(prev => [
                      ...prev,
                      ...items.map(i => ({ name: i.name || "", qty: i.qty || "", unit: i.unit || "", inStock: true }))
                    ])
                  }
                />
              </Box>

              {/* Pantry list */}
              {pantryItems.length === 0 ? (
                <EmptyStateIllustration
                  type="pantry"
                  message="Your pantry is empty"
                  subMessage="Add ingredients above to keep track of what you have. Check items off as you use them."
                />
              ) : (
                <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #f3f4f6", overflow: "hidden" }}>
                  <Box px={3} py={2} sx={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Typography fontWeight={700} color="#374151">
                        Pantry Items ({pantryItems.filter(i => i.inStock).length}/{pantryItems.length} in stock)
                      </Typography>
                      {lowStockItems.filter(i => !dismissedLowStock.has(i.name)).length > 0 && (
                        <Box
                          onClick={() => setNotifPanelOpen(true)}
                          sx={{
                            display: "flex", alignItems: "center", gap: 0.6,
                            background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.35)",
                            borderRadius: "12px", px: 1.2, py: 0.3, cursor: "pointer",
                            "&:hover": { background: "rgba(234,179,8,0.2)" },
                          }}
                        >
                          <NotificationsActiveIcon sx={{ fontSize: 13, color: "#eab308" }} />
                          <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#ca8a04" }}>
                            {lowStockItems.filter(i => !dismissedLowStock.has(i.name)).length} low stock
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Button size="small" onClick={() => setPantryItems([])} sx={{ color: "#6b8c5a", fontSize: "0.75rem" }}>Clear all</Button>
                  </Box>

                  {/* In stock */}
                  {pantryItems.filter(i => i.inStock).length > 0 && (
                    <Box>
                      <Box px={3} py={1} sx={{ background: "#f0fdf4", borderBottom: "1px solid #dcfce7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="caption" fontWeight={800} color="#15803d" sx={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>✅ In Stock</Typography>
                        <Typography variant="caption" color="#6b7280" fontSize="0.62rem">tap − to consume, + to restock</Typography>
                      </Box>
                      {pantryItems.map((item, idx) => {
                        if (!item.inStock) return null;
                        const lowStatus = getLowStockStatus(item);
                        const isDismissed = dismissedLowStock.has(item.name);
                        const showLowWarning = lowStatus && !isDismissed;
                        return (
                          <Box key={idx} sx={{
                            px: 3, py: 1.5, display: "flex", alignItems: "center", gap: 2,
                            borderBottom: showLowWarning
                              ? "1px solid rgba(234,179,8,0.18)"
                              : "1px solid #f9fafb",
                            background: showLowWarning ? "rgba(254,252,232,0.6)" : "transparent",
                            "&:hover": { background: showLowWarning ? "rgba(254,252,232,0.9)" : "#fafafa" },
                            transition: "background 0.15s",
                          }}>
                            <IconButton size="small" onClick={() => togglePantryItem(idx)} sx={{ color: "#22c55e", p: 0.3, flexShrink: 0 }}>
                              <CheckBoxIcon sx={{ fontSize: 22 }} />
                            </IconButton>

                            {/* Item name + low-stock badge */}
                            <Box flex={1} minWidth={0}>
                              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                <Typography fontSize="0.9rem" color="#374151" fontWeight={600}>
                                  {item.name}
                                  {item.unit && <Box component="span" color="#9ca3af" fontWeight={400} fontSize="0.78rem"> ({item.unit})</Box>}
                                </Typography>
                                {showLowWarning && (
                                  <Tooltip title={getLowStockMessage(item)} arrow placement="top">
                                    <Box sx={{
                                      display: "inline-flex", alignItems: "center", gap: 0.4,
                                      background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.35)",
                                      borderRadius: "8px", px: 0.8, py: 0.2, cursor: "help",
                                    }}>
                                      <Typography sx={{ fontSize: "0.62rem", fontWeight: 800, color: "#b45309" }}>⚠ Low stock</Typography>
                                    </Box>
                                  </Tooltip>
                                )}
                              </Box>
                            </Box>

                            {/* Quantity stepper */}
                            <Box display="flex" alignItems="center" gap={0.5} sx={{
                              background: showLowWarning ? "rgba(254,243,199,0.8)" : "#f9fafb",
                              borderRadius: 2,
                              border: showLowWarning ? "1px solid rgba(234,179,8,0.4)" : "1px solid #e5e7eb",
                              px: 0.5, py: 0.3,
                            }}>
                              <IconButton
                                size="small"
                                onClick={() => updatePantryQty(idx, -1)}
                                sx={{ width: 26, height: 26, borderRadius: 1.5, background: "#f0f3ec", color: "#6b8c5a", fontWeight: 800, fontSize: "1rem", "&:hover": { background: "#e4ede0" } }}
                              >−</IconButton>
                              <TextField
                                value={item.qty || "0"}
                                onChange={e => setPantryQtyDirect(idx, e.target.value)}
                                size="small"
                                inputProps={{ min: 0, step: "any", style: { textAlign: "center", fontWeight: 700, fontSize: "0.88rem", padding: "2px 0", width: 38 } }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1, "& fieldset": { border: "none" } }, "& .MuiOutlinedInput-input": { px: 0.5 } }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => updatePantryQty(idx, 1)}
                                sx={{ width: 26, height: 26, borderRadius: 1.5, background: "#f0fdf4", color: "#22c55e", fontWeight: 800, fontSize: "1rem", "&:hover": { background: "#dcfce7" } }}
                              >+</IconButton>
                            </Box>

                            {/* Low-stock quick action: add to grocery */}
                            {showLowWarning && (
                              <Tooltip title="Add to grocery list">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    if (!isInGroceryList(item.name)) {
                                      setGroceryList(prev => [...prev, { name: item.name, qty: item.qty, unit: item.unit, addedFrom: "Pantry alert" }]);
                                      showToast(`"${item.name}" added to grocery list 🛒`, "success");
                                    } else {
                                      showToast(`"${item.name}" is already in your grocery list`, "info");
                                    }
                                    setDismissedLowStock(prev => new Set([...prev, item.name]));
                                  }}
                                  sx={{
                                    color: "#d1d5db", flexShrink: 0,
                                    "&:hover": { color: "#eab308", background: "rgba(234,179,8,0.1)" },
                                  }}
                                >
                                  <AddShoppingCartIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                            )}

                            <IconButton size="small" onClick={() => removePantryItem(idx)} sx={{ color: "#d1d5db", flexShrink: 0, "&:hover": { color: "#6b8c5a" } }}>
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        );
                      })}
                    </Box>
                  )}

                  {/* Out of stock */}
                  {pantryItems.filter(i => !i.inStock).length > 0 && (
                    <Box>
                      <Box px={3} py={1} sx={{ background: "#f0f3ec", borderBottom: "1px solid #e4ede0", borderTop: "1px solid #f3f4f6" }}>
                        <Typography variant="caption" fontWeight={800} color="#6b8c5a" sx={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}>❌ Used Up / Out of Stock</Typography>
                      </Box>
                      {pantryItems.map((item, idx) => item.inStock ? null : (
                        <Box key={idx} sx={{ px: 3, py: 1.5, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #f9fafb", opacity: 0.5, "&:hover": { background: "#fafafa", opacity: 0.7 } }}>
                          <IconButton size="small" onClick={() => togglePantryItem(idx)} sx={{ color: "#d1d5db", p: 0.3 }}>
                            <CheckBoxOutlineBlankIcon sx={{ fontSize: 22 }} />
                          </IconButton>
                          <Typography fontSize="0.9rem" color="#9ca3af" flex={1} sx={{ textDecoration: "line-through" }}>
                            {[item.qty, item.unit, item.name].filter(Boolean).join(" ")}
                          </Typography>
                          <IconButton size="small" onClick={() => removePantryItem(idx)} sx={{ color: "#d1d5db", "&:hover": { color: "#6b8c5a" } }}>
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* ══ SAVED RECIPES ══ */}
        {page === "saved" && (() => {
          const MEAT_KEYWORDS = ["chicken","beef","pork","lamb","turkey","fish","salmon","tuna","shrimp","bacon","sausage","steak","mutton","crab","lobster","meat","ham","pepperoni","prawn","anchovy","sardine","duck","venison"];
          const isVeg = (r) => !MEAT_KEYWORDS.some(k => ((r._title || "") + " " + (r.overview || "")).toLowerCase().includes(k));

          const filtered = savedRecipes.filter(r => {
            const q = savedSearch.toLowerCase();
            const matchesSearch = !q || r._title?.toLowerCase().includes(q) || r.overview?.toLowerCase().includes(q);
            const matchesVeg = savedVegFilter === "all" || (savedVegFilter === "veg" ? isVeg(r) : !isVeg(r));
            return matchesSearch && matchesVeg;
          });

          const vegCount = savedRecipes.filter(r => isVeg(r)).length;
          const nonVegCount = savedRecipes.length - vegCount;

          return (
            <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #f5f2ec 0%, #eef2e8 45%, #f5f2ec 100%)", position: "relative", overflow: "hidden" }}>
              <Box sx={{ position: "fixed", top: 60, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.11) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
              <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.3, backgroundImage: "radial-gradient(circle, #059669 1.5px, transparent 1.5px)", backgroundSize: "36px 36px" }} />

              <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(125deg, #022c22 0%, #064e3b 40%, #065f46 70%, #047857 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
                <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 3 }}>
                  <Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
                      <Typography sx={{ color: "#6ee7b7", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Your Cookbook</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>💾 Saved Recipes</Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
                      {savedRecipes.length} recipe{savedRecipes.length !== 1 ? "s" : ""} saved
                      {(savedSearch || savedVegFilter !== "all") && ` · ${filtered.length} shown`}
                    </Typography>
                  </Box>
                  {savedRecipes.length > 0 && (
                    <TextField value={savedSearch} onChange={e => setSavedSearch(e.target.value)} placeholder="Search saved recipes…" size="small"
                      sx={{ width: 260, mb: 0.5, "& .MuiOutlinedInput-root": { background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 2, color: "#fff", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" }, "&.Mui-focused fieldset": { borderColor: "#34d399" } }, "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.4)", opacity: 1 } }}
                      InputProps={{
                        startAdornment: <Box component="span" sx={{ mr: 1, fontSize: "1rem" }}>🔍</Box>,
                        endAdornment: savedSearch ? (<IconButton size="small" onClick={() => setSavedSearch("")} sx={{ p: 0.3 }}><CloseIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }} /></IconButton>) : null,
                      }} />
                  )}
                </Box>
              </Box>

              <Box p={4} maxWidth={960} mx="auto" sx={{ position: "relative", zIndex: 1 }}>

                {/* Veg / Non-veg filter bar */}
                {savedRecipes.length > 0 && (
                  <Box display="flex" gap={1} mb={3} sx={{ background: "#fff", borderRadius: 3, p: 1, border: "1px solid #bbf7d0", width: "fit-content" }}>
                    {[
                      { key: "all",    label: "🍽️ All",          count: savedRecipes.length },
                      { key: "veg",    label: "🌱 Vegetarian",   count: vegCount },
                      { key: "nonveg", label: "🥩 Non-Veg",      count: nonVegCount },
                    ].map(opt => (
                      <Box key={opt.key} onClick={() => setSavedVegFilter(opt.key)} sx={{
                        px: 2, py: 0.8, borderRadius: 2, cursor: "pointer",
                        background: savedVegFilter === opt.key ? "linear-gradient(135deg, #22c55e, #16a34a)" : "transparent",
                        color: savedVegFilter === opt.key ? "#fff" : "#6b7280",
                        fontWeight: 700, fontSize: "0.82rem", transition: "all 0.18s",
                        display: "flex", alignItems: "center", gap: 0.8,
                      }}>
                        {opt.label}
                        <Box sx={{
                          background: savedVegFilter === opt.key ? "rgba(255,255,255,0.3)" : "#f3f4f6",
                          color: savedVegFilter === opt.key ? "#fff" : "#9ca3af",
                          borderRadius: "10px", px: 0.8, fontSize: "0.65rem", fontWeight: 800,
                        }}>{opt.count}</Box>
                      </Box>
                    ))}
                  </Box>
                )}

                {savedRecipes.length === 0 ? (
                  <EmptyStateIllustration
                    type="saved"
                    message="No saved recipes yet"
                    subMessage="Generate some recipes and save your favorites here. You can rate them and add personal cooking notes."
                    action={
                      <Button variant="contained" onClick={() => setPage("recipes")} sx={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: 2, fontWeight: 700 }}>
                        Generate Recipes →
                      </Button>
                    }
                  />
                ) : filtered.length === 0 ? (
                  <EmptyStateIllustration
                    type="search"
                    message={savedSearch ? `No results for "${savedSearch}"` : `No ${savedVegFilter === "veg" ? "vegetarian" : "non-veg"} recipes saved`}
                    subMessage={savedSearch ? "Try a different search term." : "Try a different filter or save more recipes."}
                    action={
                      <Button size="small" onClick={() => { setSavedSearch(""); setSavedVegFilter("all"); }} sx={{ color: "#22c55e" }}>
                        Clear filters
                      </Button>
                    }
                  />
                ) : (
                  <Grid container spacing={2.5}>
                    {filtered.map((r, i) => {
                      const originalIdx = savedRecipes.indexOf(r);
                      const recipeName = r._title || "";
                      const rating = recipeRatings[recipeName] || 0;
                      const note = recipeNotes[recipeName] || "";
                      return (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                          <Card sx={{ ...cardSx, display: "flex", flexDirection: "column" }}>
                            <IconButton onClick={() => deleteRecipe(originalIdx)} size="small" sx={{
                              position: "absolute", right: 8, top: 8, zIndex: 1,
                              background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
                              "&:hover": { background: "#e4ede0", color: "#6b8c5a" },
                            }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>

                            <Box onClick={() => { setDetails(r); setOpen(true); setServingMultiplier(1); }}>
                              <Box sx={{ position: "relative", height: 150, overflow: "hidden" }}>
                                <RecipeImage title={recipeName || "food meal"} height={150} />
                                {/* Veg/Non-veg badge */}
                                <Box sx={{ position: "absolute", bottom: 8, left: 8, background: isVeg(r) ? "rgba(22,163,74,0.9)" : "rgba(220,38,38,0.9)", backdropFilter: "blur(4px)", borderRadius: "6px", px: 1, py: 0.25, fontSize: "0.62rem", fontWeight: 800, color: "#fff" }}>
                                  {isVeg(r) ? "🌱 VEG" : "🥩 NON-VEG"}
                                </Box>
                              </Box>
                              <CardContent sx={{ p: 2, pb: 1 }}>
                                {recipeName && (
                                  <Typography fontWeight={800} fontSize="0.95rem" color="#1a1a1a" mb={0.5} lineHeight={1.3}>{recipeName}</Typography>
                                )}
                                <Typography fontSize="0.8rem" color="text.secondary" lineHeight={1.4} sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                  {r.overview}
                                </Typography>
                                {(r.servings || r.cook_time) && (
                                  <Box display="flex" gap={0.8} mt={1} flexWrap="wrap">
                                    {r.servings && <Box sx={{ background: "#f0f4ec", border: "1px solid #b8cead", borderRadius: 1.5, px: 1, py: 0.2 }}><Typography variant="caption" color="#5a7a48" fontWeight={700} fontSize="0.7rem">🍽️ {r.servings}</Typography></Box>}
                                    {r.cook_time && <Box sx={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 1.5, px: 1, py: 0.2 }}><Typography variant="caption" color="#1d4ed8" fontWeight={700} fontSize="0.7rem">⏱️ {r.cook_time}</Typography></Box>}
                                  </Box>
                                )}
                              </CardContent>
                            </Box>

                            {/* Rating + Note */}
                            <Box px={2} pb={2} mt="auto">
                              <Divider sx={{ mb: 1.5 }} />
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <StarRating value={rating} onChange={(v) => setRating(recipeName, v)} size={18} />
                                <Typography variant="caption" color="text.disabled" fontSize="0.65rem">
                                  {rating > 0 ? `${rating}/5 ⭐` : "Rate this"}
                                </Typography>
                              </Box>
                              {editingNote === recipeName ? (
                                <Box>
                                  <TextField
                                    multiline rows={2} fullWidth size="small" autoFocus
                                    defaultValue={note}
                                    placeholder="Add cooking notes…"
                                    sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.8rem", borderRadius: 1.5 } }}
                                    onBlur={(e) => saveNote(recipeName, e.target.value)}
                                    onKeyDown={(e) => e.key === "Escape" && setEditingNote(null)}
                                  />
                                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.65rem" }}>Press Escape to cancel, click away to save</Typography>
                                </Box>
                              ) : (
                                <Box onClick={() => setEditingNote(recipeName)} sx={{ cursor: "pointer", p: 1, borderRadius: 1, border: "1px dashed #e5e7eb", "&:hover": { borderColor: "#22c55e", background: "#f0fdf4" }, minHeight: 32 }}>
                                  {note ? (
                                    <Typography fontSize="0.78rem" color="#374151" lineHeight={1.5}>{note}</Typography>
                                  ) : (
                                    <Typography fontSize="0.75rem" color="#d1d5db">+ Add cooking notes…</Typography>
                                  )}
                                </Box>
                              )}
                              {/* PDF export */}
                              <Button
                                fullWidth size="small" variant="outlined" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                                onClick={(e) => { e.stopPropagation(); exportRecipePDF(r); }}
                                sx={{ mt: 1.2, borderColor: "#22c55e", color: "#15803d", borderRadius: 2, fontWeight: 700, fontSize: "0.75rem", "&:hover": { background: "#f0fdf4" } }}>
                                Download PDF
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            </Box>
          );
        })()}

        {/* ══ TOP RATED ══ */}
        {page === "toprated" && (
          <TopRatedPage
            API={API}
            recipeRatings={recipeRatings}
            savedRecipes={savedRecipes}
            trFilter={trFilter}
            setTrFilter={setTrFilter}
            fetchDetails={fetchDetails}
            setRating={setRating}
            setPage={setPage}
            cardSx={cardSx}
          />
        )}

        {/* ── RECIPE HISTORY PAGE ── */}
        {page === "history" && (() => {
          // ── Smart grouping ──
          const now = Date.now();
          const todayStart     = new Date(); todayStart.setHours(0,0,0,0);
          const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate() - 1);
          const weekStart      = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7);

          const groups = [
            { label: "Today",      icon: "☀️", items: [] },
            { label: "Yesterday",  icon: "🌙", items: [] },
            { label: "This Week",  icon: "📅", items: [] },
            { label: "Earlier",    icon: "🗂️", items: [] },
          ];

          recipeHistory.forEach(item => {
            const t = new Date(item.viewedAt).getTime();
            if      (t >= todayStart.getTime())     groups[0].items.push(item);
            else if (t >= yesterdayStart.getTime()) groups[1].items.push(item);
            else if (t >= weekStart.getTime())      groups[2].items.push(item);
            else                                    groups[3].items.push(item);
          });

          const filledGroups = groups.filter(g => g.items.length > 0);

          const topRecipes = [...recipeHistory]
            .sort((a, b) => (b.viewCount || 1) - (a.viewCount || 1))
            .slice(0, 3);

          const timeAgo = (iso) => {
            const diff = now - new Date(iso).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 1)  return "just now";
            if (mins < 60) return `${mins}m ago`;
            const hrs = Math.floor(mins / 60);
            if (hrs < 24)  return `${hrs}h ago`;
            const days = Math.floor(hrs / 24);
            if (days === 1) return "yesterday";
            if (days < 7)  return `${days} days ago`;
            return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          };

          return (
            <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #141210 0%, #1a1814 100%)" }}>
              {/* Header */}
              <Box sx={{ overflow: "hidden", background: "linear-gradient(125deg, #161410 0%, #1e2b1a 40%, #243a1e 70%, #3a5c30 100%)", px: { xs: 4, md: 6 }, py: 4.5 }}>
                <Box display="flex" alignItems="flex-end" justifyContent="space-between" flexWrap="wrap" gap={2}>
                  <Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, background: "rgba(184,113,78,0.2)", border: "1px solid rgba(184,113,78,0.4)", borderRadius: "100px", px: 2, py: 0.5, mb: 2 }}>
                      <HistoryIcon sx={{ fontSize: 12, color: "#b8714e" }} />
                      <Typography sx={{ color: "#c4b08a", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Your Cooking Journey</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.1, mb: 1 }}>
                      🕐 Recipe History
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
                      {recipeHistory.length} recipe{recipeHistory.length !== 1 ? "s" : ""} explored
                      {recipeHistory.length > 0 && ` · last 30 days · ${savedRecipes.length} saved`}
                    </Typography>
                  </Box>
                  {recipeHistory.length > 0 && (
                    <Button variant="outlined" size="small"
                      onClick={() => { setRecipeHistory([]); localStorage.removeItem("recipeHistory"); }}
                      sx={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.4)", borderRadius: 2, fontWeight: 700 }}>
                      Clear All
                    </Button>
                  )}
                </Box>
              </Box>

              <Box p={4} maxWidth={1000} mx="auto">
                {recipeHistory.length === 0 ? (
                  <Box textAlign="center" py={12}>
                    <Typography fontSize="3rem" mb={2}>🍳</Typography>
                    <Typography fontWeight={700} color="#6b7280" fontSize="1rem" mb={1}>Nothing cooked up yet</Typography>
                    <Typography variant="body2" color="#4b5563" mb={3}>Every recipe you open gets tracked here — with how often you come back to it</Typography>
                    <Button variant="contained" onClick={() => setPage("recipes")}
                      sx={{ background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", borderRadius: 2, fontWeight: 700 }}>
                      Generate Recipes →
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    {/* ── Stats row ── */}
                    <Grid container spacing={2} mb={4}>
                      {[
                        { label: "Recipes explored",  val: recipeHistory.length,                                    icon: "🔍", color: "#b8714e", bg: "rgba(184,113,78,0.12)",  border: "rgba(184,113,78,0.25)" },
                        { label: "Saved to cookbook", val: recipeHistory.filter(h => savedRecipes.some(r => r._title === h.title)).length, icon: "💾", color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.22)"  },
                        { label: "Most viewed",        val: topRecipes[0] ? `"${topRecipes[0].title.split(" ").slice(0,3).join(" ")}…"` : "—", icon: "🔥", color: "#eab308", bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.22)"  },
                        { label: "Rated by you",       val: recipeHistory.filter(h => (recipeRatings[h.title] || 0) > 0).length,          icon: "⭐", color: "#c49a3c", bg: "rgba(196,154,60,0.1)",  border: "rgba(196,154,60,0.22)" },
                      ].map((s, i) => (
                        <Grid item xs={6} md={3} key={i}>
                          <Box sx={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 3, p: 2, textAlign: "center" }}>
                            <Typography sx={{ fontSize: "1.5rem", mb: 0.5 }}>{s.icon}</Typography>
                            <Typography sx={{ color: s.color, fontWeight: 900, fontSize: i === 2 ? "0.75rem" : "1.5rem", lineHeight: 1.2, mb: 0.3 }}>{s.val}</Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    {/* ── Most revisited strip (only if any viewed 2+ times) ── */}
                    {topRecipes.some(r => (r.viewCount || 1) >= 2) && (
                      <Box mb={4}>
                        <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5 }}>
                          🔥 Your Go-To Recipes
                        </Typography>
                        <Box display="flex" gap={1.5} flexWrap="wrap">
                          {topRecipes.filter(r => (r.viewCount || 1) >= 2).map((item, i) => (
                            <Box key={i} onClick={() => fetchDetails(item.title)} sx={{
                              display: "flex", alignItems: "center", gap: 1.2,
                              background: "rgba(184,113,78,0.12)", border: "1px solid rgba(184,113,78,0.25)",
                              borderRadius: "100px", pl: 0.6, pr: 2, py: 0.6, cursor: "pointer",
                              transition: "all 0.15s",
                              "&:hover": { background: "rgba(184,113,78,0.22)", borderColor: "rgba(184,113,78,0.5)" },
                            }}>
                              <Box sx={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                                <RecipeImage title={item.title} height={28} />
                              </Box>
                              <Typography sx={{ color: "#c4b08a", fontSize: "0.78rem", fontWeight: 700, whiteSpace: "nowrap" }}>{item.title}</Typography>
                              <Box sx={{ background: "rgba(184,113,78,0.3)", borderRadius: "8px", px: 0.8, py: 0.1 }}>
                                <Typography sx={{ color: "#b8714e", fontSize: "0.62rem", fontWeight: 800 }}>×{item.viewCount}</Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* ── Grouped timeline ── */}
                    {filledGroups.map(group => (
                      <Box key={group.label} mb={4}>
                        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                          <Typography sx={{ fontSize: "1rem" }}>{group.icon}</Typography>
                          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {group.label}
                          </Typography>
                          <Box sx={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                          <Typography sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.68rem" }}>
                            {group.items.length} recipe{group.items.length !== 1 ? "s" : ""}
                          </Typography>
                        </Box>

                        <Grid container spacing={2}>
                          {group.items.map((item, i) => {
                            const isSaved  = savedRecipes.some(r => r._title === item.title);
                            const rating   = recipeRatings[item.title] || 0;
                            const isRepeat = (item.viewCount || 1) >= 2;

                            return (
                              <Grid item xs={12} sm={6} md={4} key={i}>
                                <Card sx={{
                                  borderRadius: 3, overflow: "hidden", cursor: "pointer",
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.07)",
                                  transition: "all 0.2s",
                                  "&:hover": { background: "rgba(184,113,78,0.09)", borderColor: "rgba(184,113,78,0.3)", transform: "translateY(-3px)", boxShadow: "0 12px 32px rgba(0,0,0,0.4)" },
                                }}
                                  onClick={() => fetchDetails(item.title)}>

                                  {/* Thumbnail */}
                                  <Box sx={{ position: "relative", height: 130, overflow: "hidden" }}>
                                    <RecipeImage title={item.title} height={130} />
                                    <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />

                                    {/* Badges */}
                                    <Box sx={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 0.6 }}>
                                      {isSaved && (
                                        <Box sx={{ background: "rgba(34,197,94,0.88)", backdropFilter: "blur(4px)", borderRadius: "6px", px: 0.9, py: 0.25 }}>
                                          <Typography sx={{ color: "#fff", fontSize: "0.6rem", fontWeight: 800 }}>💾 SAVED</Typography>
                                        </Box>
                                      )}
                                      {isRepeat && (
                                        <Box sx={{ background: "rgba(184,113,78,0.9)", backdropFilter: "blur(4px)", borderRadius: "6px", px: 0.9, py: 0.25 }}>
                                          <Typography sx={{ color: "#fff", fontSize: "0.6rem", fontWeight: 800 }}>🔥 ×{item.viewCount}</Typography>
                                        </Box>
                                      )}
                                    </Box>

                                    {/* Time */}
                                    <Box sx={{ position: "absolute", bottom: 8, right: 8 }}>
                                      <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.62rem", fontWeight: 600 }}>
                                        {timeAgo(item.viewedAt)}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  {/* Info */}
                                  <Box px={2} pt={1.5} pb={0.5}>
                                    <Typography fontWeight={700} color="#fff" fontSize="0.88rem"
                                      sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mb: 0.5 }}>
                                      {item.title}
                                    </Typography>

                                    {/* Rating row */}
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                      {rating > 0 ? (
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                          {[1,2,3,4,5].map(s => (
                                            <Box key={s} sx={{ color: s <= rating ? "#c49a3c" : "rgba(255,255,255,0.15)", fontSize: "0.7rem" }}>★</Box>
                                          ))}
                                          <Typography sx={{ color: "#c49a3c", fontSize: "0.65rem", fontWeight: 700, ml: 0.3 }}>{rating}/5</Typography>
                                        </Box>
                                      ) : (
                                        <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem" }}>Not rated yet</Typography>
                                      )}
                                      {item.firstViewedAt && item.viewCount > 1 && (
                                        <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.62rem" }}>
                                          First seen {timeAgo(item.firstViewedAt)}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>

                                  {/* Actions */}
                                  <Box px={2} pb={2} pt={1} display="flex" gap={1}>
                                    <Button size="small" variant="outlined" fullWidth
                                      onClick={e => { e.stopPropagation(); fetchDetails(item.title); }}
                                      sx={{ borderColor: "rgba(184,113,78,0.35)", color: "#b8714e", borderRadius: 2, fontSize: "0.73rem", fontWeight: 700, py: 0.5 }}>
                                      Open Recipe
                                    </Button>
                                    {!isSaved && (
                                      <Tooltip title="Save to cookbook">
                                        <IconButton size="small"
                                          onClick={e => { e.stopPropagation(); fetchDetails(item.title); setTimeout(() => saveRecipe(), 800); }}
                                          sx={{ color: "rgba(255,255,255,0.25)", "&:hover": { color: "#22c55e" }, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, px: 1 }}>
                                          <BookmarkBorderIcon sx={{ fontSize: 15 }} />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </Card>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          );
        })()}

        {/* ── RECIPE DETAILS MODAL ── */}
        <Dialog open={open} onClose={() => { setOpen(false); setDetails(null); window.speechSynthesis?.cancel(); }}
          fullWidth maxWidth="md"
          PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
          <DialogTitle sx={{
            background: "linear-gradient(135deg, #f0f4ec, #e8f0e4)",
            borderBottom: "1px solid #f3f4f6", fontWeight: 800, fontSize: "1.2rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <Typography fontWeight={800} fontSize="1.1rem">
              {details ? (details._title || "🍳 Recipe Details") : "Loading…"}
            </Typography>
            <Box display="flex" gap={1}>
              {details && (
                <Tooltip title="Cook Mode — fullscreen step-by-step">
                  <Button
                    variant="outlined" size="small" startIcon={<FullscreenIcon />}
                    onClick={() => { setOpen(false); setCookModeOpen(true); }}
                    sx={{ borderColor: "#b8714e", color: "#b8714e", borderRadius: 2, fontWeight: 700, fontSize: "0.78rem", "&:hover": { background: "#f0f4ec" } }}>
                    Cook Mode
                  </Button>
                </Tooltip>
              )}
              <IconButton onClick={() => { setOpen(false); setDetails(null); }} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {(detailsLoading && !details) && (
              <Box py={2}>
                <Box sx={{ height: 16, width: "60%", borderRadius: 1, mb: 2, ...shimmerSx }} />
                <Box sx={{ height: 12, width: "90%", borderRadius: 1, mb: 1, ...shimmerSx }} />
                <Box sx={{ height: 12, width: "75%", borderRadius: 1, mb: 3, ...shimmerSx }} />
                {[1,2,3].map(i => <Box key={i} sx={{ height: 12, width: `${60 + i * 10}%`, borderRadius: 1, mb: 1, ...shimmerSx }} />)}
              </Box>
            )}
            {details && (
              <>
                {/* Action bar */}
                <Box display="flex" gap={1.5} flexWrap="wrap" mb={3} alignItems="center">
                  <Button variant="contained" startIcon={<BookmarkBorderIcon />} onClick={saveRecipe}
                    sx={{ background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", borderRadius: 2, fontWeight: 700, boxShadow: "none" }}>
                    Save Recipe
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<FullscreenIcon />}
                    onClick={() => { setOpen(false); setCookModeOpen(true); }}
                    sx={{ borderColor: "#b8714e", color: "#b8714e", borderRadius: 2, fontWeight: 600 }}>
                    Cook Mode
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<DownloadIcon />}
                    onClick={() => exportRecipePDF(details, servingMultiplier)}
                    sx={{ borderColor: "#22c55e", color: "#15803d", borderRadius: 2, fontWeight: 600, "&:hover": { background: "#f0fdf4" } }}>
                    Download PDF
                  </Button>
                </Box>

                {/* Meta row */}
                <Box display="flex" gap={2} flexWrap="wrap" mb={3} alignItems="center">
                  {[
                    { icon: "🍽️", val: details.servings, label: "Servings" },
                    { icon: "⏱️", val: details.prep_time, label: "Prep" },
                    { icon: "🔥", val: details.cook_time, label: "Cook" },
                  ].filter(m => m.val).map((m, i) => (
                    <Box key={i} sx={{ background: "#f0f4ec", borderRadius: 2, px: 2, py: 1, border: "1px solid #b8cead", textAlign: "center" }}>
                      <Typography fontSize="1.2rem">{m.icon}</Typography>
                      <Typography fontWeight={700} fontSize="0.85rem">{m.val}</Typography>
                      <Typography variant="caption" color="text.secondary">{m.label}</Typography>
                    </Box>
                  ))}

                  {/* Serving multiplier */}
                  <Box sx={{ background: "#f0fdf4", borderRadius: 2, px: 2, py: 1, border: "1px solid #86efac", display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Box>
                      <Typography variant="caption" fontWeight={700} color="#15803d" display="block" lineHeight={1.2}>Adjust Servings</Typography>
                      <Typography variant="caption" color="#6b7280" fontSize="0.64rem">multiplies all ingredient amounts</Typography>
                    </Box>
                    {[1, 2, 3, 4].map(m => (
                      <Box key={m} onClick={() => setServingMultiplier(m)} sx={{
                        width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
                        background: servingMultiplier === m ? "#22c55e" : "#fff",
                        border: `1.5px solid ${servingMultiplier === m ? "#22c55e" : "#d1d5db"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.78rem", fontWeight: 800,
                        color: servingMultiplier === m ? "#fff" : "#374151",
                        transition: "all 0.15s",
                        flexShrink: 0,
                      }}>×{m}</Box>
                    ))}
                  </Box>
                </Box>

                {/* ── Audio Player ── */}
                <RecipeAudioPlayer recipe={details} language={language} />

                <Typography variant="h6" fontWeight={800} mb={1}>Overview</Typography>
                <Typography mb={3} color="text.secondary">{details.overview}</Typography>

                <Typography variant="h6" fontWeight={800} mb={1}>Ingredients</Typography>

                {/* Bulk action bar */}
                {details.ingredients?.main?.length > 0 && (() => {
                  const missing = details.ingredients.main.filter(ing => !isInPantryFuzzy(ing.name));
                  const inPantryCount = details.ingredients.main.length - missing.length;
                  return (
                    <Box display="flex" alignItems="center" gap={1.5} mb={2} flexWrap="wrap">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "100px", px: 1.5, py: 0.4 }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#15803d" }}>
                          {inPantryCount}/{details.ingredients.main.length} in pantry
                        </Typography>
                      </Box>
                      {missing.length > 0 && (
                        <Button size="small" startIcon={<AddShoppingCartIcon sx={{ fontSize: 14 }} />}
                          onClick={() => addAllMissingToGrocery(details.ingredients.main)}
                          sx={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 700, py: 0.4, px: 1.5, "&:hover": { background: "#dbeafe" } }}>
                          Add {missing.length} missing to grocery list
                        </Button>
                      )}
                    </Box>
                  );
                })()}

                <Box sx={{ mb: 3, borderRadius: 2, overflow: "hidden", border: "1px solid #f3f4f6" }}>
                  {details.ingredients?.main?.map((ing, idx) => {
                    const inPantry = isInPantryFuzzy(ing.name);
                    const inGrocery = isInGroceryList(ing.name);
                    return (
                      <Box key={idx} sx={{
                        px: 2, py: 1.2,
                        display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap",
                        borderBottom: idx < (details.ingredients.main.length - 1) ? "1px solid #f9fafb" : "none",
                        background: inPantry ? "#f0fdf4" : inGrocery ? "#eff6ff" : "#fff",
                        transition: "background 0.15s",
                      }}>
                        {/* Status dot */}
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: inPantry ? "#22c55e" : inGrocery ? "#3b82f6" : "#e5e7eb" }} />

                        {/* Ingredient name + qty */}
                        <Typography fontSize="0.88rem" flex={1} fontWeight={inPantry ? 600 : 400} color={inPantry ? "#15803d" : "#374151"}>
                          {scaleQty(ing.quantity, servingMultiplier)} {ing.name}
                        </Typography>

                        {/* Status badge or action buttons */}
                        <Box display="flex" alignItems="center" gap={0.8} flexShrink={0}>
                          {inPantry ? (
                            <Chip label="✓ In pantry" size="small" sx={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", fontWeight: 700, fontSize: "0.65rem", height: 20 }} />
                          ) : inGrocery ? (
                            <>
                              <Chip label="🛒 In grocery list" size="small" sx={{ background: "#dbeafe", color: "#1d4ed8", border: "1px solid #93c5fd", fontWeight: 700, fontSize: "0.65rem", height: 20 }} />
                              <Tooltip title="Remove from grocery list">
                                <IconButton size="small" onClick={() => removeFromGroceryList(ing.name)}
                                  sx={{ color: "#93c5fd", "&:hover": { color: "#6b8c5a" }, p: 0.3 }}>
                                  <RemoveShoppingCartIcon sx={{ fontSize: 13 }} />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title="Add to pantry">
                                <IconButton size="small" onClick={() => addIngredientToPantry(ing)}
                                  sx={{ color: "#d1d5db", "&:hover": { color: "#22c55e", background: "#f0fdf4" }, p: 0.4, borderRadius: 1 }}>
                                  <InventoryIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Add to grocery list">
                                <IconButton size="small" onClick={() => addToGroceryList(ing)}
                                  sx={{ color: "#d1d5db", "&:hover": { color: "#3b82f6", background: "#eff6ff" }, p: 0.4, borderRadius: 1 }}>
                                  <AddShoppingCartIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          {/* Always show substitute button */}
                          <Tooltip title={`Substitute ${ing.name}`}>
                            <IconButton size="small" onClick={() => setSubModal({ open: true, ingredient: ing.name })}
                              sx={{ color: "#d1d5db", "&:hover": { color: "#b8714e" }, p: 0.4 }}>
                              <SwapHorizIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                <Typography variant="h6" fontWeight={800} mb={1}>Steps</Typography>
                <Box component="ol" sx={{ pl: 2, mb: 3 }}>
                  {details.steps?.map((s, idx) => {
                    const stepText = typeof s === "string" ? s : s.text;
                    const stepTime = typeof s === "object" && s.time_min ? s.time_min : null;
                    return (
                      <Box component="li" key={idx} sx={{ mb: 1.5 }}>
                        <Box display="flex" alignItems="flex-start" gap={1}>
                          <Typography fontSize="0.9rem" flex={1}>{stepText}</Typography>
                          {stepTime && (
                            <Chip label={`⏱ ${stepTime}m`} size="small"
                              sx={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", fontWeight: 700, fontSize: "0.7rem", height: 20, flexShrink: 0 }} />
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {details.nutrition && (
                  <>
                    <Typography variant="h6" fontWeight={800} mb={1.5}>Nutrition (per serving{servingMultiplier > 1 ? ` × ${servingMultiplier}` : ""})</Typography>
                    <Box display="flex" gap={1.5} flexWrap="wrap">
                      {[
                        { label: "Calories", val: details.nutrition.calories, bg: "#f0f4ec", border: "#b8cead", color: "#5a7a48" },
                        { label: "Protein", val: details.nutrition.protein, bg: "#f0fdf4", border: "#86efac", color: "#15803d" },
                        { label: "Carbs", val: details.nutrition.carbs, bg: "#eff6ff", border: "#93c5fd", color: "#1d4ed8" },
                        { label: "Fat", val: details.nutrition.fat, bg: "#fdf4ff", border: "#d8b4fe", color: "#7e22ce" },
                      ].filter(n => n.val).map((n, i) => (
                        <Box key={i} sx={{ background: n.bg, border: `1px solid ${n.border}`, borderRadius: 2, px: 2, py: 1, textAlign: "center", minWidth: 80 }}>
                          <Typography fontWeight={800} fontSize="1rem" color={n.color}>{n.val}</Typography>
                          <Typography variant="caption" color="text.secondary">{n.label}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}

// ─── IngredientInput (used in Meal Planner) ───────────────────────────────────
function IngredientInput({ onAdd, label = "Ingredient" }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("");
  const add = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), qty: qty.trim(), unit });
    setName(""); setQty(""); setUnit("");
  };
  return (
    <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="flex-start">
      <TextField label={label} value={name} onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && add()}
        placeholder="e.g. eggs" size="small" sx={{ flex: "1 1 150px", minWidth: 130 }} />
      <TextField label="Qty" type="number" value={qty} onChange={e => setQty(e.target.value)}
        onKeyDown={e => e.key === "Enter" && add()}
        placeholder="2" size="small" inputProps={{ min: 0, step: "any" }} sx={{ width: 80 }} />
      <FormControl size="small" sx={{ minWidth: 110 }}>
        <InputLabel>Unit</InputLabel>
        <Select value={unit} label="Unit" onChange={e => setUnit(e.target.value)}>
          {UNITS.map(u => <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>)}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={add} startIcon={<AddCircleOutlineIcon />}
        sx={{ background: "linear-gradient(135deg, #5a7c4a, #4a6a3a)", borderRadius: 2, fontWeight: 700, height: 40, boxShadow: "none", "&:hover": { boxShadow: "0 2px 12px rgba(107,140,90,0.3)" } }}>Add</Button>
    </Box>
  );
}
