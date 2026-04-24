"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitCompare, Sparkles, Users } from "lucide-react";
import { useSoulStore, SoulPreset } from "@/store/soulStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { featuredPresets, animePresets, gamesPresets, moviesPresets } from "@/data/presets";

interface PersonalityComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

const allPresets = [...featuredPresets, ...animePresets, ...gamesPresets, ...moviesPresets];

interface RadarData {
  label: string;
  value1: number;
  value2: number;
}

function generateRadarData(soul1: SoulPreset, soul2: SoulPreset): RadarData[] {
  return [
    { label: "Humor", value1: soul1.humor ?? 50, value2: soul2.humor ?? 50 },
    { label: "Formality", value1: soul1.formality ?? 50, value2: soul2.formality ?? 50 },
    { label: "Emoji Use", value1: soul1.emojiUsage ?? 30, value2: soul2.emojiUsage ?? 30 },
    { label: "Verbosity", value1: soul1.verbosity ?? 50, value2: soul2.verbosity ?? 50 },
    { label: "Consciousness", value1: soul1.consciousness ?? 50, value2: soul2.consciousness ?? 50 },
    { label: "Questioning", value1: soul1.questioning ?? 30, value2: soul2.questioning ?? 30 },
    { label: "Empathy", value1: soul1.empathy ?? 50, value2: soul2.empathy ?? 50 },
    { label: "Creativity", value1: soul1.creativity ?? 50, value2: soul2.creativity ?? 50 },
    { label: "Patience", value1: soul1.patience ?? 50, value2: soul2.patience ?? 50 },
  ];
}

