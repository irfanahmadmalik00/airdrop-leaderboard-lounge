
import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: any[];
  type: 'line' | 'area' | 'bar' | 'pie';
  xKey: string;
  yKey: string;
  height?: number;
  colors?: string[];
}

const ChartCard = ({ 
  title, 
  subtitle, 
  data, 
  type, 
  xKey, 
  yKey, 
  height = 300,
  colors = ['#00FF80', '#00CC66', '#009249', '#00FF80', '#39E991'] 
}: ChartCardProps) => {
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M' | '1Y' | 'ALL'>('ALL');
  
  // This would filter data based on timeframe if it was real data
  const filteredData = data;
  
  // Format large numbers
  const formatYAxis = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-crypto-gray p-3 border border-crypto-lightGray/50 rounded-lg shadow-lg">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-crypto-green font-medium">
            {type === 'pie' 
              ? `${payload[0].name}: ${payload[0].value}`
              : `${yKey}: ${payload[0].value.toLocaleString()}`
            }
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
          
          {/* Only show timeframe filters for time-series charts */}
          {type !== 'pie' && (
            <div className="flex space-x-1">
              {['1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
                <Button 
                  key={tf}
                  size="sm"
                  variant={timeframe === tf ? "default" : "outline"}
                  className={timeframe === tf 
                    ? "bg-crypto-green text-crypto-black hover:bg-crypto-darkGreen h-7 px-2" 
                    : "border-crypto-lightGray/50 text-gray-400 hover:text-white hover:bg-crypto-lightGray/30 h-7 px-2"
                  }
                  onClick={() => setTimeframe(tf as any)}
                >
                  {tf}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' && (
              <LineChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors[0]} stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey={xKey} 
                  stroke="#666" 
                  fontSize={12}
                  axisLine={{ stroke: '#333' }}
                  tickLine={{ stroke: '#333' }}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                  axisLine={{ stroke: '#333' }}
                  tickLine={{ stroke: '#333' }}
                  tickFormatter={formatYAxis}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey={yKey} 
                  stroke={colors[0]} 
                  strokeWidth={2}
                  dot={{ stroke: colors[0], strokeWidth: 2, r: 4, fill: '#121212' }}
                  activeDot={{ stroke: colors[0], strokeWidth: 2, r: 6, fill: colors[0] }}
                />
              </LineChart>
            )}
            
            {type === 'area' && (
              <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey={xKey} 
                  stroke="#666" 
                  fontSize={12}
                  axisLine={{ stroke: '#333' }}
                  tickLine={{ stroke: '#333' }}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                  axisLine={{ stroke: '#333' }}
                  tickLine={{ stroke: '#333' }}
                  tickFormatter={formatYAxis}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey={yKey} 
                  stroke={colors[0]} 
                  fillOpacity={1}
                  fill="url(#colorArea)" 
                />
              </AreaChart>
            )}
            
            {type === 'bar' && (
              <BarChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors[0]} stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey={xKey} 
                  stroke="#666" 
                  fontSize={12}
                  axisLine={{ stroke: '#333' }}
                  tickLine={{ stroke: '#333' }}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                  axisLine={{ stroke: '#333' }}
                  tickLine={{ stroke: '#333' }}
                  tickFormatter={formatYAxis}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey={yKey} 
                  fill="url(#colorBar)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
            
            {type === 'pie' && (
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={50}
                  dataKey={yKey}
                  nameKey={xKey}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value) => <span className="text-gray-300">{value}</span>}
                  iconType="circle"
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
