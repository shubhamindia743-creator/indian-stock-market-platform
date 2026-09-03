import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  date: string;
  price: number;
  volume?: number;
  sma20?: number;
  sma50?: number;
}

interface ChartComponentProps {
  data: ChartData[];
  title?: string;
  type?: 'line' | 'area';
  height?: number;
  showVolume?: boolean;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  title,
  type = 'line',
  height = 400,
  showVolume = false,
}) => {
  const Chart = type === 'area' ? AreaChart : LineChart;
  const ChartElement = type === 'area' ? Area : Line;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {title && <h3 className="text-lg font-bold mb-4 text-gray-900">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <Chart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            interval={Math.floor(data.length / 10)}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          <ChartElement
            type="monotone"
            dataKey="price"
            stroke="#059669"
            fill="#d1fae5"
            name="Price"
          />
          {data[0]?.sma20 && (
            <ChartElement
              type="monotone"
              dataKey="sma20"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="SMA 20"
            />
          )}
          {data[0]?.sma50 && (
            <ChartElement
              type="monotone"
              dataKey="sma50"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="SMA 50"
            />
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