function SimpleBarChart({ 
  data, 
  color1, 
  color2, 
  label1, 
  label2 
}: { 
  data: RadarData[]; 
  color1: string; 
  color2: string;
  label1: string;
  label2: string;
}) {
  const maxValue = 100;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", color1)} />
          <span className="text-slate-300 font-medium">{label1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", color2)} />
          <span className="text-slate-300 font-medium">{label2}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{item.label}</span>
              <span className="text-slate-500">{item.value1} vs {item.value2}</span>
            </div>
            <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden">
              {/* Background grid */}
              <div className="absolute inset-0 flex">
                {[25, 50, 75].map((tick) => (
                  <div
                    key={tick}
                    className="absolute h-full w-px bg-slate-700/50"
                    style={{ left: `${tick}%` }}
                  />
                ))}
              </div>
              
              {/* Bar 1 (top half) */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value1 / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className={cn("absolute top-0 left-0 h-[45%] rounded-full opacity-80", color1)}
              />
              
              {/* Bar 2 (bottom half) */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value2 / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.1 }}
                className={cn("absolute bottom-0 left-0 h-[45%] rounded-full opacity-80", color2)}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ComparisonBadge({ 
  label, 
  value1, 
  value2, 
  higherIsBetter = true 
}: { 
  label: string; 
  value1: number; 
  value2: number;
  higherIsBetter?: boolean;
}) {
  const diff = value1 - value2;
  const winner = higherIsBetter 
    ? (diff > 0 ? 1 : diff < 0 ? 2 : 0)
    : (diff < 0 ? 1 : diff > 0 ? 2 : 0);
  
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-3">
        <span className={cn(
          "text-sm font-medium",
          winner === 1 ? "text-emerald-400" : "text-slate-300"
        )}>
          {value1}%
        </span>
        <span className="text-slate-600">vs</span>
        <span className={cn(
          "text-sm font-medium",
          winner === 2 ? "text-emerald-400" : "text-slate-300"
        )}>
          {value2}%
        </span>
      </div>
    </div>
  );
}

export function PersonalityComparison({ isOpen, onClose }: PersonalityComparisonProps) {
  const { soul } = useSoulStore();
  const [selectedPreset, setSelectedPreset] = useState<SoulPreset | null>(null);
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentSoulAsPreset: SoulPreset = {
    id: "current",
    name: soul.name || "Current Soul",
    creature: soul.creature || "Custom",
    vibe: soul.vibe || "",
    emoji: soul.emoji || "🤖",
    coreTruths: soul.coreTruths,
    boundaries: soul.boundaries,
    vibeStyle: soul.vibeStyle,
    description: "Your current soul configuration",
    tags: ["custom"],
    source: "custom",
    humor: soul.humor,
    formality: soul.formality,
    emojiUsage: soul.emojiUsage,
    verbosity: soul.verbosity,
    consciousness: soul.consciousness,
    questioning: soul.questioning,
    empathy: soul.empathy,
    creativity: soul.creativity,
    patience: soul.patience,
  };

  const compareWith = selectedPreset || allPresets[0];
  const radarData = generateRadarData(currentSoulAsPreset, compareWith);

  const filteredPresets = allPresets.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const calculateSimilarity = () => {
    const differences = radarData.map(d => Math.abs(d.value1 - d.value2));
    const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
    return Math.round(100 - avgDiff);
  };

  const similarity = calculateSimilarity();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Personality Comparison</h2>
                <p className="text-sm text-slate-400">Compare your soul with preset personalities</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex h-[calc(90vh-88px)]">
            {/* Left Panel - Preset Selector */}
            <div className="w-80 border-r border-slate-800 p-4 flex flex-col">
              <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Select to Compare
              </h3>
              
              <input
                type="text"
                placeholder="Search presets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 mb-3"
              />
              
              <div className="flex-1 -mx-2 overflow-y-auto">
                <div className="space-y-1 px-2">
                  {filteredPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPreset(preset);
                        setShowPresetSelector(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                        selectedPreset?.id === preset.id
                          ? "bg-purple-500/20 border border-purple-500/50"
                          : "hover:bg-slate-800 border border-transparent"
                      )}
                    >
                      <span className="text-2xl">{preset.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{preset.name}</p>
                        <p className="text-xs text-slate-500 truncate">{preset.creature}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Comparison */}
            <div className="flex-1 p-6 overflow-auto">
              {/* Comparison Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-8">
                  {/* Current Soul */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl">
                      {soul.emoji || "🤖"}
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Current Soul</p>
                      <h3 className="text-xl font-bold text-white">{soul.name || "Unnamed"}</h3>
                      <p className="text-sm text-slate-400">{soul.creature || "Custom"}</p>
                    </div>
                  </div>

                  {/* VS Badge */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm border border-slate-700">
                      VS
                    </div>
                    {similarity >= 70 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                      </motion.div>
                    )}
                  </div>

                  {/* Compared Preset */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                      {compareWith.emoji}
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Compared To</p>
                      <h3 className="text-xl font-bold text-white">{compareWith.name}</h3>
                      <p className="text-sm text-slate-400">{compareWith.creature}</p>
                    </div>
                  </div>
                </div>

                {/* Similarity Score */}
                <div className="text-center">
                  <div className={cn(
                    "text-4xl font-bold",
                    similarity >= 70 ? "text-emerald-400" :
                    similarity >= 40 ? "text-yellow-400" : "text-red-400"
                  )}>
                    {similarity}%
                  </div>
                  <p className="text-sm text-slate-500">Similarity</p>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="grid grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="bg-slate-800/30 rounded-xl p-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-4">Attribute Comparison</h4>
                  <SimpleBarChart
                    data={radarData}
                    color1="bg-blue-500"
                    color2="bg-purple-500"
                    label1={soul.name || "Current"}
                    label2={compareWith.name}
                  />
                </div>

                {/* Detailed Stats */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-300">Detailed Breakdown</h4>
                  
                  <div className="space-y-2">
                    <ComparisonBadge
                      label="Humor"
                      value1={soul.humor}
                      value2={compareWith.humor ?? 50}
                      higherIsBetter={false}
                    />
                    <ComparisonBadge
                      label="Formality"
                      value1={soul.formality}
                      value2={compareWith.formality ?? 50}
                    />
                    <ComparisonBadge
                      label="Empathy"
                      value1={soul.empathy}
                      value2={compareWith.empathy ?? 50}
                    />
                    <ComparisonBadge
                      label="Creativity"
                      value1={soul.creativity}
                      value2={compareWith.creativity ?? 50}
                    />
                    <ComparisonBadge
                      label="Patience"
                      value1={soul.patience}
                      value2={compareWith.patience ?? 50}
                    />
                  </div>

                  {/* Key Differences */}
                  <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Key Differences</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      {radarData
                        .sort((a, b) => Math.abs(b.value1 - b.value2) - Math.abs(a.value1 - a.value2))
                        .slice(0, 3)
                        .map((item) => {
                          const diff = item.value1 - item.value2;
                          const higher = diff > 0 ? soul.name || "Current" : compareWith.name;
                          const amount = Math.abs(diff);
                          return (
                            <li key={item.label} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              <span>
                                {higher} is <span className="text-slate-300 font-medium">{amount}%</span> more {item.label.toLowerCase()}
                              </span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
