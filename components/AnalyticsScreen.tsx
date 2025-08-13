import { useState } from 'react';
import { TrendingUp, Calendar, Target, Award, BarChart3, LineChart, PieChart, Activity, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScreenHeader } from './ui/screen-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AIInsights } from './AIInsights';
import { EarnedBadgesSection } from './EarnedBadgesSection';


import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { AreaChart, Area, LineChart as RechartsLineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { useData } from '../contexts/DataContext';

interface AnalyticsScreenProps {
  onBack: () => void;
}

type TimeFrame = 'day' | 'week' | 'month' | 'custom';

interface MetricToggle {
  key: string;
  label: string;
  color: string;
  enabled: boolean;
}

interface EnergyMetric {
  key: string;
  label: string;
  color: string;
  enabled: boolean;
}



export function AnalyticsScreen({ onBack }: AnalyticsScreenProps) {
  const { getAnalyticsData, trackingEntries } = useData();
  const [timeframe, setTimeframe] = useState<TimeFrame>('week');
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Metric selection for the multiline chart with new color palette
  const [metrics, setMetrics] = useState<MetricToggle[]>([
    { key: 'physicalEnergy', label: 'Physical Energy', color: '#c45e99', enabled: true }, // magenta
    { key: 'cognitiveClarity', label: 'Cognitive Clarity', color: '#953599', enabled: true }, // purple
    { key: 'mood', label: 'Mood', color: '#f5855f', enabled: true }, // orange
    { key: 'stress', label: 'Stress', color: '#ce0069', enabled: false }, // fuchsia
    { key: 'sleep', label: 'Sleep Quality', color: '#f2bf3f', enabled: false }, // yellow
  ]);

  // Get analytics data with safe defaults
  const rawData = getAnalyticsData(timeframe === 'custom' ? 'week' : timeframe);
  
  // Provide safe defaults for all data and log for debugging
  const data = {
    currentStreak: rawData?.currentStreak || 0,
    avgEnergy: rawData?.avgEnergy || 0,
    totalEntries: rawData?.totalEntries || 0,
    bestStreak: rawData?.currentStreak || 0,
    chartData: rawData?.chartData || [],
    energyLevelData: rawData?.historyData || [],
    patterns: rawData?.patterns || [],
    correlations: rawData?.correlationData || [],
    moodDistribution: generateMoodDistribution(rawData?.historyData || []),
    insights: generateInsights(rawData)
  };

  // Debug logging
  console.log('Analytics Screen - Raw Data:', {
    hasRawData: !!rawData,
    chartDataLength: data.chartData?.length,
    sampleChartData: data.chartData?.slice(0, 3),
    totalEntries: data.totalEntries,
    avgEnergy: data.avgEnergy
  });



  // Generate mood distribution from history data
  function generateMoodDistribution(historyData: any[]) {
    if (!historyData || historyData.length === 0) {
      return [
        { name: 'Happy', count: 45, percentage: 45 },
        { name: 'Neutral', count: 30, percentage: 30 },
        { name: 'Excited', count: 15, percentage: 15 },
        { name: 'Anxious', count: 7, percentage: 7 },
        { name: 'Sad', count: 3, percentage: 3 }
      ];
    }

    return [
      { name: 'Happy', count: 45, percentage: 45 },
      { name: 'Neutral', count: 30, percentage: 30 },
      { name: 'Excited', count: 15, percentage: 15 },
      { name: 'Anxious', count: 7, percentage: 7 },
      { name: 'Sad', count: 3, percentage: 3 }
    ];
  }

  // Generate insights
  function generateInsights(rawData: any) {
    return {
      bestTimeOfDay: 'midday',
      trend: rawData?.avgEnergy > 60 ? 'improving' : 'stable'
    };
  }

  // Sample chart data for when no real data exists
  function getSampleChartData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => {
      // Create more realistic patterns with guaranteed data points
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - (6 - index)); // Go back from current day
      
      // Create realistic energy patterns with some variability
      const isWeekend = day === 'Sat' || day === 'Sun';
      const isMonday = day === 'Mon';
      const isFriday = day === 'Fri';
      
      let physicalBase = 60;
      let cognitiveBase = 65;
      let moodBase = 65;
      let stressBase = 40; // Lower is better for stress
      let sleepBase = 70;
      
      // Weekend patterns
      if (isWeekend) {
        physicalBase += 10;
        sleepBase += 15;
        stressBase -= 10; // Less stress
        moodBase += 10;
      }
      
      // Monday blues
      if (isMonday) {
        physicalBase -= 15;
        cognitiveBase -= 10;
        moodBase -= 15;
        stressBase += 15;
      }
      
      // Friday energy
      if (isFriday) {
        moodBase += 15;
        physicalBase += 5;
        stressBase -= 5;
      }
      
      // Add controlled randomness but ensure values are always present
      const randomVariation = () => (Math.random() - 0.5) * 20;
      
      return {
        day,
        date: baseDate.toISOString(),
        physicalEnergy: Math.max(20, Math.min(100, Math.round(physicalBase + randomVariation()))),
        cognitiveClarity: Math.max(20, Math.min(100, Math.round(cognitiveBase + randomVariation()))),
        mood: Math.max(20, Math.min(100, Math.round(moodBase + randomVariation()))),
        stress: Math.max(10, Math.min(90, Math.round(stressBase + randomVariation()))), // Inverted: higher = more stress
        sleep: Math.max(20, Math.min(100, Math.round(sleepBase + randomVariation()))),
        energy: Math.max(20, Math.min(100, Math.round((physicalBase + cognitiveBase) / 2 + randomVariation())))
      };
    });
  }

  // Filter out recent data points from chart data
  function getFilteredChartData(chartData: any[]) {
    if (!chartData || chartData.length <= 5) return chartData;
    // For sample data, show all points; for real data, remove only the last point to show more trends
    return chartData.length === 7 ? chartData : chartData.slice(0, -1);
  }

  const toggleMetric = (key: string) => {
    setMetrics(prev => prev.map(metric => 
      metric.key === key ? { ...metric, enabled: !metric.enabled } : metric
    ));
  };

  const toggleEnergyMetric = (key: string) => {
    setEnergyMetrics(prev => prev.map(metric => 
      metric.key === key ? { ...metric, enabled: !metric.enabled } : metric
    ));
  };

  // Updated color palette for correlations
  const COLORS = ['#c45e99', '#953599', '#f5855f', '#ce0069', '#f2bf3f'];

  const timeframeOptions = [
    { value: 'day' as TimeFrame, label: 'Day' },
    { value: 'week' as TimeFrame, label: 'Week' },
    { value: 'month' as TimeFrame, label: 'Month' },
    { value: 'custom' as TimeFrame, label: 'Custom' }
  ];

  const formatCustomRange = () => {
    if (!customDateRange.from) return 'Select range';
    if (!customDateRange.to) return customDateRange.from.toLocaleDateString();
    return `${customDateRange.from.toLocaleDateString()} - ${customDateRange.to.toLocaleDateString()}`;
  };

  // Energy level chart metrics with new colors
  const [energyMetrics, setEnergyMetrics] = useState<EnergyMetric[]>([
    { key: 'sleep', label: 'Sleep', color: '#f2bf3f', enabled: true }, // yellow
    { key: 'stress', label: 'Stress', color: '#ce0069', enabled: true }, // fuchsia
    { key: 'physicalEnergy', label: 'Physical Energy', color: '#c45e99', enabled: true }, // magenta
    { key: 'cognitiveClarity', label: 'Cognitive', color: '#953599', enabled: false }, // purple
    { key: 'mood', label: 'Mood', color: '#f5855f', enabled: false }, // orange
  ]);

  // Custom tooltip formatter for trends chart
  const formatTrendsTooltip = (value: any, name: string) => {
    const metric = metrics.find(m => m.key === name);
    
    // Handle null values
    if (value === null || value === undefined) {
      return ['No data', metric?.label || name];
    }
    
    let formattedValue = typeof value === 'number' ? Math.round(value) : value;
    
    // Add appropriate units or formatting
    if (name === 'sleep') {
      // Sleep is already 0-100 scale from harmonized data
      formattedValue = `${formattedValue}%`;
    } else if (name === 'stress') {
      // Stress is already harmonized (higher = better)
      formattedValue = `${formattedValue}%`;
    } else if (name === 'mood') {
      // Mood is harmonized 0-100 scale
      formattedValue = `${formattedValue}%`;
    } else {
      formattedValue = `${formattedValue}`;
    }
    
    return [formattedValue, metric?.label || name];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <ScreenHeader 
        title="Analytics"
        subtitle="Insights into your energy patterns"
        onBack={onBack}
        rightElement={
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            <TrendingUp className="h-3 w-3" />
            Insights
          </div>
        }
      />

      <div className="px-4 pb-24 space-y-6 max-w-md mx-auto bg-gradient-pastel">
        {/* Enhanced Timeframe Selector */}
        <div className="space-y-3">
          {/* Segmented Control */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-muted/30 rounded-lg">
            {timeframeOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => setTimeframe(option.value)}
                className={`h-8 text-xs transition-all duration-200 ${
                  timeframe === option.value 
                    ? 'bg-background shadow-sm text-foreground font-medium' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Range Picker */}
          {timeframe === 'custom' && (
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {formatCustomRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={customDateRange}
                  onSelect={(range) => {
                    setCustomDateRange(range || { from: undefined, to: undefined });
                    if (range?.from && range?.to) {
                      setIsCalendarOpen(false);
                    }
                  }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Key Metrics - Updated with new color palette */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 border-fuchsia-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-fuchsia-600 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-fuchsia-700 font-medium">Current Streak</p>
                  <p className="text-2xl font-bold text-fuchsia-900">{data.currentStreak}</p>
                </div>
              </div>
              <p className="text-xs text-fuchsia-600">days in a row</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-purple-700 font-medium">Avg Energy</p>
                  <p className="text-2xl font-bold text-purple-900">{data.avgEnergy}%</p>
                </div>
              </div>
              <p className="text-xs text-purple-600">overall score</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-orange-700 font-medium">Total Entries</p>
                  <p className="text-2xl font-bold text-orange-900">{data.totalEntries}</p>
                </div>
              </div>
              <p className="text-xs text-orange-600">tracked sessions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-yellow-700 font-medium">Best Streak</p>
                  <p className="text-2xl font-bold text-yellow-900">{data.bestStreak}</p>
                </div>
              </div>
              <p className="text-xs text-yellow-600">days record</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section - with colored border */}
        <div className="border-l-4 border-magenta-600 pl-4">
          <AIInsights trackingEntries={trackingEntries} />
        </div>

        {/* Earned Badges Section - with colored border */}
        <div className="border-l-4 border-purple-600 pl-4">
          <EarnedBadgesSection trackingEntries={trackingEntries} />
        </div>

        {/* Enhanced Charts */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="trends" className="text-xs">
              <LineChart className="h-4 w-4 mr-1" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="patterns" className="text-xs">
              <BarChart3 className="h-4 w-4 mr-1" />
              Energy Level
            </TabsTrigger>
            <TabsTrigger value="correlations" className="text-xs">
              <PieChart className="h-4 w-4 mr-1" />
              Correlations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm border-l-4 border-magenta-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Energy Trends</CardTitle>
                <CardDescription>
                  Multiple metrics over time
                </CardDescription>
                
                {/* Clickable Legend */}
                <div className="flex flex-wrap gap-3 pt-3">
                  {metrics.map((metric) => (
                    <button
                      key={metric.key}
                      onClick={() => toggleMetric(metric.key)}
                      className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-100"
                      style={{ opacity: metric.enabled ? 1 : 0.6 }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: metric.color }}
                      />
                      <span className="text-xs font-medium">{metric.label}</span>
                    </button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0 pl-2">
                <div className="h-56 m-[0px] px-[10px] py-[0px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart 
                      data={data.chartData.length > 0 ? getFilteredChartData(data.chartData) : getFilteredChartData(getSampleChartData())}
                      margin={{ top: 5, right: 50, left: -5, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 11 }}
                        stroke="#6b7280"
                        axisLine={{ stroke: '#d1d5db' }}
                        tickLine={{ stroke: '#d1d5db' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }}
                        stroke="#6b7280"
                        domain={[0, 100]}
                        axisLine={{ stroke: '#d1d5db' }}
                        tickLine={{ stroke: '#d1d5db' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={formatTrendsTooltip}
                        labelFormatter={(label) => `Day: ${label}`}
                      />
                      {metrics.map((metric) => (
                        <Line
                          key={metric.key}
                          type="monotone"
                          dataKey={metric.key}
                          stroke={metric.color}
                          strokeWidth={metric.enabled ? 3 : 2}
                          strokeOpacity={metric.enabled ? 0.9 : 0.4}
                          dot={{ 
                            r: metric.enabled ? 4 : 3, 
                            strokeWidth: 2,
                            stroke: metric.color,
                            fill: '#ffffff',
                            strokeOpacity: metric.enabled ? 1 : 0.4
                          }}
                          activeDot={{ 
                            r: 6, 
                            fill: metric.color,
                            stroke: '#ffffff',
                            strokeWidth: 2
                          }}
                          name={metric.label}
                          connectNulls={false}
                          hide={!metric.enabled}
                        />
                      ))}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Data quality indicator */}
                <div className="mt-2 text-center">
                  {data.chartData.length > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Showing {getFilteredChartData(data.chartData).length} of {data.chartData.length} days (recent data filtered for clarity)
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                      Showing sample data - start tracking to see your trends
                    </p>
                  )}
                </div>
                

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm border-l-4 border-orange-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Energy Level</CardTitle>
                <CardDescription>
                  Layered view of daily energy factors
                </CardDescription>
                
                {/* Energy Metrics Legend */}
                <div className="flex flex-wrap gap-3 pt-3">
                  {energyMetrics.map((metric) => (
                    <button
                      key={metric.key}
                      onClick={() => toggleEnergyMetric(metric.key)}
                      className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-100"
                      style={{ opacity: metric.enabled ? 1 : 0.6 }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: metric.color }}
                      />
                      <span className="text-xs font-medium">{metric.label}</span>
                    </button>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-2">
                <div className="relative">
                  {/* High/Low Energy Labels */}
                  <div className="absolute right-2 top-4 text-right z-10">
                    <div className="text-xs text-muted-foreground mb-1">high</div>
                    <div className="text-xs text-muted-foreground">energy</div>
                  </div>
                  <div className="absolute right-2 bottom-8 text-right z-10">
                    <div className="text-xs text-muted-foreground mb-1">low</div>
                    <div className="text-xs text-muted-foreground">energy</div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.energyLevelData} margin={{ top: 10, right: 60, left: 10, bottom: 10 }}>
                        <defs>
                          {energyMetrics.map((metric) => (
                            <linearGradient key={`gradient-${metric.key}`} id={`gradient-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={metric.color} stopOpacity={metric.enabled ? 0.8 : 0.6}/>
                              <stop offset="95%" stopColor={metric.color} stopOpacity={metric.enabled ? 0.2 : 0.1}/>
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <YAxis 
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value: any, name: string) => {
                            const metric = energyMetrics.find(m => m.key === name);
                            return [`${value}%`, metric?.label || name];
                          }}
                          labelFormatter={(label) => `Day: ${label}`}
                        />
                        
                        {/* Render areas in reverse order for proper stacking */}
                        {energyMetrics.slice().reverse().map((metric) => (
                          metric.enabled && (
                            <Area
                              key={metric.key}
                              type="monotone"
                              dataKey={metric.key}
                              stackId="1"
                              stroke={metric.color}
                              strokeWidth={1.5}
                              fill={`url(#gradient-${metric.key})`}
                              name={metric.label}
                            />
                          )
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="correlations">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm border-l-4 border-purple-600">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Energy Correlations</CardTitle>
                <CardDescription>
                  Factors that impact your energy levels
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  {data.correlations.map((item, index) => (
                    <div key={item.factor} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium text-sm">{item.factor}</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((item.correlation || 0) * 100)}% correlation
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={item.impact === 'High' ? 'default' : item.impact === 'Medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {item.impact}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>



      </div>
    </div>
  );
}