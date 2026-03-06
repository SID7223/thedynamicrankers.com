import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  User,
  Edit2,
  Trash2,
  X,
  ChevronRight
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  sales_stage: string;
}

interface CRMCustomersProps {
  onSelectCustomer: (customer: Customer) => void;
}

const CRMCustomers: React.FC<CRMCustomersProps> = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    sales_stage: 'Discovery'
  });

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/internal/crm_customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Fetch Customers Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCustomer ? 'PATCH' : 'POST';
    const url = editingCustomer ? `/api/internal/crm_customers?id=${editingCustomer.id}` : '/api/internal/crm_customers';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingCustomer(null);
        setFormData({ name: '', phone: '', email: '', address: '', notes: '', sales_stage: 'Discovery' });
        fetchCustomers();
      }
    } catch (err) {
      console.error('Submit Customer Failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently redact this identity from the database?')) return;
    try {
      const res = await fetch(`/api/internal/crm_customers?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchCustomers();
    } catch (err) {
      console.error('Delete Customer Failed:', err);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0B101A] transition-colors duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-sans tracking-tight">Identity Registry</h2>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm font-sans">Full spectrum analysis of all client entities.</p>
        </div>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setFormData({ name: '', phone: '', email: '', address: '', notes: '', sales_stage: 'Discovery' });
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 shadow-2xl shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={20} />
          Establish New Identity
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          className="w-full bg-zinc-50 dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 rounded-xl py-4 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-sans"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-zinc-500 font-sans uppercase tracking-widest text-xs">Scanning data streams...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-[#11161D] rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800/50">
            <User size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No active identities found in this sector.</p>
          </div>
        ) : (
          <div className="grid gap-4 pb-10">
            {filteredCustomers.map(customer => (
              <div
                key={customer.id}
                className="bg-zinc-50 dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-5 hover:border-indigo-600 dark:hover:border-indigo-500/30 transition-all group cursor-pointer"
                onClick={() => onSelectCustomer(customer)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 bg-white dark:bg-[#0B101A] rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:bg-indigo-500/10 transition-colors shadow-sm border border-zinc-200 dark:border-zinc-800">
                      <User size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-zinc-900 dark:text-white text-lg truncate">{customer.name}</h3>
                      <p className="text-zinc-500 text-sm truncate font-medium">{customer.email || 'No email provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-bold block mb-1">Stage</span>
                      <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {customer.sales_stage}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCustomer(customer);
                          setFormData({
                            name: customer.name,
                            phone: customer.phone || '',
                            email: customer.email || '',
                            address: customer.address || '',
                            notes: customer.notes || '',
                            sales_stage: customer.sales_stage
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-2.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }}
                        className="p-2.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-2" />
                      <ChevronRight size={20} className="text-zinc-300 dark:text-zinc-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-white dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 lg:p-10 border-b border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center shrink-0">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{editingCustomer ? 'Update Identity' : 'Establish New Identity'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Full Spectrum Name</label>
                  <input
                    required
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Email Uplink</label>
                    <input
                      type="email"
                      className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Comms Channel</label>
                    <input
                      className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Physical Coordinates</label>
                  <input
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Strategic Intel & Notes</label>
                  <textarea
                    rows={4}
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
              >
                {editingCustomer ? 'Synchronize Updates' : 'Initialize Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMCustomers;
