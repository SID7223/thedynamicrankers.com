import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Mail, Phone, Clock, TrendingUp, ChevronRight, X as XIcon, ChevronDown } from 'lucide-react';
import { useCRMStore } from '../../store/useCRMStore';
import { internalSdk } from '../../services/internalSdk';

interface CRMCustomersProps {
  onSelectCustomer: (customer: any) => void;
}

const CRMCustomers: React.FC<CRMCustomersProps> = ({ onSelectCustomer }) => {
  const { customers, fetchCustomers } = useCRMStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sales_stage: 'Discovery',
    notes: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await internalSdk.createCustomer(formData);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', sales_stage: 'Discovery', notes: '' });
      fetchCustomers();
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0B101A] transition-colors duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-sans tracking-tight">Identity Registry</h2>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm font-sans">Strategic database of high-value contacts and stakeholders.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 shadow-2xl shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={20} />
          Register New Identity
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Scan registry for names or emails..."
          className="w-full bg-zinc-50 dark:bg-[#161B22] border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-sans"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {filtered.map(customer => (
            <div
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className="group bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 hover:border-indigo-600 dark:hover:border-indigo-500/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <Users size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-indigo-500 transition-colors flex items-center gap-1">
                  View Record <ChevronRight size={12} />
                </span>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">{customer.name}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-xs font-medium truncate">
                  <Mail size={14} className="text-zinc-300 dark:text-zinc-600 shrink-0" />
                  <span className="truncate">{customer.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-xs font-medium">
                  <Phone size={14} className="text-zinc-300 dark:text-zinc-600 shrink-0" />
                  <span>{customer.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <TrendingUp size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{customer.sales_stage}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300 dark:text-zinc-700">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold">{new Date(customer.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 lg:p-10 border-b border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center shrink-0">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Identity Registration</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl transition-all">
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Full Identity Name</label>
                  <input
                    required
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-sans font-bold"
                    placeholder="Enter full name..."
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Primary Email</label>
                    <input
                      type="email"
                      className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-sans"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Tactical Phone</label>
                    <input
                      className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-sans"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Deployment Stage</label>
                  <div className="relative">
                    <select
                      className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none font-bold"
                      value={formData.sales_stage}
                      onChange={e => setFormData({...formData, sales_stage: e.target.value})}
                    >
                      {['Discovery', 'Trial', 'Presentation', 'Paperwork', 'Checkout', 'Closed'].map(s => (
                        <option key={s} value={s} className="dark:bg-[#0B101A]">{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Tactical Notes</label>
                  <textarea
                    rows={4}
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-sans resize-none"
                    placeholder="Enter strategic context..."
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
              >
                Execute Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMCustomers;
