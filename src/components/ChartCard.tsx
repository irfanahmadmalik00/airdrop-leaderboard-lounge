
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ChartType = 'line' | 'bar' | 'pie';

interface ChartCardProps {
  title: string;
  description?: string;
  data: any[];
  type: ChartType;
  dataKey: string;
  xAxisDataKey?: string;
  colors?: string[];
  percentageChange?: number;
  showPercentage?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  height?: number;
  onClick?: () => void;
  tooltip?: string;
}

export const ChartCard = ({
  title,
  description,
  data,
  type,
  dataKey,
  xAxisDataKey = 'name',
  colors = ['#22c55e', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EC4899'],
  percentageChange,
  showPercentage = true,
  valuePrefix = '',
  valueSuffix = '',
  height = 300,
  onClick,
  tooltip
}: ChartCardProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const filteredData = data;
  
  // Format large numbers
  const formatYAxis = (value: number): string => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };
  
  // Custom tooltip
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-crypto-gray p-3 border border-crypto-lightGray/30 rounded-md shadow-lg">
          <p className="text-sm text-gray-300 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} className="text-sm font-medium" style={{ color: entry.color }}>
              {`${entry.name}: ${valuePrefix}${entry.value.toLocaleString()}${valueSuffix}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey={xAxisDataKey} 
                tick={{ fill: '#aaa' }} 
                axisLine={{ stroke: '#333' }} 
              />
              <YAxis 
                tickFormatter={formatYAxis} 
                tick={{ fill: '#aaa' }} 
                axisLine={{ stroke: '#333' }} 
              />
              <Tooltip content={renderCustomTooltip} />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={colors[0]} 
                strokeWidth={2} 
                dot={{ r: 3, strokeWidth: 1 }} 
                activeDot={{ r: 6, stroke: colors[0], strokeWidth: 1 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey={xAxisDataKey} 
                tick={{ fill: '#aaa' }} 
                axisLine={{ stroke: '#333' }} 
              />
              <YAxis 
                tickFormatter={formatYAxis} 
                tick={{ fill: '#aaa' }} 
                axisLine={{ stroke: '#333' }} 
              />
              <Tooltip content={renderCustomTooltip} />
              <Bar 
                dataKey={dataKey} 
                radius={[4, 4, 0, 0]}
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={hoveredIndex === index ? colors[0] : `${colors[0]}90`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey={dataKey}
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {filteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    stroke="transparent"
                    opacity={hoveredIndex === index ? 1 : 0.8}
                  />
                ))}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
              <Legend 
                formatter={(value) => <span style={{ color: '#ccc' }}>{value}</span>} 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Chart type not supported</div>;
    }
  };
  
  return (
    <Card className="glass-card overflow-hidden dark border-none" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium text-gray-100">
              {title}
              {tooltip && (
                <TooltipProvider>
                  <TooltipUI>
                    <TooltipTrigger asChild>
                      <Info className="inline ml-2 h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-crypto-gray border-crypto-lightGray/30 p-3 max-w-xs">
                      <p>{tooltip}</p>
                    </TooltipContent>
                  </TooltipUI>
                </TooltipProvider>
              )}
            </CardTitle>
            {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
          </div>
          {percentageChange !== undefined && showPercentage && (
            <div className={`flex items-center space-x-1 text-sm ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {percentageChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(percentageChange).toFixed(2)}%</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-0">
        {renderChart()}
      </CardContent>
      {onClick && (
        <CardFooter className="pt-4 pb-4">
          <Button variant="outline" size="sm" className="w-full text-xs text-gray-300 bg-crypto-lightGray/20 border-crypto-lightGray/30 hover:bg-crypto-lightGray/40">
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

// Add a default export that re-exports the named export
export default ChartCard;
