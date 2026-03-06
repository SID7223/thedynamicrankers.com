import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2
} from 'lucide-react';

const STAGES = ['Discovery', 'Trial', 'Presentation', 'Paperwork', 'Checkout', 'Closed'];

interface CustomerProfileProps {
  customerId: string;
  onBack: () => void;
  onUpdate: () => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customerId, onBack, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/internal/crm_customers?id=${customerId}`);
        if (res.ok) {
          const data = await res.json();
          setFormData(data);
        }
      } catch (err) {
        console.error('Fetch Failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/internal/crm_customers?id=${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (newStage: string) => {
    const updated = { ...formData, sales_stage: newStage };
    setFormData(updated);
    try {
      await fetch(`/api/internal/crm_customers?id=${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sales_stage: newStage })
      });
      onUpdate();
    } catch (err) {
      console.error('Stage update failed:', err);
    }
  };

  if (loading) return <div className="p-10 text-zinc-500 font-sans uppercase tracking-widest text-xs">Retrieving intelligence...</div>;
  if (!formData) return <div className="p-10 text-red-500 font-bold uppercase tracking-widest text-xs">Error: Identity not found.</div>;

  const currentStageIndex = STAGES.indexOf(formData.sales_stage);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0B101A] transition-colors duration-300">
      {/* Header */}
      <div className="px-6 lg:px-10 py-6 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between bg-white/80 dark:bg-[#0B101A]/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6 min-w-0">
          <button
            onClick={onBack}
            className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight truncate">{formData.name}</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1 truncate">Profile & Strategic Intel</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-indigo-600/20 shrink-0 uppercase tracking-widest"
        >
          <Save size={18} />
          <span>{saving ? 'Syncing...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-16 pb-20">

          {/* Sales Ladder */}
          <section className="overflow-x-auto lg:overflow-visible -mx-6 px-6 pb-6 lg:pb-0 lg:mx-0 lg:px-0 scrollbar-none">
            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-10 font-sans">Sales Pipeline Ladder</h3>
            <div className="relative min-w-[600px] lg:min-w-0 px-4">
              <div className="absolute top-5 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-indigo-500 transition-all duration-700"
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
                      <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                        isCurrent ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.5)]' :
                        isActive ? 'bg-white dark:bg-[#0B101A] border-indigo-500/50' : 'bg-zinc-50 dark:bg-[#11161D] border-zinc-200 dark:border-zinc-800'
                      }`}>
                        {isActive ? <CheckCircle2 size={20} className={isCurrent ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'} /> : <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500" />}
                      </div>
                      <span className={`absolute top-16 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                        isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-400'
                      }`}>
                        {stage}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="grid lg:grid-cols-2 gap-10 pt-10">
            {/* Contact Info */}
            <div className="space-y-10 bg-zinc-50 dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 p-8 lg:p-10 rounded-[2.5rem] shadow-sm">
              <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-6 font-sans">Contact Intelligence</h3>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest flex items-center gap-3">
                    <User size={14} className="text-indigo-600 dark:text-indigo-400" /> Full Identity Name
                  </label>
                  <input
                    className="w-full bg-white dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all shadow-sm"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest flex items-center gap-3">
                    <Mail size={14} className="text-indigo-600 dark:text-indigo-400" /> Email Uplink
                  </label>
                  <input
                    className="w-full bg-white dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all shadow-sm"
                    value={formData.email || ''}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest flex items-center gap-3">
                    <Phone size={14} className="text-indigo-600 dark:text-indigo-400" /> Comms Channel
                  </label>
                  <input
                    className="w-full bg-white dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all shadow-sm"
                    value={formData.phone || ''}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest flex items-center gap-3">
                    <MapPin size={14} className="text-indigo-600 dark:text-indigo-400" /> Physical Coordinates
                  </label>
                  <input
                    className="w-full bg-white dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all shadow-sm"
                    value={formData.address || ''}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-zinc-50 dark:bg-[#11161D] border border-zinc-200 dark:border-zinc-800/50 p-8 lg:p-10 rounded-[2.5rem] flex flex-col min-h-[400px] shadow-sm">
              <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-8 font-sans">Strategic Notes & Ledger</h3>
              <div className="flex-1 flex flex-col space-y-4">
                 <div className="flex items-center gap-3">
                    <FileText size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Internal Narrative</span>
                 </div>
                 <textarea
                  className="flex-1 w-full bg-white dark:bg-[#0B101A] border border-zinc-200 dark:border-zinc-800 rounded-3xl px-6 py-5 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500/30 outline-none resize-none leading-relaxed text-sm font-medium shadow-sm"
                  placeholder="Enter strategic observations..."
                  value={formData.notes || ''}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
