import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Mail,
  Phone
} from 'lucide-react';

interface Appointment {
  id: string;
  customer_id: string;
  customer_name: string;
  email: string | null;
  phone: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

const CRMAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    email: '',
    phone: '',
    appointment_date: '',
    appointment_time: '',
    status: 'scheduled'
  });

  const fetchData = async () => {
    try {
      const [appRes, custRes] = await Promise.all([
        fetch('/api/internal/crm_appointments'),
        fetch('/api/internal/crm_customers')
      ]);
      const appData = await appRes.json();
      const custData = await custRes.json();
      setAppointments(Array.isArray(appData) ? appData : []);
      setCustomers(Array.isArray(custData) ? custData : []);
    } catch (err) {
      console.error('Fetch Failed:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCustomerSelect = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setFormData({
        ...formData,
        customer_id: id,
        customer_name: customer.name,
        email: customer.email || '',
        phone: customer.phone || ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/internal/crm_appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      setFormData({ customer_id: '', customer_name: '', email: '', phone: '', appointment_date: '', appointment_time: '', status: 'scheduled' });
      fetchData();
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  const toggleComplete = async (id: string, currentStatus: string) => {
    const status = currentStatus === 'completed' ? 'scheduled' : 'completed';
    try {
      await fetch(`/api/internal/crm_appointments?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently redact this engagement from the schedule?')) return;
    try {
      await fetch(`/api/internal/crm_appointments?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0B101A] transition-colors duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 font-sans tracking-tight">Operation Schedule</h2>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm font-sans">Strategic sessions and tactical engagements registry.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 shadow-2xl shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={20} />
          Book Appointment
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {appointments.map(app => (
            <div
              key={app.id}
              className={`relative bg-zinc-50 dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 rounded-3xl p-6 transition-all shadow-sm ${
                app.status === 'completed' ? 'opacity-40 grayscale' : 'hover:border-indigo-600 dark:hover:border-indigo-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border ${
                  app.status === 'completed' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600 border-zinc-300 dark:border-zinc-700' : 'bg-white dark:bg-[#0B101A] text-indigo-600 dark:text-indigo-400 border-zinc-200 dark:border-zinc-800'
                }`}>
                  <Calendar size={20} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleComplete(app.id, app.status)}
                    className={`p-2.5 rounded-xl transition-all border ${
                      app.status === 'completed' ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-800 border-indigo-100 dark:border-indigo-900' : 'text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-[#0B101A] border-transparent hover:border-zinc-200 dark:hover:border-zinc-800'
                    }`}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-[#0B101A] rounded-xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className={`space-y-4 ${app.status === 'completed' ? 'line-through decoration-zinc-400 dark:decoration-zinc-500' : ''}`}>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-lg truncate tracking-tight">{app.customer_name}</h3>
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">
                    <Clock size={12} />
                    <span>{app.appointment_date} @ {app.appointment_time}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-xs truncate font-medium">
                    <Mail size={14} className="text-zinc-400 dark:text-zinc-600 shrink-0" />
                    <span className="truncate">{app.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-xs truncate font-medium">
                    <Phone size={14} className="text-zinc-400 dark:text-zinc-600 shrink-0" />
                    <span className="truncate">{app.phone || 'N/A'}</span>
                  </div>
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
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Schedule Session</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Identity Selection</label>
                <select
                  required
                  className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none"
                  value={formData.customer_id}
                  onChange={e => handleCustomerSelect(e.target.value)}
                >
                  <option value="" className="dark:bg-[#0B101A]">Select Identity Record...</option>
                  {customers.map(c => <option key={c.id} value={c.id} className="dark:bg-[#0B101A]">{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Engagement Date</label>
                  <input
                    type="date" required
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    value={formData.appointment_date}
                    onChange={e => setFormData({...formData, appointment_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Tactical Time</label>
                  <input
                    type="time" required
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    value={formData.appointment_time}
                    onChange={e => setFormData({...formData, appointment_time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Email Override</label>
                  <input
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3 block">Phone Override</label>
                  <input
                    className="w-full bg-zinc-50 dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
              >
                Confirm Engagement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMAppointments;
