import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  MoreVertical,
  X as XIcon,
  ChevronDown
} from 'lucide-react';

interface Invoice {
  id: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  description: string;
  status: string;
  invoice_date: string;
}

const CRMInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ customer_id: '', amount: '', description: '', status: 'invoice_created' });

  const fetchData = async () => {
    try {
      const [invRes, custRes] = await Promise.all([
        fetch('/api/internal/crm_invoices'),
        fetch('/api/internal/crm_customers')
      ]);
      if (invRes.ok) setInvoices(await invRes.ok ? await invRes.json() : []);
      if (custRes.ok) setCustomers(await custRes.json());
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/internal/crm_invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ customer_id: '', amount: '', description: '', status: 'invoice_created' });
        fetchData();
      }
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'payment_received': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'sent': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default: return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700';
    }
  };

  const getRowStyle = (status: string) => {
      switch (status) {
          case 'payment_received': return 'bg-emerald-500/5';
          case 'sent': return 'bg-yellow-500/5';
          default: return '';
      }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0B101A] transition-colors duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-sans tracking-tight">Financial Assets</h2>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm font-sans">Command-level ledger for resource allocation and transactions.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 shadow-2xl shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={20} />
          Generate Invoice
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search transactions by entity..."
            className="w-full bg-zinc-50 dark:bg-[#161B22] border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[80px_1fr_180px_180px_180px_140px_60px] gap-6 px-6 py-4 bg-zinc-50 dark:bg-[#161B22] rounded-t-2xl border-x border-t border-zinc-200 dark:border-zinc-800/50">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">ID</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Resource Description</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Entity Record</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Allocation</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Status</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Date</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500"></span>
          </div>

          <div className="bg-white dark:bg-[#11161D] border-x border-b border-zinc-200 dark:border-zinc-800/50 rounded-b-2xl divide-y divide-zinc-100 dark:divide-zinc-800/30">
            {invoices.filter(i => i.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((inv, idx) => (
              <div key={inv.id} className={`grid grid-cols-[80px_1fr_180px_180px_180px_140px_60px] gap-6 px-6 py-6 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all items-center ${getRowStyle(inv.status)}`}>
                <span className="text-[10px] font-black text-zinc-400 tracking-tighter">#INV-${1000 + idx}</span>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 truncate">{inv.description}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">{inv.customer_name}</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Identity-${inv.customer_id.slice(0, 4)}</span>
                </div>
                <span className="text-base font-black text-zinc-900 dark:text-white tracking-tighter">$ ${Number(inv.amount).toLocaleString()}</span>
                <div>
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(inv.status)}`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar size={12} />
                  <span className="text-xs font-medium">{new Date(inv.invoice_date).toLocaleDateString()}</span>
                </div>
                <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 lg:p-10 border-b border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center shrink-0">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Invoice Generation</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl transition-all">
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Target Entity Record</label>
                <select
                  required
                  className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none font-bold"
                  value={formData.customer_id}
                  onChange={e => setFormData({...formData, customer_id: e.target.value})}
                >
                  <option value="" className="dark:bg-[#0B101A]">Select Entity...</option>
                  {customers.map(c => <option key={c.id} value={c.id} className="dark:bg-[#0B101A]">{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Resource Allocation (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="number" required
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-12 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-black"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Resource Description</label>
                <textarea
                  required rows={3}
                  className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-sans resize-none"
                  placeholder="Enter strategic context for this allocation..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Asset Status</label>
                <div className="relative">
                    <select
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none font-bold"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                    <option value="invoice_created" className="dark:bg-[#0B101A]">LEDGER_INIT (Created)</option>
                    <option value="sent" className="dark:bg-[#0B101A]">UPLINK_SENT (Sent)</option>
                    <option value="payment_received" className="dark:bg-[#0B101A]">ASSET_SECURED (Paid)</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
              >
                Execute Ledger Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMInvoices;
