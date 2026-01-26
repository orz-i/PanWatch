import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export interface SuggestionInfo {
  action: string  // buy/add/reduce/sell/hold/watch
  action_label: string
  signal: string
  reason: string
  should_alert: boolean
  raw?: string
}

export interface KlineSummary {
  trend: string
  macd_status: string
  recent_5_up: number
  change_5d: number | null
  change_20d: number | null
  ma5: number | null
  ma10: number | null
  ma20: number | null
  support: number | null
  resistance: number | null
}

interface SuggestionBadgeProps {
  suggestion: SuggestionInfo | null
  stockName?: string
  stockSymbol?: string
  kline?: KlineSummary | null
  showFullInline?: boolean  // 是否在行内显示完整信息（Dashboard 模式）
}

const actionColors: Record<string, string> = {
  buy: 'bg-rose-500 text-white',
  add: 'bg-rose-400 text-white',
  reduce: 'bg-emerald-500 text-white',
  sell: 'bg-emerald-600 text-white',
  hold: 'bg-amber-500 text-white',
  watch: 'bg-slate-500 text-white',
}

export function SuggestionBadge({
  suggestion,
  stockName,
  stockSymbol,
  kline,
  showFullInline = false
}: SuggestionBadgeProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!suggestion) return null

  const colorClass = actionColors[suggestion.action] || 'bg-slate-500 text-white'

  // Dashboard 模式：行内显示完整信息
  if (showFullInline) {
    return (
      <div className="pt-3 border-t border-border/30">
        <div className="flex items-start gap-3">
          <span className={`text-[11px] px-2 py-1 rounded font-medium shrink-0 ${colorClass}`}>
            {suggestion.action_label}
          </span>
          <div className="flex-1 min-w-0">
            {suggestion.signal && (
              <p className="text-[12px] font-medium text-foreground mb-0.5">{suggestion.signal}</p>
            )}
            {suggestion.reason ? (
              <p className="text-[11px] text-muted-foreground">{suggestion.reason}</p>
            ) : suggestion.raw && !suggestion.signal ? (
              <p className="text-[11px] text-muted-foreground">{suggestion.raw}</p>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  // 持仓页模式：小徽章 + 点击弹窗
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setDialogOpen(true)
        }}
        className={`text-[10px] px-1.5 py-0.5 rounded font-medium cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
        title="点击查看 AI 建议详情"
      >
        {suggestion.action_label}
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className={`text-[12px] px-2 py-1 rounded font-medium ${colorClass}`}>
                {suggestion.action_label}
              </span>
              {stockName && (
                <span className="text-[14px] font-normal text-muted-foreground">
                  {stockName} {stockSymbol && `(${stockSymbol})`}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 信号 */}
            {suggestion.signal && (
              <div>
                <div className="text-[11px] text-muted-foreground mb-1">信号</div>
                <p className="text-[13px] font-medium text-foreground">{suggestion.signal}</p>
              </div>
            )}

            {/* 理由 */}
            {(suggestion.reason || suggestion.raw) && (
              <div>
                <div className="text-[11px] text-muted-foreground mb-1">理由</div>
                <p className="text-[13px] text-foreground">
                  {suggestion.reason || suggestion.raw}
                </p>
              </div>
            )}

            {/* 技术指标 */}
            {kline && (
              <div>
                <div className="text-[11px] text-muted-foreground mb-2">技术指标</div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-accent/50 text-muted-foreground">
                    {kline.trend}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-accent/50 text-muted-foreground">
                    {kline.macd_status}
                  </span>
                  {kline.support && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      支撑 {kline.support.toFixed(2)}
                    </span>
                  )}
                  {kline.resistance && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600">
                      压力 {kline.resistance.toFixed(2)}
                    </span>
                  )}
                </div>
                {(kline.change_5d !== null || kline.change_20d !== null) && (
                  <div className="flex gap-4 mt-2 text-[11px] text-muted-foreground">
                    {kline.change_5d !== null && (
                      <span>5日: <span className={kline.change_5d >= 0 ? 'text-rose-500' : 'text-emerald-500'}>
                        {kline.change_5d >= 0 ? '+' : ''}{kline.change_5d.toFixed(2)}%
                      </span></span>
                    )}
                    {kline.change_20d !== null && (
                      <span>20日: <span className={kline.change_20d >= 0 ? 'text-rose-500' : 'text-emerald-500'}>
                        {kline.change_20d >= 0 ? '+' : ''}{kline.change_20d.toFixed(2)}%
                      </span></span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
