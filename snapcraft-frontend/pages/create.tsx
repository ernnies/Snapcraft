import { useState, useEffect } from "react";
import DragDropBuilder from "../components/DragDropBuilder";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import Shepherd from "shepherd.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Expanded actions with RWA and AI
const actions = [
  "Buy Token",
  "Sell Token",
  "Set Price Trigger",
  "Stake",
  "Unstake",
  "Add Liquidity",
  "Remove Liquidity",
  "Tokenize RWA",        // New: RWA integration
  "Invest in RWA Bond",  // New: Tokenized bonds/credit
  "Lend RWA Collateral",
  "AI Agent Optimize",   // New: Trigger autonomous AI decisions
];

export default function Create() {
  // Existing states...
  const [workflow, setWorkflow] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [workflows, setWorkflows] = useState<{ name: string; steps: string[] }[]>([{ name: "Default", steps: [] }]);
  const [activeWorkflow, setActiveWorkflow] = useState("Default");
  const [undoStack, setUndoStack] = useState<string[][]>([]);
  const [redoStack, setRedoStack] = useState<string[][]>([]);
  const [simulationResult, setSimulationResult] = useState<number | null>(null);
  const [performanceData, setPerformanceData] = useState({ successRate: 0.85, averageYield: 0.12 });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [progress, setProgress] = useState(0);
  const [rootHash, setRootHash] = useState<string | null>(null);

  // === NEW STATES ===
  const [gelatoTaskId, setGelatoTaskId] = useState<string | null>(null);
  const [automationMode, setAutomationMode] = useState<"manual" | "time" | "condition">("manual");
  const [triggerCondition, setTriggerCondition] = useState<string>(""); // e.g., "Every 4 hours" or "Price > 2000"
  
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  
  const [aiAgentActive, setAiAgentActive] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // === EXISTING FUNCTIONS (unchanged for brevity) ===
  const handleSave = async () => { /* ... existing ... */ };
  const handleExport = async () => { /* ... existing ... */ };
  const handleReport = async () => { /* ... existing ... */ };
  const simulateWorkflow = () => { /* ... existing ... */ };
  const undo = () => { /* ... existing ... */ };
  const redo = () => { /* ... existing ... */ };
  const updateWorkflows = () => { /* ... existing ... */ };
  const applyTemplate = (templateName: string) => { /* ... existing ... */ };
  const exportToCode = () => { /* ... existing ... */ };

  // === NEW: Gelato Automation Deployment ===
  const deployWithGelato = async () => {
    if (workflow.length === 0) {
      alert("Build a workflow first!");
      return;
    }
    setProgress(20);
    try {
      // Simulate Gelato task creation (replace with real SDK later)
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockTaskId = `gelato-${Math.random().toString(36).substr(2, 9)}`;
      setGelatoTaskId(mockTaskId);
      setHistory([...history, `Gelato Task Deployed: ${mockTaskId} | Mode: ${automationMode} | Trigger: ${triggerCondition || 'N/A'}`]);
      alert(`Success! Autonomous strategy deployed.\nGelato Task ID: ${mockTaskId}\nRuns ${automationMode === "time" ? "on schedule" : "on condition"}`);
      setProgress(100);
    } catch (err) {
      alert("Gelato deployment failed (simulated)");
    } finally {
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // === NEW: Natural Language Compiler ===
  const compileFromLanguage = () => {
    if (!naturalLanguageInput.trim()) {
      alert("Describe your strategy first!");
      return;
    }

    const input = naturalLanguageInput.toLowerCase();
    const newSteps: string[] = [];

    if (input.includes("buy") || input.includes("purchase")) newSteps.push("Buy Token");
    if (input.includes("sell")) newSteps.push("Sell Token");
    if (input.includes("stake") || input.includes("farm")) newSteps.push("Stake");
    if (input.includes("liquidity")) newSteps.push("Add Liquidity");
    if (input.includes("price") || input.includes("when")) newSteps.push("Set Price Trigger");
    if (input.includes("bond") || input.includes("treasury") || input.includes("rwa")) newSteps.push("Invest in RWA Bond");
    if (input.includes("optimize") || input.includes("auto")) newSteps.push("AI Agent Optimize");

    if (newSteps.length > 0) {
      setWorkflow(newSteps);
      updateWorkflows();
      setHistory([...history, `Compiled from text: "${naturalLanguageInput}"`]);
      alert(`Workflow generated:\n${newSteps.join(" → ")}`);
    } else {
      alert("Could not interpret strategy. Try: 'Buy when low, stake, sell high'");
    }
    setNaturalLanguageInput("");
  };

  // === NEW: AI Agent Suggestions ===
  useEffect(() => {
    if (aiAgentActive && workflow.length > 0) {
      const suggestions = [];
      if (workflow.includes("Buy Token") && !workflow.includes("Set Price Trigger")) {
        suggestions.push("Add price trigger for better entry");
      }
      if (workflow.includes("Stake")) {
        suggestions.push("Consider auto-compounding via AI");
      }
      if (workflow.some(step => step.includes("RWA"))) {
        suggestions.push("Diversify into tokenized credit for stable yield");
      }
      suggestions.push("Switch to higher APY pool if detected");
      setAiSuggestions(suggestions);
    } else {
      setAiSuggestions([]);
    }
  }, [workflow, aiAgentActive]);

  // === REST OF UI ===
  return (
    <div className={`min-h-screen font-sans ${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gradient-to-br from-gray-50 via-white to-blue-50"}`}>
      <header className={`shadow-md py-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-700">Infinio – Create Autonomous DeFi Strategy</h1>
          
          <div className="flex flex-wrap gap-2 items-center">
            {/* Existing buttons... (Save, Export, Simulate, etc.) */}

            {/* === NEW: AI Agent Toggle === */}
            <button
              onClick={() => setAiAgentActive(!aiAgentActive)}
              className={`px-5 py-2 rounded font-medium transition ${
                aiAgentActive 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                  : "bg-gray-600 text-white"
              }`}
            >
              {aiAgentActive ? "🤖 AI Agent Active" : "Activate AI Agent"}
            </button>

            {/* === NEW: Gelato Automation Mode === */}
            <select
              value={automationMode}
              onChange={(e) => setAutomationMode(e.target.value as any)}
              className="p-2 border rounded bg-white dark:bg-gray-700"
            >
              <option value="manual">Manual Trigger</option>
              <option value="time">Time-Based (Gelato)</option>
              <option value="condition">Condition-Based (Gelato)</option>
            </select>

            {automationMode !== "manual" && (
              <input
                type="text"
                value={triggerCondition}
                onChange={(e) => setTriggerCondition(e.target.value)}
                placeholder={automationMode === "time" ? "e.g., Every 6 hours" : "e.g., USDC > 1.01"}
                className="p-2 border rounded w-48"
              />
            )}

            <button
              onClick={deployWithGelato}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded font-semibold hover:shadow-xl"
            >
              Deploy with Gelato
            </button>

            {/* === NEW: Natural Language Input === */}
            <div className="flex gap-2">
              <textarea
                value={naturalLanguageInput}
                onChange={(e) => setNaturalLanguageInput(e.target.value)}
                placeholder="Type: Buy ETH when price drops, stake in vault, sell at 20% profit..."
                className="p-2 border rounded h-10 resize-none w-80"
              />
              <button
                onClick={compileFromLanguage}
                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
              >
                Compile
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* AI Agent Suggestions Panel */}
        {aiAgentActive && aiSuggestions.length > 0 && (
          <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg mb-6 border-l-4 border-purple-600">
            <h3 className="font-bold text-purple-800 dark:text-purple-200">🤖 AI Agent Suggestions</h3>
            <ul className="list-disc pl-6 mt-2">
              {aiSuggestions.map((s, i) => (
                <li key={i} className="text-purple-900 dark:text-purple-100">{s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Gelato Status */}
        {gelatoTaskId && (
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-6 border-l-4 border-green-600">
            <p className="font-semibold text-green-800 dark:text-green-200">
              ✅ Autonomous Strategy Running<br />
              Gelato Task ID: <code className="bg-white dark:bg-gray-800 px-2 rounded">{gelatoTaskId}</code>
            </p>
          </div>
        )}

        {/* Rest of your existing grid layout with DragDropBuilder, preview, analytics, etc. */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <DragDropBuilder workflow={workflow} setWorkflow={setWorkflow} actions={actions} /> {/* Pass expanded actions */}
          {/* ... other panels ... */}
        </div>
      </main>
    </div>
  );
}