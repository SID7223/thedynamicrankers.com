import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Loader2, Calendar, Building2, Briefcase, MapPin, User, Mail, Phone } from 'lucide-react';

// Types
type Path = 'A' | 'B' | 'C' | 'D';

interface OnboardingData {
  orgName: string;
  industry: string;
  location: string;
  role: string;
  email: string;
  phone: string;
  primaryIntent: Path | '';
  refinement: string;
  closing: string;
}

const STORAGE_KEY = 'dr_onboarding_data';
const STEP_KEY = 'dr_onboarding_step';

const PATH_CONTENT = {
  A: {
    label: "Media Partnership",
    page3: {
      question: "What level of involvement are you looking for?",
      options: ["Strategic Direction", "Execution", "Leadership"]
    },
    page4: {
      question: "How are you planning to engage?",
      options: ["Monthly Retainer", "Hybrid", "Recommendation"]
    }
  },
  B: {
    label: "Digital Growth",
    page3: {
      question: "What is your primary growth objective?",
      options: ["Lead Gen", "Visibility", "Performance"]
    },
    page4: {
      question: "What is your engagement style?",
      options: ["Ongoing Support", "Campaign", "One-time"]
    }
  },
  C: {
    label: "Project-Based/3D",
    page3: {
      question: "What type of asset are you planning?",
      options: ["Video/Photo", "3D", "Campaign"]
    },
    page4: {
      question: "What is your project timeline?",
      options: ["Immediate", "30 Days", "Planning"]
    }
  },
  D: {
    label: "General Inquiry",
    page3: {
      question: "What best fits your inquiry?",
      options: ["Exploring Collaboration", "Consultation", "Unsure"]
    },
    page4: {
      question: "How would you like to proceed?",
      options: ["Schedule Discussion", "Email Info", "Guidance"]
    }
  }
};

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    orgName: '',
    industry: '',
    location: '',
    role: '',
    email: '',
    phone: '',
    primaryIntent: '',
    refinement: '',
    closing: '',
  });

  // Security Check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token !== 'DR_2024_PREMIUM') {
      navigate('/');
    }
  }, [navigate]);

  // Load from sessionStorage
  useEffect(() => {
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    const savedStep = sessionStorage.getItem(STEP_KEY);
    if (savedData) {
      setData(JSON.parse(savedData));
    }
    if (savedStep) {
      const stepNum = parseInt(savedStep);
      if (stepNum >= 1 && stepNum <= 4) {
        setStep(stepNum);
      }
    }
  }, []);

  // Save to sessionStorage
  useEffect(() => {
    if (!isSubmitted) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      sessionStorage.setItem(STEP_KEY, step.toString());
    }
  }, [data, step, isSubmitted]);

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STEP_KEY);
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const pageTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  const isStep1Valid = data.orgName && data.industry && data.location && data.role && data.email && data.phone;
  const isStep2Valid = data.primaryIntent !== '';
  const isStep3Valid = data.refinement !== '';
  const isStep4Valid = data.closing !== '';

  const canProceed = () => {
    if (step === 1) return isStep1Valid;
    if (step === 2) return isStep2Valid;
    if (step === 3) return isStep3Valid;
    if (step === 4) return isStep4Valid;
    return false;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen h-screen flex items-center justify-center bg-white dark:bg-gray-900 overflow-hidden px-4">
        <Helmet>
          <title>Thank You | Dynamic Rankers</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Thank You!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your onboarding data has been successfully submitted. We're excited to start this journey with you.
            </p>
          </div>
          <a
            href="https://calendly.com/dynamicrankers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25"
          >
            <Calendar className="w-5 h-5" />
            <span>Schedule Your Strategy Call</span>
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-white dark:bg-gray-900 overflow-hidden flex flex-col font-sans">
      <Helmet>
        <title>Onboarding | Dynamic Rankers</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 z-50">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: '0%' }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex-1 relative flex items-center justify-center px-4">
        <div className="absolute top-8 left-0 w-full text-center">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">
            Step {step} of 4
          </span>
        </div>

        <AnimatePresence mode="wait" custom={step}>
          <motion.div
            key={step}
            custom={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="w-full max-w-2xl"
          >
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Identity & Authority</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Tell us a bit about yourself and your organization.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Organization Name
                    </label>
                    <input
                      type="text"
                      value={data.orgName}
                      onChange={(e) => updateData({ orgName: e.target.value })}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Industry
                    </label>
                    <input
                      type="text"
                      value={data.industry}
                      onChange={(e) => updateData({ industry: e.target.value })}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                      placeholder="e.g. Technology"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Location
                    </label>
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => updateData({ location: e.target.value })}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                      placeholder="e.g. New York, USA"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <User className="w-4 h-4" /> Your Role
                    </label>
                    <select
                      value={data.role}
                      onChange={(e) => updateData({ role: e.target.value })}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all appearance-none"
                    >
                      <option value="">Select your role</option>
                      <option value="Owner">Owner</option>
                      <option value="Director">Director</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Contact Email
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => updateData({ email: e.target.value })}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                      placeholder="e.g. hello@acme.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Contact Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => updateData({ phone: e.target.value })}
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                      placeholder="e.g. +1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Primary Intent</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">What best describes why you’re reaching out?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Object.keys(PATH_CONTENT) as Path[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => updateData({ primaryIntent: key, refinement: '', closing: '' })}
                      className={`p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                        data.primaryIntent === key
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">{PATH_CONTENT[key].label}</span>
                        {data.primaryIntent === key && <Check className="w-6 h-6" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && data.primaryIntent && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Refinement</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {PATH_CONTENT[data.primaryIntent].page3.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {PATH_CONTENT[data.primaryIntent].page3.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateData({ refinement: option })}
                      className={`p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.01] ${
                        data.refinement === option
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">{option}</span>
                        {data.refinement === option && <Check className="w-6 h-6" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && data.primaryIntent && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Closing Filter</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {PATH_CONTENT[data.primaryIntent].page4.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {PATH_CONTENT[data.primaryIntent].page4.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateData({ closing: option })}
                      className={`p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.01] ${
                        data.closing === option
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">{option}</span>
                        {data.closing === option && <Check className="w-6 h-6" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <button
                disabled={!canProceed() || isSubmitting}
                onClick={handleNext}
                className={`flex items-center space-x-2 px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  canProceed() && !isSubmitting
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.05] shadow-lg shadow-blue-500/25'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>{step === 4 ? 'Complete Onboarding' : 'Continue'}</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
