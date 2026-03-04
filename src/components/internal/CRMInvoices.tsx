import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, CheckCircle2, Send, Clock, Trash2 } from 'lucide-react';

interface Invoice {
  id: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  description: string;
  status: 'invoice_created' | 'sent' | 'payment_received';
  invoice_date: string;
}

interface Customer {
  id: string;
  name: string;
}

const CRMInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
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
          amount: parseFloat(formData.amount)
        })
      });
      setIsModalOpen(false);
      setFormData({ customer_id: '', amount: '', description: '', status: 'invoice_created' });
      fetchData();
    } catch (err) {
      console.error('Create failed:', err);
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
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/internal/crm_invoices?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'payment_received': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'sent': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700/50';
    }
  };

  const getRowBg = (status: string) => {
    switch (status) {
      case 'payment_received': return 'bg-emerald-500/5';
      case 'sent': return 'bg-yellow-500/5';
      default: return 'bg-[#262728]';
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Financial Ledger</h2>
          <p className="text-zinc-500 text-sm">Track billing operations and payment statuses.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          Generate Invoice
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Filter invoices..."
          className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid gap-4">
          {filteredInvoices.map(invoice => (
            <div key={invoice.id} className={`border border-zinc-800/50 rounded-2xl p-5 transition-all group ${getRowBg(invoice.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{invoice.customer_name}</h3>
                    <p className="text-zinc-500 text-xs">{new Date(invoice.invoice_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold block mb-1">Amount</span>
                    <span className="text-white font-bold text-lg">${invoice.amount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(invoice.status)}`}>
                      {invoice.status.replace('_', ' ')}
                    </div>

                    <div className="flex items-center gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
                      <button
                        onClick={() => updateStatus(invoice.id, 'invoice_created')}
                        className={`p-1.5 rounded-lg transition-colors ${invoice.status === 'invoice_created' ? 'bg-zinc-700 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                        title="Mark Created"
                      >
                        <Clock size={14} />
                      </button>
                      <button
                        onClick={() => updateStatus(invoice.id, 'sent')}
                        className={`p-1.5 rounded-lg transition-colors ${invoice.status === 'sent' ? 'bg-yellow-500/20 text-yellow-500' : 'text-zinc-600 hover:text-zinc-400'}`}
                        title="Mark Sent"
                      >
                        <Send size={14} />
                      </button>
                      <button
                        onClick={() => updateStatus(invoice.id, 'payment_received')}
                        className={`p-1.5 rounded-lg transition-colors ${invoice.status === 'payment_received' ? 'bg-emerald-500/20 text-emerald-500' : 'text-zinc-600 hover:text-zinc-400'}`}
                        title="Mark Paid"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              {invoice.description && (
                <div className="mt-4 pt-4 border-t border-zinc-800/30">
                  <p className="text-zinc-500 text-sm leading-relaxed">{invoice.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1f1f1f] border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Issue Invoice</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Recipient Customer</label>
                <select
                  required
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                  value={formData.customer_id}
                  onChange={e => setFormData({...formData, customer_id: e.target.value})}
                >
                  <option value="">Select identity...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Transaction Amount (USD)</label>
                <input
                  type="number" step="0.01" required
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Invoice Description</label>
                <textarea
                  rows={3}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  placeholder="Service details, line items, or billing notes..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                Commit Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMInvoices;
