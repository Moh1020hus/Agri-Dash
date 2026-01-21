"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Sprout, HelpCircle, Edit3, ArrowLeft, Maximize2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { BBCHData } from "@/types";
import { clsx } from "clsx";

interface BBCHTrackerProps {
  data: BBCHData;
}

export default function BBCHTracker({ data }: BBCHTrackerProps) {
  const { currentStage, stageName, confidenceScore, history } = data;
  const [isModalOpen, setModalOpen] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const confidencePercent = Math.round(confidenceScore * 100);

  // --- DYNAMIC COLOR LOGIC ---
  const isHighConfidence = confidencePercent > 80;

  // CHANGED: Deeper colors (green-100 instead of green-50)
  const cardBgColor = isHighConfidence ? "bg-green-100" : "bg-white";
  const cardBorderColor = isHighConfidence
    ? "border-green-300"
    : "border-slate-200";
  const textColor = isHighConfidence ? "text-green-800" : "text-slate-700";
  const iconColor = isHighConfidence ? "text-green-700" : "text-slate-400";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Vielen Dank! Ihre Korrektur wurde gespeichert.");
    setShowFeedbackForm(false);
    setModalOpen(false);
  };

  return (
    <>
      {/* 1. COMPACT HERO CARD */}
      <div
        onClick={() => {
          setModalOpen(true);
          setShowFeedbackForm(false);
        }}
        className={clsx(
          "rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition-all group relative flex flex-col items-center justify-center text-center h-full",
          cardBgColor,
          cardBorderColor,
          // Stronger hover border
          isHighConfidence
            ? "hover:border-green-500"
            : "hover:border-green-300",
        )}
      >
        <div
          className={clsx(
            "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
            iconColor,
          )}
        >
          <Maximize2 size={16} />
        </div>

        {/* Header - Bigger Text */}
        <div
          className={clsx(
            "text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5",
            iconColor,
          )}
        >
          <Sprout size={16} /> Pflanzenstadium
        </div>

        {/* HERO CONTENT: Huge Number & Name */}
        <div className="flex flex-col items-center justify-center flex-grow">
          {/* CHANGED: Text size increased from 4xl to 6xl */}
          <div className="text-6xl font-black text-green-700 tracking-tighter leading-none mb-1">
            {currentStage}
          </div>
          {/* CHANGED: Text size increased from lg to 2xl */}
          <div className={clsx("text-2xl font-bold leading-tight", textColor)}>
            {stageName}
          </div>
        </div>

        {/* REMOVED: Confidence Badge is gone from here */}
      </div>

      {/* 2. DETAIL MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={showFeedbackForm ? "Korrektur melden" : "BBCH Details & Verlauf"}
      >
        {showFeedbackForm ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 animate-in slide-in-from-right duration-200"
          >
            <button
              type="button"
              onClick={() => setShowFeedbackForm(false)}
              className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2"
            >
              <ArrowLeft size={16} /> Zurück zur Übersicht
            </button>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
              <p className="text-sm text-slate-600">
                Aktuelle Schätzung:{" "}
                <strong>
                  {currentStage} - {stageName}
                </strong>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tatsächliches Stadium
              </label>
              <select className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                <option>65 - Vollblüte (Aktuell)</option>
                <option>67 - Abblüte</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm"
            >
              Korrektur Senden
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Context Info (Confidence is shown here now) */}
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                  Aktueller Status
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {currentStage} - {stageName}
                </div>
              </div>
              <div className="text-right">
                {/* Confidence is kept here in the details */}
                <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
                  <HelpCircle size={12} /> Konfidenz
                </div>
                <div className="font-mono font-bold text-slate-700">
                  {confidencePercent}%
                </div>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorBbch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(val) =>
                      new Date(val).toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "2-digit",
                      })
                    }
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                  />
                  <Area
                    type="step"
                    dataKey="stage"
                    stroke="#16a34a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBbch)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="w-full py-2.5 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center gap-2 transition-colors"
            >
              <Edit3 size={16} /> Korrektur melden / Feedback
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
