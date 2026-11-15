import React, { useState } from 'react';

interface DataPoint {
  time: string;
  value: number;
}

interface TelemetryChartProps {
  title: string;
  unit: string;
  data: DataPoint[];
  color?: string; // hex or rgb
  strokeColor?: string;
  fillColor?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
  height?: number;
  yMin?: number;
  yMax?: number;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  title,
  unit,
  data,
  color = '#58C7FF',
  strokeColor = '#58C7FF',
  fillColor = 'rgba(88, 199, 255, 0.12)',
  warningThreshold,
  criticalThreshold,
  height = 160,
  yMin,
  yMax,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-xs font-mono text-[#64748B] border border-dashed border-[#1E2D44] rounded-lg">
        ACQUIRING TELEMETRY STREAM...
      </div>
    );
  }

  // Calculate Bounds
  const values = data.map((d) => d.value);
  const minVal = yMin !== undefined ? yMin : Math.min(...values) * 0.95;
  const maxVal = yMax !== undefined ? yMax : Math.max(...values) * 1.05;
  const range = maxVal - minVal || 1;

  const width = 500;
  const padding = { top: 15, right: 15, bottom: 25, left: 35 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (index: number) => padding.left + (index / (data.length - 1 || 1)) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - ((val - minVal) / range) * graphHeight;

  // Build SVG Path
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(data.length - 1)},${padding.top + graphHeight} L ${padding.left},${padding.top + graphHeight} Z`;

  const latest = data[data.length - 1];

  return (
    <div className="space-card p-4 rounded-xl flex flex-col justify-between relative group">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-mono tracking-wider text-[#94A3B8] uppercase">{title}</span>
        </div>
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-lg font-bold text-[#F8FAFC]">
            {latest ? (typeof latest.value === 'number' ? latest.value.toFixed(1) : latest.value) : '--'}
          </span>
          <span className="text-[10px] text-[#64748B]">{unit}</span>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + graphHeight * pct;
            const val = maxVal - pct * range;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(88, 199, 255, 0.08)"
                  strokeDasharray="2 3"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] font-mono fill-[#64748B]"
                >
                  {val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Warning threshold line */}
          {warningThreshold !== undefined && warningThreshold >= minVal && warningThreshold <= maxVal && (
            <line
              x1={padding.left}
              y1={getY(warningThreshold)}
              x2={width - padding.right}
              y2={getY(warningThreshold)}
              stroke="#F59E0B"
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.6"
            />
          )}

          {/* Critical threshold line */}
          {criticalThreshold !== undefined && criticalThreshold >= minVal && criticalThreshold <= maxVal && (
            <line
              x1={padding.left}
              y1={getY(criticalThreshold)}
              x2={width - padding.right}
              y2={getY(criticalThreshold)}
              stroke="#EF4444"
              strokeWidth="1.2"
              strokeDasharray="4 2"
              opacity="0.8"
            />
          )}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#grad-${title.replace(/\s+/g, '')})`} />

          {/* Line Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Latest Point Pulsing Dot */}
          {latest && (
            <g transform={`translate(${getX(data.length - 1)}, ${getY(latest.value)})`}>
              <circle r="6" fill={color} opacity="0.3" className="animate-ping" />
              <circle r="3" fill="#FFFFFF" stroke={color} strokeWidth="1.5" />
            </g>
          )}

          {/* Invisible hover trigger zones */}
          {data.map((d, i) => (
            <rect
              key={i}
              x={getX(i) - graphWidth / (data.length * 2)}
              y={padding.top}
              width={graphWidth / data.length}
              height={graphHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoveredPoint(d)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Hover indicator */}
          {hoveredPoint && (
            <g transform={`translate(${getX(data.indexOf(hoveredPoint))}, ${getY(hoveredPoint.value)})`}>
              <circle r="4" fill="#FFFFFF" stroke={color} strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* Hover Tooltip display */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-[#0A101B]/90 border border-[#58C7FF]/40 text-[10px] font-mono text-[#F8FAFC] shadow-md pointer-events-none">
            {hoveredPoint.time}: <strong style={{ color }}>{hoveredPoint.value.toFixed(1)} {unit}</strong>
          </div>
        )}
      </div>

      {/* Footer Timestamp Bounds */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#64748B] pt-1 border-t border-[#1E2D44]/40 mt-1">
        <span>{data[0]?.time || 'T-60s'}</span>
        <span className="text-[#58C7FF]/80">LIVE BUFFER</span>
        <span>{latest?.time || 'NOW'}</span>
      </div>
    </div>
  );
};
