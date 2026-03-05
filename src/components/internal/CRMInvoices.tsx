import React, { useState, useEffect } from 'react';
import { Plus, Search, Receipt, Trash2, X, Clock, CheckCircle2, Send } from 'lucide-react';

interface Invoice {
  id: number;
  customer_id: number;
  customer_name: string;
  amount: number;
  status: 'invoice_created' | 'sent' | 'payment_received';
  invoice_date: string;
  description: string;
}

const CRMInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<{id: number, name: string}[]>([]);
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
      const [invData, custData] = await Promise.all([invRes.json(), custRes.json()]);
      setInvoices(Array.isArray(invData) ? invData : []);
      setCustomers(Array.isArray(custData) ? custData : []);
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
      await fetch('/api/internal/crm_invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          invoice_date: new Date().toISOString()
        })
      });
      setIsModalOpen(false);
      setFormData({ customer_id: '', amount: '', description: '', status: 'invoice_created' });
      fetchData();
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/internal/crm_invoices?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
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
      default: return 'bg-zinc-50 dark:bg-[#262728]';
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col bg-white dark:bg-[#0B101A] transition-colors duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Financial Ledger</h2>
          <p className="text-zinc-500 text-sm">Track billing operations and payment statuses.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Search by customer name..."
          className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl py-3 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {filteredInvoices.map(invoice => (
            <div key={invoice.id} className={`border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-5 transition-all group ${getRowBg(invoice.status)} shadow-sm`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 shadow-sm">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">{invoice.customer_name}</h3>
                    <p className="text-zinc-500 text-xs">{new Date(invoice.invoice_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-bold block mb-1">Amount</span>
                  <span className="text-zinc-900 dark:text-white font-bold text-lg">${invoice.amount.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-bold block mb-1">Status</span>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(invoice.status)}`}>
                    {invoice.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800/30">
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 border border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => updateStatus(invoice.id, 'invoice_created')}
                    className={`p-1.5 rounded-lg transition-colors ${invoice.status === 'invoice_created' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
                  >
                    <Clock size={16} />
                  </button>
                  <button
                    onClick={() => updateStatus(invoice.id, 'sent')}
                    className={`p-1.5 rounded-lg transition-colors ${invoice.status === 'sent' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
                  >
                    <Send size={16} />
                  </button>
                  <button
                    onClick={() => updateStatus(invoice.id, 'payment_received')}
                    className={`p-1.5 rounded-lg transition-colors ${invoice.status === 'payment_received' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400'}`}
                  >
                    <CheckCircle2 size={16} />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {invoice.description && (
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/30">
                  <p className="text-zinc-500 text-sm leading-relaxed">{invoice.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1f1f1f] border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Issue Invoice</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block">Recipient Customer</label>
                <select
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                  value={formData.customer_id}
                  onChange={e => setFormData({...formData, customer_id: e.target.value})}
                >
                  <option value="">Select Customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id} className="dark:bg-[#1f1f1f]">{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block">Transaction Amount (USD)</label>
                <input
                  type="number" required
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block">Invoice Description</label>
                <textarea
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
              >
                Deploy Invoice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMInvoices;
