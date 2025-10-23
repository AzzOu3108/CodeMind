import React from 'react'
import Cards from './Cards'
import {LineChart, Line, ResponsiveContainer, Tooltip, Area, AreaChart} from "recharts";

const data = [
  { value: 100 },
  { value: 400 },
  { value: 200 },
  { value: 600 },
  { value: 300 },
  { value: 500 },
];

const EmptyTooltip: React.FC = () => null;

export default function AboutChartCard() {
  return (
     <Cards
      title="Subscriptions"
      description="+2000"
      icon={null}
      iconBackground={false}
      className="text-xl"
      chart={
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip cursor={false} content={<EmptyTooltip />} /> 
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              fill="url(#colorUv)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      }
    />
  )
}
