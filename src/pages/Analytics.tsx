import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../store/useStore';
import { CustomSelect } from '../components/CustomSelect';
import { trackRender } from '../utils/profiler';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { 
  BarChart3, 
  FileCheck2, 
  UserPlus, 
  Mail, 
  Lock, 
  Briefcase, 
  Info,
  ShieldCheck
} from 'lucide-react';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define Zod Form Validation Schema
const onboardingSchema = z.object({
  fullName: z.string().min(3, { message: 'Full Name must be at least 3 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one digit.' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character.' }),
  role: z.enum(['SDE Intern', 'Frontend Developer', 'Fullstack Developer', 'QA Automation Engineer']),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and security guidelines.',
  }),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const Analytics: React.FC = () => {
  const { tasks, showAlertModal } = useStore();

  // Track render iterations
  useEffect(() => {
    trackRender('AnalyticsPage');
  });

  // 1. Process tasks data for Chart.js
  const categories = Array.from(new Set(tasks.map(t => t.category)));
  const completedCounts = categories.map(cat => tasks.filter(t => t.category === cat && t.completed).length);
  const pendingCounts = categories.map(cat => tasks.filter(t => t.category === cat && !t.completed).length);

  const chartData = {
    labels: categories.map(cat => cat.replace('UX & ', '')), // shorten labels slightly
    datasets: [
      {
        label: 'Completed',
        data: completedCounts,
        backgroundColor: 'rgba(34, 197, 94, 0.65)', // emerald-500
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1.5,
        borderRadius: 8,
      },
      {
        label: 'Pending ToDo',
        data: pendingCounts,
        backgroundColor: 'rgba(139, 92, 246, 0.65)', // brand-500
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'currentColor', // inherit dark/light mode text
          font: {
            family: 'Plus Jakarta Sans',
            weight: 600 as const,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(9, 9, 11, 0.9)',
        titleFont: { family: 'Plus Jakarta Sans' },
        bodyFont: { family: 'Plus Jakarta Sans' },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'gray', font: { family: 'Plus Jakarta Sans', size: 10 } },
      },
      y: {
        grid: { color: 'rgba(128, 128, 128, 0.1)' },
        ticks: { color: 'gray', font: { family: 'Plus Jakarta Sans', size: 10 }, stepSize: 1 },
        suggestedMax: 3,
      },
    },
  };

  // 2. React Hook Form + Zod setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'SDE Intern',
      agreeTerms: false,
    },
  });

  const onSubmit = (data: OnboardingFormData) => {
    // Simulate successful form onboarding logic
    console.log('Form Onboarded successfully:', data);
    showAlertModal('Registration Successful', `Welcome aboard, ${data.fullName}! Registration parsed successfully.`, 'success');
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-100 dark:border-brand-900/30">
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <BarChart3 size={24} className="text-brand-500" />
          Charts & Form Validations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Rendering interactive analytics using React Chart.js 2 and managing strict type validation forms using React Hook Form + Zod resolvers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Analytics Chart */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <BarChart3 size={18} className="text-brand-500" />
              Store Milestones Progress
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time analytics bar chart grouping curriculum tasks. Toggling completions on the main Dashboard updates this visualization dynamically.
            </p>
          </div>

          <div className="h-[280px] w-full bg-slate-50/50 dark:bg-zinc-950/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-900/50 flex items-center justify-center">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div className="text-[11px] text-slate-450 leading-relaxed bg-brand-50/40 dark:bg-brand-950/10 p-3 rounded-lg flex items-start gap-2">
            <Info size={14} className="text-brand-500 shrink-0 mt-0.5" />
            <span>
              This graph displays the ratio of **Completed** vs **Pending** milestones across various syllabus categories, verifying proper module interactions.
            </span>
          </div>
        </div>

        {/* Zod Registration Form */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div>
            <h2 className="text-lg font-bold font-display flex items-center gap-2">
              <UserPlus size={18} className="text-brand-500" />
              SDE Intern Registration Form
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Registration resolver demonstrating inline schema validation constraints on passwords and user details.
            </p>
          </div>

          {isSubmitSuccessful && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl border border-emerald-100 dark:border-emerald-950/40 flex items-center gap-2">
              <ShieldCheck size={16} />
              Intern registration submitted successfully! Forms are cleared.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <FileCheck2 size={12} className="text-slate-400" /> Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Shreesh Gupta"
                {...register('fullName')}
                className={`w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-zinc-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
                  errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                }`}
              />
              {errors.fullName && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Mail size={12} className="text-slate-400" /> Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="intern@presidio.com"
                {...register('email')}
                className={`w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-zinc-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
                  errors.email ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                }`}
              />
              {errors.email && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Lock size={12} className="text-slate-400" /> Secure Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className={`w-full text-xs p-2.5 rounded-xl border bg-white dark:bg-zinc-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
                  errors.password ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                }`}
              />
              {errors.password && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.password.message}</p>}
              <p className="text-[9px] text-slate-400 mt-1">Requires 6+ characters, 1 digit, and 1 special symbol.</p>
            </div>

            {/* Role select */}
            <div>
              <label htmlFor="role" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Briefcase size={12} className="text-slate-400" /> Intern Target Role
              </label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <CustomSelect
                    id="role"
                    options={[
                      { value: 'SDE Intern', label: 'SDE Intern' },
                      { value: 'Frontend Developer', label: 'Frontend Developer' },
                      { value: 'Fullstack Developer', label: 'Fullstack Developer' },
                      { value: 'QA Automation Engineer', label: 'QA Automation Engineer' },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    label="Intern Target Role"
                  />
                )}
              />
            </div>

            {/* Terms checkbox */}
            <div>
              <label className="flex items-start text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreeTerms')}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 mr-2 mt-0.5 cursor-pointer h-4 w-4"
                />
                <span className="leading-tight">I agree to Presidio onboarding guidelines and security policies.</span>
              </label>
              {errors.agreeTerms && <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors.agreeTerms.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-md shadow-brand-500/10 transition-colors"
            >
              <UserPlus size={14} /> Register Candidate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
