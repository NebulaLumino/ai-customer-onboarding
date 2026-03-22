"use client";

import { useState } from "react";

const PRODUCT_TYPES = ["SaaS / Cloud Product", "Mobile App", "Marketplace", "Community Platform", "Course / Learning Platform", "Agency / Service"];
const TONES = ["Friendly & Conversational", "Professional & Formal", "Playful & Casual", "Empathetic & Supportive"];

export default function OnboardingEmailPage() {
  const [form, setForm] = useState({
    productName: "", productType: "SaaS / Cloud Product",
    keyFeatures: "", customerGoals: "", tone: "Friendly & Conversational",
  });
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeEmail, setActiveEmail] = useState(0);
  const [copied, setCopied] = useState(false);

  function update(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function generate() {
    if (!form.productName.trim()) return;
    setLoading(true);
    setEmails([]);
    setActiveEmail(0);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.emails) setEmails(data.emails);
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    const text = emails.map((e) =>
      `--- EMAIL ${e.day}: ${e.subject} ---\nTrigger: ${e.trigger}\nGoal: ${e.goal}\nSubject: ${e.subject}\nPreview: ${e.preview}\n\n${e.body}`
    ).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const triggerColors: Record<string, string> = {
    "immediately": "bg-green-100 text-green-700",
    "day 1": "bg-blue-100 text-blue-700",
    "day 3": "bg-indigo-100 text-indigo-700",
    "day 5": "bg-purple-100 text-purple-700",
    "day 7": "bg-amber-100 text-amber-700",
    "day 10": "bg-orange-100 text-orange-700",
    "day 14": "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
            SaaS Customer Success Tool
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">AI Onboarding Email Sequence</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Generate a 7-email onboarding sequence optimized for activation, education, and retention.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name *</label>
              <input value={form.productName} onChange={(e) => update("productName", e.target.value)}
                placeholder="Acme Pro"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Type</label>
              <select value={form.productType} onChange={(e) => update("productType", e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                {PRODUCT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tone</label>
              <select value={form.tone} onChange={(e) => update("tone", e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                {TONES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Key Features</label>
              <input value={form.keyFeatures} onChange={(e) => update("keyFeatures", e.target.value)}
                placeholder="e.g. Project management, team collaboration, analytics dashboards"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Customer Goals</label>
              <input value={form.customerGoals} onChange={(e) => update("customerGoals", e.target.value)}
                placeholder="e.g. Ship projects faster, reduce team friction, track KPIs"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>

          <button onClick={generate} disabled={loading || !form.productName.trim()}
            className="w-full mt-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-semibold py-4 rounded-xl transition-all text-lg shadow-lg shadow-sky-200">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Generating Sequence...
              </span>
            ) : "Generate Email Sequence"}
          </button>
        </div>

        {emails.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">7-Email Onboarding Sequence</h2>
              <button onClick={copyAll}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
                {copied ? "✓ Copied All" : "Copy All Emails"}
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {emails.map((e, i) => (
                <button key={i} onClick={() => setActiveEmail(i)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeEmail === i ? "bg-sky-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  Day {e.day}
                </button>
              ))}
            </div>
            {emails[activeEmail] && (() => {
              const email = emails[activeEmail];
              const triggerKey = email.trigger?.toLowerCase().includes("immediately") ? "immediately" : `day ${email.day}`;
              return (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${triggerColors[triggerKey] || "bg-slate-100 text-slate-600"}`}>
                        {email.trigger}
                      </span>
                      <span className="text-xs text-slate-400">Goal: {email.goal}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</p>
                      <p className="font-semibold text-slate-800">{email.subject}</p>
                      <p className="text-xs text-slate-400">Preview: {email.preview}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                      {email.body.split("[CTA:").map((part: string, i: number) =>
                        i === 0 ? <span key={i}>{part}</span> :
                          <span key={i}>
                            {" "}<button className="inline-block bg-sky-100 text-sky-700 font-semibold px-3 py-1 rounded-lg text-sm mx-0.5">{part.split("]")[0]}</button>{part.split("]")[1] || ""}
                          </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
