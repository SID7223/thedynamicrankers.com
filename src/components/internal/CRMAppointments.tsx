import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Mail, Phone, X, CheckCircle2, Trash2 } from 'lucide-react';

interface Appointment {
  id: string;
  customer_id: string;
  customer_name: string;
  email: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed';
}

const CRMAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<{id: string, name: string, email: string, phone: string}[]>([]);
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
      const [appData, custData] = await Promise.all([appRes.json(), custRes.json()]);
      setAppointments(Array.isArray(appData) ? appData : []);
      setCustomers(Array.isArray(custData) ? custData : []);
    } catch (err) {
      console.error('Fetch failed:', err);
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
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/internal/crm_appointments?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col bg-white dark:bg-[#0B101A] transition-colors duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Operation Schedule</h2>
          <p className="text-zinc-500 text-sm">Strategic sessions and tactical engagements.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          Book Appointment
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-10 lg:pb-0">
          {appointments.map(app => (
            <div
              key={app.id}
              className={`relative bg-zinc-50 dark:bg-[#262728] border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-5 lg:p-6 transition-all shadow-sm ${
                app.status === 'completed' ? 'opacity-40' : 'hover:border-indigo-600 dark:hover:border-indigo-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-sm ${
                  app.status === 'completed' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                }`}>
                  <Calendar size={20} />
                </div>
                <div className="flex gap-1 lg:gap-2">
                  <button
                    onClick={() => toggleComplete(app.id, app.status)}
                    className={`p-2 rounded-lg transition-colors ${
                      app.status === 'completed' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className={`space-y-4 ${app.status === 'completed' ? 'line-through decoration-zinc-400 dark:decoration-zinc-500' : ''}`}>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-base lg:text-lg truncate">{app.customer_name}</h3>
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[11px] lg:text-xs mt-1">
                    <Clock size={12} />
                    <span>{app.appointment_date} @ {app.appointment_time}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-xs lg:text-sm truncate">
                    <Mail size={14} className="text-zinc-400 dark:text-zinc-600 shrink-0" />
                    <span className="truncate">{app.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-xs lg:text-sm truncate">
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
        <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1f1f1f] border-t lg:border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-t-3xl lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 lg:p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Schedule Session</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6 overflow-y-auto custom-scrollbar">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block">Identity Selection</label>
                <select
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                  value={formData.customer_id}
                  onChange={e => handleCustomerSelect(e.target.value)}
                >
                  <option value="" className="dark:bg-[#1f1f1f]">Select Identity...</option>
                  {customers.map(c => <option key={c.id} value={c.id} className="dark:bg-[#1f1f1f]">{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 lg:col-span-1">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block">Email Override</label>
                  <input
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-zinc-900 dark:text-white"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block">Phone Override</label>
                  <input
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-zinc-900 dark:text-white"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block">Date</label>
                  <input
                    type="date" required
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-zinc-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                    value={formData.appointment_date}
                    onChange={e => setFormData({...formData, appointment_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 block">Time</label>
                  <input
                    type="time" required
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-zinc-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                    value={formData.appointment_time}
                    onChange={e => setFormData({...formData, appointment_time: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
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
