import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, FileText, ChevronLeft, Save, CheckCircle2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  sales_stage: string;
}

interface CustomerProfileProps {
  customer: Customer;
  onBack: () => void;
  onUpdate: () => void;
}

const STAGES = ['Discovery', 'Trial', 'Presentation', 'Paperwork', 'Checkout', 'Closed'];

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, onBack, onUpdate }) => {
  const [formData, setFormData] = useState({ ...customer });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/internal/crm_customers?id=${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      onUpdate();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (stage: string) => {
    const updatedData = { ...formData, sales_stage: stage };
    setFormData(updatedData);
    try {
      await fetch(`/api/internal/crm_customers?id=${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      onUpdate();
    } catch (err) {
      console.error('Stage update failed:', err);
    }
  };

  const currentStageIndex = STAGES.indexOf(formData.sales_stage);

  return (
    <div className="h-full flex flex-col bg-[#1f1f1f]">
      {/* Header */}
      <div className="px-10 py-6 border-b border-zinc-800/50 flex items-center justify-between bg-[#1f1f1f]/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-2.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all border border-zinc-800/50"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{formData.name}</h2>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-0.5">Customer Profile & Intel</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
        >
          <Save size={18} />
          {saving ? 'Syncing...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Sales Ladder */}
          <section>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8 font-sans">Sales Pipeline Ladder</h3>
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-indigo-500 -translate-y-1/2 transition-all duration-500"
                style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between items-center">
                {STAGES.map((stage, idx) => {
                  const isActive = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  return (
                    <button
                      key={stage}
                      onClick={() => handleStageChange(stage)}
                      className="flex flex-col items-center group relative z-10"
                    >
                      <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                        isCurrent ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]' :
                        isActive ? 'bg-zinc-800 border-indigo-500/50' : 'bg-zinc-900 border-zinc-800'
                      }`}>
                        {isActive ? <CheckCircle2 size={18} className={isCurrent ? 'text-white' : 'text-indigo-400'} /> : <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-zinc-500" />}
                      </div>
                      <span className={`absolute top-14 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                        isCurrent ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'
                      }`}>
                        {stage}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-10 pt-10">
            {/* Contact Info */}
            <div className="space-y-8 bg-[#262728] border border-zinc-800/50 p-8 rounded-3xl">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 font-sans">Contact Information</h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <User size={12} className="text-indigo-400" /> Full Name
                  </label>
                  <input
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={12} className="text-indigo-400" /> Email Address
                  </label>
                  <input
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50 outline-none"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <Phone size={12} className="text-indigo-400" /> Phone Number
                  </label>
                  <input
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50 outline-none"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12} className="text-indigo-400" /> Physical Address
                  </label>
                  <input
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500/50 outline-none"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-[#262728] border border-zinc-800/50 p-8 rounded-3xl flex flex-col">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 font-sans">Strategic Notes & Intel</h3>
              <div className="flex-1 flex flex-col space-y-2">
                 <div className="flex items-center gap-2 mb-2">
                    <FileText size={12} className="text-indigo-400" />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Internal Ledger</span>
                 </div>
                 <textarea
                  className="flex-1 w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:ring-1 focus:ring-indigo-500/50 outline-none resize-none leading-relaxed"
                  placeholder="Enter strategic observations, meeting notes, and relationship details..."
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default CustomerProfile;
