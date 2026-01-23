"use client";

import { useState, useEffect } from "react"; // <--- Add useEffect
import { FileSpreadsheet, FileText, Filter, Calendar } from "lucide-react";
import { clsx } from "clsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 1. Define the shape of a single row
type ReportEntry = {
  date: string;
  time: string;
  name: string;
  type: string;
  value: string;
  raw_value: string;
  status: string;
};

// 2. Generate Data (Unchanged)
const generateReportData = () => {
  const sensors = [
    { name: "Dendrometer Nord", type: "Dendrometer", unit: "mm growth" },
    { name: "Bodenfeuchte Tief", type: "Soil Moisture", unit: "%" },
    { name: "Klima Station", type: "Temperature", unit: "°C" },
  ];

  const data: ReportEntry[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    sensors.forEach((s) => {
      let val = 0;
      let status = "online";

      if (s.type === "Temperature") val = 12 + Math.random() * 5;
      if (s.type === "Soil Moisture") {
        val = 20 + Math.random() * 5;
        status = "warning";
      }
      if (s.type === "Dendrometer") val = 0.5 + Math.random() * 0.5;

      data.push({
        date: dateStr,
        time: "12:00",
        name: s.name,
        type: s.type,
        value: val.toFixed(2) + " " + s.unit,
        raw_value: val.toFixed(2),
        status: status,
      });
    });
  }
  return data.sort((a, b) => b.date.localeCompare(a.date));
};

export default function ReportsView() {
  // FIX STARTS HERE ------------------------------

  // 1. Start with an empty array to match the server (which has no data yet)
  const [reportData, setReportData] = useState<ReportEntry[]>([]);

  // 2. Generate the random data ONLY after the browser loads (Client-side)
  useEffect(() => {
    setReportData(generateReportData());
  }, []);

  // FIX ENDS HERE --------------------------------

  const handleExportCSV = () => {
    // ... (Keep existing CSV logic) ...
    const headers = [
      "Datum",
      "Uhrzeit",
      "Sensor Name",
      "Typ",
      "Messwert",
      "Status",
    ];
    const rows = reportData.map((row) => [
      row.date,
      row.time,
      row.name,
      row.type,
      row.raw_value,
      row.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `agridash_export_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    // ... (Keep existing PDF logic) ...
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("AgriDash - Sensor Bericht", 14, 20);
    doc.setFontSize(10);
    doc.text(`Erstellt am: ${new Date().toLocaleDateString("de-DE")}`, 14, 28);
    doc.text(`User: John Doe (Farm Manager)`, 14, 34);

    const tableBody = reportData.map((row) => [
      `${row.date} ${row.time}`,
      row.name,
      row.type,
      row.value,
      row.status,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Zeitstempel", "Sensor Name", "Typ", "Messwert", "Status"]],
      body: tableBody,
      theme: "striped",
      headStyles: { fillColor: [22, 163, 74] },
    });
    doc.save(`agridash_bericht_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Prevent hydration mismatch by not rendering the table until data exists
  // Optional: You could show a loading spinner here
  if (reportData.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">Lade Berichte...</div>
    );
  }

  return (
    <div className="space-y-6 p-6 h-full flex flex-col">
      {/* ... Keep your existing JSX return ... */}
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Berichte & Daten
          </h1>
          <p className="text-slate-500">
            Exportieren und analysieren Sie historische Sensordaten.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
          >
            <FileText size={18} /> PDF Bericht
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors"
          >
            <FileSpreadsheet size={18} /> CSV Export
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            placeholder="Suche nach Sensor..."
            className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-slate-200 rounded-lg text-sm flex items-center gap-2 text-slate-600 hover:bg-slate-50">
            <Filter size={16} /> Alle Typen
          </button>
          <button className="px-3 py-2 border border-slate-200 rounded-lg text-sm flex items-center gap-2 text-slate-600 hover:bg-slate-50">
            <Calendar size={16} /> Letzte 7 Tage
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Datum</th>
                <th className="px-6 py-4">Sensor Name</th>
                <th className="px-6 py-4">Typ</th>
                <th className="px-6 py-4">Messwert</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-600">
                    <span className="font-bold text-slate-900">{row.date}</span>{" "}
                    <span className="opacity-50 ml-1">{row.time}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{row.type}</td>
                  <td className="px-6 py-4 font-mono text-slate-700">
                    {row.value}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "px-2 py-1 rounded-full text-xs font-bold capitalize",
                        row.status === "online"
                          ? "bg-green-100 text-green-700"
                          : row.status === "warning"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700",
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
