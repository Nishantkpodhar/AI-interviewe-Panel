import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { useT } from '../../i18n';

export interface NegotiationCoachingData {
  tacticalNote: string;
  exactScript: string;
  showSilenceTimer: boolean;
  phase: string;
  theirOffer: number | null;
  yourTarget: number | null;
  currency: string;
}

interface NegotiationCoachingCardProps extends NegotiationCoachingData {
  interfaceTheme: 'default' | 'liquid-glass' | 'modern';
  isLightTheme: boolean;
  onSilenceTimerEnd: () => void;
}

const PHASE_LABELS: Record<string, string> = {
  opening: 'Opening',
  counter: 'Counter Offer',
  pressure: 'Pressure Test',
  closing: 'Closing',
};

const PHASE_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  opening: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: 'bg-blue-500/20' },
  counter: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: 'bg-amber-500/20' },
  pressure: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: 'bg-rose-500/20' },
  closing: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: 'bg-emerald-500/20' },
};

export const NegotiationCoachingCard: React.FC<NegotiationCoachingCardProps> = ({
  tacticalNote,
  exactScript,
  showSilenceTimer,
  phase,
  theirOffer,
  yourTarget,
  currency,
  interfaceTheme,
  isLightTheme,
  onSilenceTimerEnd,
}) => {
  const t = useT();
  const phaseColors = PHASE_COLORS[phase] || PHASE_COLORS.opening;
  const phaseLabel = PHASE_LABELS[phase] || 'Negotiation';

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
    const fmt = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    });
    return fmt.format(amount);
  };

  const gap = yourTarget !== null && theirOffer !== null
    ? Math.abs(yourTarget - theirOffer)
    : null;

  const isGlassTheme = interfaceTheme === 'liquid-glass';
  const isModernTheme = interfaceTheme === 'modern';

  const cardStyle: React.CSSProperties = isGlassTheme
    ? {
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
      }
    : isModernTheme
    ? {
        background: 'rgba(30, 30, 30, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="w-full ai-response-card my-2.5 relative group/code-card"
      style={{
        ...cardStyle,
        borderRadius: '16px',
        overflow: 'hidden',
        borderWidth: '1px',
      }}
    >
      {/* Phase Header */}
      <div
        className={`flex items-center gap-2 px-4 py-3 border-b ${phaseColors.border}`}
        style={{ backgroundColor: isGlassTheme ? 'rgba(255,255,255,0.05)' : isModernTheme ? 'rgba(255,255,255,0.03)' : undefined }}
      >
        <div className={`flex items-center justify-center w-7 h-7 rounded-full ${phaseColors.icon}`}>
          <AlertTriangle className={`w-3.5 h-3.5 ${phaseColors.text}`} />
        </div>
        <div>
          <div className={`text-[11px] font-semibold uppercase tracking-wider ${phaseColors.text}`}>
            {t('Negotiation Coaching')} — {phaseLabel}
          </div>
          <div className="text-[10px] font-mono opacity-60">
            {t('Their offer')}: {formatCurrency(theirOffer)} · {t('Your target')}: {formatCurrency(yourTarget)}
            {gap !== null && (
              <>
                <span className="mx-1">·</span>
                <span className="text-amber-400">Gap: {formatCurrency(gap)}</span>
              </>
            )}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onSilenceTimerEnd}
            className="p-1.5 rounded-full opacity-50 hover:opacity-100 hover:bg-white/10 transition-all"
            aria-label={t('Dismiss coaching card')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Tactical Note */}
        <div className="flex gap-3">
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${phaseColors.icon}`}>
            <ArrowRight className={`w-3 h-3 ${phaseColors.text}`} />
          </div>
          <div className="flex-1">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${phaseColors.text} mb-1`}>
              {t('Tactical Note')}
            </div>
            <div className="text-[13px] leading-relaxed overlay-text-primary whitespace-pre-wrap">
              {tacticalNote}
            </div>
          </div>
        </div>

        {/* Exact Script */}
        <div className="relative group/script-card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider overlay-text-muted">
              {t('Exact Script to Say')}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(exactScript)}
              className="p-1.5 rounded-full opacity-0 group-hover/script-card:opacity-100 hover:opacity-100 hover:bg-white/10 transition-opacity"
              aria-label={t('Copy script')}
            >
              <Check className="w-3.5 h-3.5 text-green-400" />
            </button>
          </div>
          <div
            className={`p-3 rounded-lg border font-mono text-[13px] leading-relaxed whitespace-pre-wrap cursor-pointer select-all ${isLightTheme ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/50 border-slate-700 text-slate-100'}`}
          >
            {exactScript}
          </div>
        </div>

        {/* Silence Timer */}
        {showSilenceTimer && (
          <AnimatePresence>
            <motion.div
              key="silence-timer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative p-3 rounded-lg border border-amber-500/30 bg-amber-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                    {t('Silence Timer Active')}
                  </div>
                </div>
                <div className="text-[13px] text-amber-300 leading-relaxed">
                  {t('Stay silent. Let them fill the gap.')}
                </div>
                <div className="mt-2 h-1.5 bg-amber-500/20 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: '100%' }}
                    transition={{ duration: 8000, ease: 'linear' }}
                    className="h-full bg-amber-400"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default NegotiationCoachingCard;