import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Loader2, Building2, Briefcase, MapPin, User, Mail, Phone } from 'lucide-react';

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
  communicationChannel: string;
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
    communicationChannel: '',
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
      if (stepNum >= 1 && stepNum <= 5) {
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
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Map intent key to label for human-readable notifications
      const submissionData = {
        ...data,
        primaryIntent: data.primaryIntent ? PATH_CONTENT[data.primaryIntent].label : data.primaryIntent,
        appointmentType: "ERIC WILLIAM | 30-Minute Strategy"
      };

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
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
  const isStep5Valid = data.communicationChannel !== '';

  const canProceed = () => {
    if (step === 1) return isStep1Valid;
    if (step === 2) return isStep2Valid;
    if (step === 3) return isStep3Valid;
    if (step === 4) return true; // Step 4 is scheduling, user proceeds after booking
    if (step === 5) return isStep5Valid;
    return false;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4 py-8">
        <Helmet>
          <title>Thank You | Dynamic Rankers</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center space-y-6 p-8 md:p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Success!</h1>
            <p className="text-gray-800 dark:text-gray-200 text-lg md:text-xl font-medium">
              Your onboarding journey has officially begun. We've received your data and scheduled meeting details.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              A confirmation email has been sent to your inbox. We look forward to our strategy call!
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-4 px-8 py-3 bg-accent-light dark:bg-accent-dark text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-accent-light/25"
          >
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen bg-background-light dark:bg-background-dark overflow-hidden flex flex-col font-sans relative">
      <Helmet>
        <title>Onboarding | Dynamic Rankers</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Consolidated Funnel Header */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full bg-accent-light dark:bg-accent-dark"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="relative h-16 md:h-20 flex items-center justify-center px-6">
          {/* Logo - Fixed position in header */}
          <div className="absolute left-6 md:left-12">
            <img src="/favicon.svg" alt="Company Logo" className="w-8 h-8 md:w-10 md:h-10 opacity-30 grayscale brightness-0 dark:invert" />
          </div>

          {/* Step Status Indicator */}
          <div className="text-center">
            <span className="text-[10px] md:text-xs font-bold text-accent-light dark:text-accent-dark uppercase tracking-[0.3em]">
              Step {step} of 5
            </span>
          </div>

          {/* Placeholder for Dark Mode Toggle (positioned via component) */}
          <div className="absolute right-6 md:right-12 w-10" />
        </div>
      </header>

      <div className="flex-1 relative overflow-y-auto px-4 pt-24 pb-12 md:pt-32 md:pb-12 flex items-start justify-center">

        <AnimatePresence mode="wait" custom={step}>
          <motion.div
            key={step}
            custom={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="w-full max-w-2xl py-8"
          >
            {step === 1 && (
              <div className="space-y-6 md:space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">Identity & Authority</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg px-4">Tell us a bit about yourself and your organization.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Organization Name
                    </label>
                    <input
                      type="text"
                      value={data.orgName}
                      onChange={(e) => updateData({ orgName: e.target.value })}
                      className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark dark:text-white transition-all placeholder-gray-500"
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
                      className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all placeholder-gray-500"
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
                      className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all placeholder-gray-500"
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
                      className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all appearance-none text-gray-900 dark:text-white"
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
                      className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all placeholder-gray-500"
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
                      className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all placeholder-gray-500"
                      placeholder="e.g. +1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 md:space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">Primary Intent</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg px-4">What best describes why you’re reaching out?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {(Object.keys(PATH_CONTENT) as Path[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => updateData({ primaryIntent: key, refinement: '', closing: '' })}
                      className={`p-4 md:p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                        data.primaryIntent === key
                          ? 'border-accent-light dark:border-accent-dark bg-surface-light dark:bg-surface-dark text-accent-light dark:text-accent-dark'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg md:text-xl font-semibold">{PATH_CONTENT[key].label}</span>
                        {data.primaryIntent === key && <Check className="w-6 h-6" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && data.primaryIntent && (
              <div className="space-y-6 md:space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">Refinement</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg px-4">
                    {PATH_CONTENT[data.primaryIntent].page3.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {PATH_CONTENT[data.primaryIntent].page3.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateData({ refinement: option })}
                      className={`p-4 md:p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.01] ${
                        data.refinement === option
                          ? 'border-accent-light dark:border-accent-dark bg-surface-light dark:bg-surface-dark text-accent-light dark:text-accent-dark'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg md:text-xl font-semibold">{option}</span>
                        {data.refinement === option && <Check className="w-6 h-6" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 md:space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">Schedule Strategy Call</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg px-4">
                    Pick a slot in our calendar below to book your strategy session.
                  </p>
                </div>

                <div className="w-full bg-white rounded-2xl overflow-hidden border border-gray-400 dark:border-gray-600 shadow-xl h-[550px] md:h-[650px] relative">
                  <iframe
                    src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1cI5oxmj_DipnWQk67oGJmZcueJzKRyuSLi1szOdiHaQeBSUsxg7a4cQz5SDhodV0Cdz-Xjf0Q?gv=true"
                    style={{ border: 0 }}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    title="Google Calendar Appointment Scheduling"
                  ></iframe>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 md:space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">Communication Channel</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg px-4">
                    How would you like to connect for our meeting?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4 max-w-md mx-auto w-full">
                  {["Zoom Meeting", "Google Meet", "WhatsApp / Phone"].map((option) => (
                    <button
                      key={option}
                      onClick={() => updateData({ communicationChannel: option })}
                      className={`p-4 md:p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.01] ${
                        data.communicationChannel === option
                          ? 'border-accent-light dark:border-accent-dark bg-surface-light dark:bg-surface-dark text-accent-light dark:text-accent-dark'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg md:text-xl font-semibold">{option}</span>
                        {data.communicationChannel === option && <Check className="w-6 h-6" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 md:mt-12 flex justify-center pb-8 md:pb-0">
              <button
                disabled={!canProceed() || isSubmitting}
                onClick={handleNext}
                className={`flex items-center space-x-2 px-8 md:px-12 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform ${
                  canProceed() && !isSubmitting
                    ? 'bg-accent-light dark:bg-accent-dark text-white hover:opacity-90 hover:scale-[1.05] shadow-lg shadow-accent-light/25'
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
                    <span>{step === 5 ? 'Complete Onboarding' : 'Continue'}</span>
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
