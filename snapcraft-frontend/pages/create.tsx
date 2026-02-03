import { useState, useEffect } from "react";
import DragDropBuilder from "../components/DragDropBuilder";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import Shepherd from "shepherd.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Expanded actions (RWA + AI)
const actions = [
  "Buy Token",
  "Sell Token",
  "Set Price Trigger",
  "Stake",
  "Unstake",
  "Add Liquidity",
  "Remove Liquidity",
  "Tokenize RWA",
  "Invest in RWA Bond",
  "Lend RWA Collateral",
  "AI Agent Optimize",
];

export default function Create() {
  const [workflow, setWorkflow] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [workflows, setWorkflows] = useState<{ name: string; steps: string[] }[]>([{ name: "Default", steps: [] }]);
  const [activeWorkflow, setActiveWorkflow] = useState("Default");
  const [undoStack, setUndoStack] = useState<string[][]>([]);
  const [redoStack, setRedoStack] = useState<string[][]>([]);
  const [simulationResult, setSimulationResult] = useState<number | null>(null);
  const [performanceData] = useState({ successRate: 0.85, averageYield: 0.12 });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [progress, setProgress] = useState(0);
  const [rootHash, setRootHash] = useState<string | null>(null);

  // ── New states ────────────────────────────────────────
  const [gelatoTaskId, setGelatoTaskId] = useState<string | null>(null);
  const [automationMode, setAutomationMode] = useState<"manual" | "time" | "condition">("manual");
  const [triggerCondition, setTriggerCondition] = useState<string>("");

  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [aiAgentActive, setAiAgentActive] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // ── Core functions ─────────────────────────────────────

  const updateWorkflows = () => {
    setWorkflows((prev) =>
      prev.map((w) => (w.name === activeWorkflow ? { ...w, steps: workflow } : w))
    );
    setUndoStack((prev) => [...prev, workflow]);
  };

  const switchWorkflow = (name: string) => {
    const selected = workflows.find((w) => w.name === name);
    if (selected) {
      setWorkflow(selected.steps);
      setActiveWorkflow(name);
    }
  };

  const addWorkflow = () => {
    const name = prompt("Enter workflow name") || `Workflow ${workflows.length + 1}`;
    setWorkflows([...workflows, { name, steps: [] }]);
    setActiveWorkflow(name);
    setWorkflow([]);
  };

  const applyTemplate = (templateName: string) => {
    const templates: Record<string, string[]> = {
      "Basic Trading": ["Buy Token", "Set Price Trigger", "Sell Token"],
      "Yield Farming": ["Buy Token", "Stake", "AI Agent Optimize"],
      "RWA Entry": ["Tokenize RWA", "Invest in RWA Bond", "Lend RWA Collateral"],
    };
    const steps = templates[templateName] || [];
    setWorkflow(steps);
    updateWorkflows();
    setHistory((prev) => [...prev, `Applied template: ${templateName}`]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, workflow]);
    setWorkflow(previous);
    setUndoStack((prev) => prev.slice(0, -1));
    updateWorkflows();
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, workflow]);
    setWorkflow(next);
    setRedoStack((prev) => prev.slice(0, -1));
    updateWorkflows();
  };

  const simulateWorkflow = () => {
    setProgress(10);
    const interval = setInterval(() => setProgress((p) => Math.min(p + 25, 90)), 600);

    setTimeout(() => {
      clearInterval(interval);
      const profit = Math.round((Math.random() * 800 + 200) * (workflow.length / 3));
      setSimulationResult(profit);
      setHistory((prev) => [...prev, `Simulation → Estimated profit: $${profit}`]);
      setProgress(100);
      setTimeout(() => setProgress(0), 1200);
    }, 2400);
  };

  const handleSave = async () => {
    if (workflow.length === 0) return alert("Build a workflow first");
    setProgress(20);

    // Replace with real backend call
    try {
      await new Promise((r) => setTimeout(r, 1800));
      const mockHash = "0x" + Math.random().toString(16).slice(2, 18);
      setRootHash(mockHash);
      setHistory((prev) => [...prev, `Saved to storage — Root hash: ${mockHash}`]);
      alert(`Workflow saved! Root hash: ${mockHash}`);
      updateWorkflows();
      setProgress(100);
    } catch {
      alert("Save failed (mock)");
    } finally {
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleExport = async () => {
    if (!rootHash) return alert("Save workflow first");
    setProgress(30);
    // mock download
    await new Promise((r) => setTimeout(r, 1400));
    alert(`Exported workflow.json (root: ${rootHash})`);
    setProgress(100);
    setTimeout(() => setProgress(0), 800);
  };

  const handleReport = async () => {
    setProgress(25);
    await new Promise((r) => setTimeout(r, 2000));
    alert("PDF report generated (mock)");
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);
  };

  // ── New: Gelato mock deployment ────────────────────────
  const deployWithGelato = async () => {
    if (workflow.length === 0) return alert("Build a workflow first!");
    setProgress(20);
    try {
      await new Promise((r) => setTimeout(r, 2200));
      const mockId = `gelato-task-${Math.random().toString(36).slice(2, 10)}`;
      setGelatoTaskId(mockId);
      setHistory((prev) => [
        ...prev,
        `Gelato Task Created: ${mockId} • ${automationMode} • ${triggerCondition || "—"}`,
      ]);
      alert(`Strategy deployed!\nTask ID: ${mockId}`);
      setProgress(100);
    } catch {
      alert("Deployment simulation failed");
    } finally {
      setTimeout(() => setProgress(0), 1200);
    }
  };

  // ── New: Natural language → steps ──────────────────────
  const compileFromLanguage = () => {
    if (!naturalLanguageInput.trim()) return alert("Please describe your strategy");

    const text = naturalLanguageInput.toLowerCase();
    const steps: string[] = [];

    if (text.includes("buy") || text.includes("purchase")) steps.push("Buy Token");
    if (text.includes("sell")) steps.push("Sell Token");
    if (text.match(/stake|farm|yields/)) steps.push("Stake");
    if (text.includes("unstake")) steps.push("Unstake");
    if (text.includes("liquidity") || text.includes("pool")) steps.push("Add Liquidity");
    if (text.includes("price") || text.includes("when") || text.includes("trigger")) steps.push("Set Price Trigger");
    if (text.match(/rwa|bond|real.*world|tokeni[sz]e/)) steps.push("Invest in RWA Bond");
    if (text.includes("ai") || text.includes("auto") || text.includes("optim")) steps.push("AI Agent Optimize");

    if (steps.length === 0) {
      alert("Couldn't understand the strategy.\nTry: \"buy eth when low, stake, sell at +15%\"");
      return;
    }

    setWorkflow(steps);
    updateWorkflows();
    setHistory((prev) => [...prev, `Compiled: "${naturalLanguageInput}" → ${steps.join(" → ")}`]);
    alert(`Generated workflow:\n${steps.join(" → ")}`);
    setNaturalLanguageInput("");
  };

  // ── AI Agent suggestions ───────────────────────────────
  useEffect(() => {
    if (!aiAgentActive || workflow.length === 0) {
      setAiSuggestions([]);
      return;
    }

    const tips: string[] = [];

    if (workflow.includes("Buy Token") && !workflow.some((s) => s.includes("Trigger")))
      tips.push("Add a price trigger to improve entry timing");

    if (workflow.includes("Stake") && !workflow.includes("Unstake"))
      tips.push("Consider adding Unstake or auto-compound logic");

    if (workflow.some((s) => s.includes("RWA")) && workflow.length < 3)
      tips.push("Diversify — try adding Lend RWA Collateral or Tokenize RWA");

    if (workflow.includes("Sell Token"))
      tips.push("Add trailing stop or profit target via AI Agent Optimize");

    tips.push("Enable time/condition trigger for full autonomy");

    setAiSuggestions(tips);
  }, [workflow, aiAgentActive]);

  // ── Chart data ─────────────────────────────────────────
  const chartData = {
    labels: ["Success Rate", "Average Yield"],
    datasets: [
      {
        label: "Performance",
        data: [performanceData.successRate * 100, performanceData.averageYield * 100],
        backgroundColor: ["rgba(59,130,246,0.65)", "rgba(16,185,129,0.65)"],
        borderColor: ["rgb(59,130,246)", "rgb(16,185,129)"],
        borderWidth: 1,
      },
    ],
  };

  // ── JSX ─────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950 text-gray-200" : "bg-gradient-to-br from-gray-50 via-white to-blue-50/40"} font-sans`}>
      <header className={`shadow-lg py-4 ${theme === "dark" ? "bg-gray-900" : "bg-white/90 backdrop-blur-sm"}`}>
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400">
            FlowSnap – Autonomous DeFi Builder
          </h1>

          <div className="flex flex-wrap gap-2 md:gap-3 items-center">
            <select
              value={activeWorkflow}
              onChange={(e) => switchWorkflow(e.target.value)}
              className="px-3 py-2 bg-white/80 dark:bg-gray-800 border rounded text-sm"
            >
              {workflows.map((w) => (
                <option key={w.name} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>

            <button
              onClick={addWorkflow}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              + New
            </button>

            <select
              onChange={(e) => applyTemplate(e.target.value)}
              defaultValue=""
              className="px-3 py-2 bg-white/80 dark:bg-gray-800 border rounded text-sm"
            >
              <option value="" disabled>
                Templates…
              </option>
              <option value="Basic Trading">Basic Trading</option>
              <option value="Yield Farming">Yield Farming</option>
              <option value="RWA Entry">RWA Entry</option>
            </select>

            <button
              onClick={() => setAiAgentActive(!aiAgentActive)}
              className={`px-4 py-2 rounded font-medium text-sm transition-all ${
                aiAgentActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              {aiAgentActive ? "🤖 AI Active" : "AI Agent"}
            </button>

            <select
              value={automationMode}
              onChange={(e) => setAutomationMode(e.target.value as any)}
              className="px-3 py-2 bg-white/80 dark:bg-gray-800 border rounded text-sm"
            >
              <option value="manual">Manual</option>
              <option value="time">Time-based</option>
              <option value="condition">Condition</option>
            </select>

            {automationMode !== "manual" && (
              <input
                value={triggerCondition}
                onChange={(e) => setTriggerCondition(e.target.value)}
                placeholder={automationMode === "time" ? "e.g. every 4h" : "e.g. ETH > 4200"}
                className="px-3 py-2 border rounded w-44 text-sm dark:bg-gray-800"
              />
            )}

            <button
              onClick={deployWithGelato}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded font-medium shadow-md text-sm"
            >
              Deploy Gelato
            </button>

            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">
              Save
            </button>
            <button onClick={handleExport} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium">
              Export
            </button>
            <button onClick={handleReport} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm font-medium">
              Report
            </button>

            <button onClick={simulateWorkflow} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded text-sm font-medium">
              Simulate
            </button>

            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded disabled:opacity-40 text-sm font-medium"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={redoStack.length === 0}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded disabled:opacity-40 text-sm font-medium"
            >
              Redo
            </button>

            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Quick inputs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex gap-2">
            <textarea
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
              placeholder="Describe strategy in plain English…  e.g. buy ETH when it drops 8%, stake in Aave, sell at +18%"
              className="flex-1 p-3 border rounded-lg resize-none h-14 text-sm dark:bg-gray-800 dark:border-gray-700"
            />
            <button
              onClick={compileFromLanguage}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg font-medium self-end mb-1"
            >
              Compile
            </button>
          </div>
        </div>

        {/* AI Suggestions */}
        {aiAgentActive && aiSuggestions.length > 0 && (
          <div className="bg-purple-100/70 dark:bg-purple-950/40 border-l-4 border-purple-500 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
              <span>🤖 AI Agent Recommendations</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-purple-900 dark:text-purple-200">
              {aiSuggestions.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Gelato Status */}
        {gelatoTaskId && (
          <div className="bg-green-100/70 dark:bg-green-950/40 border-l-4 border-green-600 p-4 rounded-lg mb-6">
            <p className="font-medium text-green-800 dark:text-green-300">
              ✅ Strategy deployed autonomously
              <br />
              Gelato Task: <code className="bg-white/60 dark:bg-black/40 px-2 py-0.5 rounded">{gelatoTaskId}</code>
            </p>
          </div>
        )}

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Builder */}
          <div className="lg:col-span-2">
            <DragDropBuilder workflow={workflow} setWorkflow={setWorkflow} actions={actions} />
          </div>

          {/* Right: Panels */}
          <div className="lg:col-span-3 space-y-6">
            {/* Workflow + Simulation */}
            <div className="bg-white/80 dark:bg-gray-800/70 p-5 rounded-xl shadow-sm border dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">Current Workflow</h2>
              {workflow.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic">Drag actions or compile from text</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {workflow.map((step, i) => (
                    <div
                      key={i}
                      className="bg-blue-100 dark:bg-blue-950/60 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              )}
              {simulationResult !== null && (
                <p className="mt-4 text-green-700 dark:text-green-400 font-medium">
                  Simulation result: ≈ ${simulationResult.toLocaleString()} profit
                </p>
              )}
            </div>

            {/* History */}
            <div className="bg-white/80 dark:bg-gray-800/70 p-5 rounded-xl shadow-sm border dark:border-gray-700 max-h-60 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">History</h2>
              {history.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic text-sm">Actions appear here…</p>
              ) : (
                <ul className="space-y-1.5 text-sm">
                  {history.slice(-12).map((entry, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">
                      {entry}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Analytics Chart */}
            <div className="bg-white/80 dark:bg-gray-800/70 p-5 rounded-xl shadow-sm border dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-400">Performance Overview</h2>
              <div className="h-64">
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </div>
            </div>

            {/* Progress bar when active */}
            {progress > 0 && (
              <div className="bg-white/80 dark:bg-gray-800/70 p-4 rounded-xl shadow-sm">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-xs mt-1.5 text-gray-600 dark:text-gray-400">{progress}%</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}