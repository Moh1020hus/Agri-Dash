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
import { BBCHData } from "@/types"; // Ensure you have this type or use 'any'

interface BBCHTrackerProps {
  data: BBCHData; // <--- NEW PROP
}

export default function BBCHTracker({ data }: BBCHTrackerProps) {
  // Use 'data' from props instead of 'MOCK_BBCH'
  const { currentStage, stageName, confidenceScore, history } = data;

  const [isModalOpen, setModalOpen] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const confidencePercent = Math.round(confidenceScore * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Vielen Dank! Ihre Korrektur wurde gespeichert.");
    setShowFeedbackForm(false);
    setModalOpen(false);
  };

  return (
    <>
      {/* CARD */}
      <div
        onClick={() => {
          setModalOpen(true);
          setShowFeedbackForm(false);
        }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 cursor-pointer hover:shadow-md hover:border-green-300 transition-all group relative flex flex-col items-center justify-center text-center h-full"
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-green-600">
          <Maximize2 size={14} />
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
          <Sprout size={12} /> Pflanzenstadium
        </div>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-black text-green-600 tracking-tighter leading-none mb-0.5">
            {currentStage}
          </div>
          <div className="text-lg font-bold text-slate-800 leading-none">
            {stageName}
          </div>
        </div>
        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-500">
          <span>{confidencePercent}% Konfidenz</span>
        </div>
      </div>

      {/* MODAL */}
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
            {/* ... (Form Content Same as Before) ... */}
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
            {/* ... Rest of form inputs ... */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm"
            >
              Korrektur Senden
            </button>
          </form>
        ) : (
          <div className="space-y-6">
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
                  {/* ... Chart Config Same as Before ... */}
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
                    fill="#dcfce7"
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
