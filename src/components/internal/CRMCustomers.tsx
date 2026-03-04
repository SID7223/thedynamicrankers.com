import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, User, ChevronRight } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
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
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCustomer ? 'PUT' : 'POST';
    const url = editingCustomer ? `/api/internal/crm_customers?id=${editingCustomer.id}` : '/api/internal/crm_customers';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      setEditingCustomer(null);
      setFormData({ name: '', phone: '', email: '', address: '', notes: '', sales_stage: 'Discovery' });
      fetchCustomers();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await fetch(`/api/internal/crm_customers?id=${id}`, { method: 'DELETE' });
      fetchCustomers();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Customer Registry</h2>
          <p className="text-zinc-500 text-sm">Manage your client relationships and sales pipeline.</p>
        </div>
        <button
          onClick={() => {
            setEditingCustomer(null);
            setFormData({ name: '', phone: '', email: '', address: '', notes: '', sales_stage: 'Discovery' });
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          Create New Customer
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-zinc-500">Scanning data streams...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20 bg-zinc-800/20 rounded-2xl border border-dashed border-zinc-700/50">
            <User size={48} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-500">No customers found in the registry.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCustomers.map(customer => (
              <div
                key={customer.id}
                className="bg-[#262728] border border-zinc-800/50 rounded-2xl p-5 hover:border-indigo-500/30 transition-all group cursor-pointer"
                onClick={() => onSelectCustomer(customer)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{customer.name}</h3>
                      <p className="text-zinc-500 text-sm">{customer.email || 'No email provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold block mb-1">Pipeline Stage</span>
                      <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {customer.sales_stage}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="w-px h-4 bg-zinc-800 mx-2" />
                      <ChevronRight size={20} className="text-zinc-700 group-hover:text-indigo-500 transition-colors" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1f1f1f] border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{editingCustomer ? 'Update Identity' : 'Establish New Identity'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Phone Number</label>
                  <input
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Physical Address</label>
                <input
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Notes & Intel</label>
                <textarea
                  rows={3}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                {editingCustomer ? 'Synchronize Updates' : 'Initialize Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default CRMCustomers;
