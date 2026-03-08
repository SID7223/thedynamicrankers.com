import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, Briefcase, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, MoreVertical, Plus, Download } from 'lucide-react';
import { internalSdk } from '../../services/internalSdk';

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

const DashboardOverview: React.FC = () => {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await internalSdk.getAnalytics();
        setData(result || {});
      } catch (err) {
        console.error('Analytics Fetch Error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpis = data.kpis || {};

  const KPICard = ({ title, value, trend, trendUp, icon: Icon }: any) => (
    <div className="bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 p-6 rounded-[2.5rem] shadow-sm group hover:border-indigo-500/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">{title}</span>
        <button className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><MoreVertical size={16} /></button>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
            {typeof value === 'number' ? `$${value.toLocaleString()}` : (value || '0')}
          </h3>
          <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wider ${trendUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'} px-2 py-1 rounded-lg w-fit`}>
             {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
             {trend || '0'}%
          </div>
        </div>
        <div className="w-12 h-12 bg-zinc-50 dark:bg-[#0B101A] border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
           <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-6 lg:p-10 space-y-8 bg-zinc-50/50 dark:bg-[#06080D] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none mb-2">Dashboard</h2>
           <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Global Analytics Protocol</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
             <Download size={16} /> Export Data
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95">
             <Plus size={16} /> Create Leads
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Net Income" value={kpis.netIncome?.value} trend={kpis.netIncome?.trend} trendUp={parseFloat(kpis.netIncome?.trend || '0') >= 0} icon={DollarSign} />
        <KPICard title="Orders per month" value={kpis.orders?.value} trend={kpis.orders?.trend} trendUp={parseFloat(kpis.orders?.trend || '0') >= 0} icon={Briefcase} />
        <KPICard title="Average contract" value={kpis.avgContract?.value} trend={kpis.avgContract?.trend} trendUp={parseFloat(kpis.avgContract?.trend || '0') >= 0} icon={Activity} />
        <KPICard title="Growth rate" value={kpis.growthRate?.value} trend={kpis.growthRate?.trend} trendUp={parseFloat(kpis.growthRate?.trend || '0') >= 0} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 p-8 rounded-[2.5rem] shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Balance analytics</h3>
                 <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gross</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-400 opacity-50" /><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Net Total</span></div>
                 </div>
              </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data.balanceData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#11161D', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="gross" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#6366f1' }} />
                    <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" opacity={0.5} dot={false} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center">
           <div className="w-full text-left mb-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Regional Distribution</h3>
           </div>
           <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                        data={data.regions || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {(data.regions || []).map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                 <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none">100</span>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</p>
              </div>
           </div>
           <div className="w-full mt-6 space-y-3">
              {(data.regions || []).map((r: any, i: number) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} /><span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{r.name}</span></div>
                    <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">{r.value}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 p-8 rounded-[2.5rem] shadow-sm">
           <h3 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-10">Total sales</h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.totalSales || []}>
                    <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis hide />
                    <Tooltip
                        cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                        contentStyle={{ backgroundColor: '#11161D', border: '1px solid #27272a', borderRadius: '12px' }}
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={20} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 p-8 rounded-[2.5rem] shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Top products</h3>
              <MoreVertical size={16} className="text-zinc-400" />
           </div>
           <div className="space-y-6 flex-1">
              {(data.topProducts || []).map((p: any, i: number) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-black/20 rounded-2xl border border-zinc-100 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform"><Briefcase size={18} /></div>
                       <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">{p.name}</span>
                    </div>
                    <span className="text-sm font-black text-emerald-500">+${(p.value || 0).toLocaleString()}</span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
