import React from "react"; import { motion, AnimatePresence } from "framer-motion"; import { X } from "lucide-react";

export default function GuidedToolModal({ open, onClose, tool }) {
  // si no hay tool o no está abierto, no mostramos nada
  if (!open || !tool) return null;

  const randomPunch =
    Array.isArray(tool.punchlines) && tool.punchlines.length > 0
      ? tool.punchlines[Math.floor(Math.random() * tool.punchlines.length)]
      : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-xl px-4 py-4 space-y-3 relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-200"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="space-y-1 pr-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                Today&apos;s tool — guided
              </p>
              <h2 className="text-sm font-semibold text-slate-50 leading-snug">
                {tool.title}
              </h2>
            </div>

            {/* HOW */}
            {Array.isArray(tool.how) && tool.how.length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400">How to do it:</p>
                <ul className="list-disc list-inside space-y-1 text-[12px] text-slate-200">
                  {tool.how.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* WHY */}
            {tool.why && (
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400">Why this helps:</p>
                <p className="text-[12px] text-slate-200 leading-snug">
                  {tool.why}
                </p>
              </div>
            )}

            {/* PUNCHLINE */}
            {randomPunch && (
              <p className="text-[12px] text-cyan-300 italic border-t border-slate-800 pt-2">
                “{randomPunch}”
              </p>
            )}

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] px-3 py-1.5 rounded-full border border-slate-600 text-slate-200 hover:bg-slate-800/80 transition-colors"
              >
                Ok, I get it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
