import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Receipt,
  Trash2,
  X,
  Clock,
  Send,
  CheckCircle2
} from 'lucide-react';

interface Invoice {
  id: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  description: string | null;
  status: string;
  invoice_date: string;
  created_at: string;
}

const CRMInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    customer_id: '',
    amount: '',
    description: '',
    status: 'invoice_created'
  });

  const fetchData = async () => {
    try {
      const [invRes, custRes] = await Promise.all([
        fetch('/api/internal/crm_invoices'),
        fetch('/api/internal/crm_customers')
      ]);
      const invData = await invRes.json();
      const custData = await custRes.json();
      setInvoices(Array.isArray(invData) ? invData : []);
      setCustomers(Array.isArray(custData) ? custData : []);
    } catch (err) {
      console.error('Fetch Failed:', err);
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
      console.error('Create Failed:', err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/internal/crm_invoices?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently redact this financial record?')) return;
    try {
      await fetch(`/api/internal/crm_invoices?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'payment_received': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'sent': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      default: return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/50';
    }
  };

  const getRowBg = (status: string) => {
    switch (status) {
      case 'payment_received': return 'bg-emerald-500/5 dark:bg-emerald-500/5';
      case 'sent': return 'bg-yellow-500/5 dark:bg-yellow-500/5';
      default: return 'bg-zinc-50 dark:bg-[#11161D]';
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0B101A] transition-colors duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-sans tracking-tight">Financial Ledger</h2>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm font-sans">Track billing operations and global payment statuses.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 shadow-2xl shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Search by customer name..."
          className="w-full bg-zinc-50 dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 rounded-xl py-4 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-sans"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {filteredInvoices.map(invoice => (
            <div key={invoice.id} className={`border border-zinc-200 dark:border-zinc-800/50 rounded-3xl p-6 transition-all group ${getRowBg(invoice.status)} shadow-sm hover:shadow-xl hover:border-indigo-600/30`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 shadow-sm">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">{invoice.customer_name}</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{new Date(invoice.invoice_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-zinc-100 dark:border-white/5">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-bold block mb-1">Amount</span>
                  <span className="text-zinc-900 dark:text-white font-bold text-lg">${invoice.amount.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-bold block mb-1">Status</span>
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(invoice.status)}`}>
                    {invoice.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800/30">
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 border border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => updateStatus(invoice.id, 'invoice_created')}
                    className={`p-2 rounded-lg transition-colors ${invoice.status === 'invoice_created' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
                  >
                    <Clock size={16} />
                  </button>
                  <button
                    onClick={() => updateStatus(invoice.id, 'sent')}
                    className={`p-2 rounded-lg transition-colors ${invoice.status === 'sent' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
                  >
                    <Send size={16} />
                  </button>
                  <button
                    onClick={() => updateStatus(invoice.id, 'payment_received')}
                    className={`p-2 rounded-lg transition-colors ${invoice.status === 'payment_received' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
                  >
                    <CheckCircle2 size={16} />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="p-2.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {invoice.description && (
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/30">
                  <p className="text-zinc-500 text-xs leading-relaxed font-medium">{invoice.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 lg:p-10 border-b border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center shrink-0">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Deploy Invoice</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Recipient Target</label>
                <select
                  required
                  className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none"
                  value={formData.customer_id}
                  onChange={e => setFormData({...formData, customer_id: e.target.value})}
                >
                  <option value="">Select Target Record...</option>
                  {customers.map(c => <option key={c.id} value={c.id} className="dark:bg-[#0B101A]">{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Transaction Amount (USD)</label>
                <input
                  type="number" required
                  className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Invoice Memo & Description</label>
                <textarea
                  required
                  className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none"
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
              >
                Initialize Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMInvoices;
