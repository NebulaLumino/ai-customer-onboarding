"use client";
import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-7 mb-3">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-base font-bold text-teal-700 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-gray-700 text-sm ml-4 mb-1 list-disc">{trimmed.replace("- ","")}</li>;
    if (trimmed.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-teal-400 pl-4 italic text-gray-600 text-sm my-3">{trimmed.replace("> ","")}</blockquote>;
    if (trimmed.startsWith("**") && trimmed.includes(":**")) return <p key={i} className="text-teal-800 font-bold text-sm mt-3 mb-1">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-gray-700 text-sm leading-relaxed mb-1">{trimmed}</p>;
  });
}

export default function Home() {
  const [productType, setProductType] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [customerGoals, setCustomerGoals] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!productType.trim()) { setError("Please enter the product type."); return; }
    setLoading(true); setError(""); setResult(""); setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType, keyFeatures, customerGoals, deliveryDays }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResult(data.result); setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📧 AI Onboarding Email Sequence</h1>
          <p className="text-gray-600">Generate a 5-7 email sequence that activates and delights new customers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
            <input value={productType} onChange={e => setProductType(e.target.value)} placeholder="e.g. SaaS project management tool, online course, e-commerce platform"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
            <textarea value={keyFeatures} onChange={e => setKeyFeatures(e.target.value)} rows={3}
              placeholder="List the top 3-5 features customers care about most..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none resize-none text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Goals</label>
              <input value={customerGoals} onChange={e => setCustomerGoals(e.target.value)} placeholder="e.g. Save time, close deals faster"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Spacing</label>
              <input value={deliveryDays} onChange={e => setDeliveryDays(e.target.value)} placeholder="e.g. Every 2-3 days"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm" />
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button onClick={generate} disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-3 rounded-lg transition-colors">
            {loading ? "Generating email sequence..." : "Generate Onboarding Emails"}
          </button>
        </div>

        {done && result && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-teal-50 border-b border-teal-200">
              <p className="text-teal-800 font-bold text-sm">📧 Onboarding Email Sequence</p>
              <button onClick={() => navigator.clipboard?.writeText(result)}
                className="px-3 py-1.5 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-800 text-xs font-medium transition-all">
                📋 Copy All
              </button>
            </div>
            <div className="px-6 py-5">
              {renderMarkdown(result)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
