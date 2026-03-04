import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Mail, CheckCircle2, Plus, Trash2 } from 'lucide-react';

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

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const CRMAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
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
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Operation Schedule</h2>
          <p className="text-zinc-500 text-sm">Strategic sessions and tactical engagements.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          Book Appointment
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map(app => (
            <div
              key={app.id}
              className={`relative bg-[#262728] border border-zinc-800/50 rounded-2xl p-6 transition-all ${
                app.status === 'completed' ? 'opacity-40' : 'hover:border-indigo-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  app.status === 'completed' ? 'bg-zinc-800 text-zinc-600' : 'bg-indigo-500/10 text-indigo-400'
                }`}>
                  <Calendar size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleComplete(app.id, app.status)}
                    className={`p-2 rounded-lg transition-colors ${
                      app.status === 'completed' ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-600 hover:text-white hover:bg-zinc-700'
                    }`}
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className={`space-y-4 ${app.status === 'completed' ? 'line-through decoration-zinc-500' : ''}`}>
                <div>
                  <h3 className="font-bold text-white text-lg">{app.customer_name}</h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                    <Clock size={12} />
                    <span>{app.appointment_date} @ {app.appointment_time}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800/50">
                  <div className="flex items-center gap-3 text-zinc-400 text-sm">
                    <Mail size={14} className="text-zinc-600" />
                    <span>{app.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 text-sm">
                    <Phone size={14} className="text-zinc-600" />
                    <span>{app.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1f1f1f] border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Schedule Strategic Session</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Identity Selection</label>
                <select
                  required
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                  value={formData.customer_id}
                  onChange={e => handleCustomerSelect(e.target.value)}
                >
                  <option value="">Select Identity...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email Override</label>
                  <input
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Phone Override</label>
                  <input
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Engagement Date</label>
                  <input
                    type="date" required
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white"
                    value={formData.appointment_date}
                    onChange={e => setFormData({...formData, appointment_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Engagement Time</label>
                  <input
                    type="time" required
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white"
                    value={formData.appointment_time}
                    onChange={e => setFormData({...formData, appointment_time: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
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
