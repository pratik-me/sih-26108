'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@bis/shared-types';
import { apiClient } from '@bis/api-client';
import { Lock, Mail, User, Building, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { isAuthenticated } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.INDUSTRY);
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apiClient.register({
        email,
        password,
        fullName,
        role,
        organization
      });
      window.dispatchEvent(new Event('auth-change'));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-ashoka-pattern">
        <div className="flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-[#16A9D8]" />
          <p className="text-xs text-slate-500 dark:text-[#A8B6C7]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-ashoka-pattern">
      <div className="max-w-md w-full bg-white dark:bg-[#10243A] p-8 rounded-2xl border border-slate-200 dark:border-[#263B50] shadow-xl dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] space-y-6">
        <div className="text-center space-y-2">
          <Image src={"/BIS-LOGO.png"} alt='BIS-LOGO' height={42} width={42} className='mx-auto' unoptimized />
          <h1 className="text-xl font-black text-slate-900 dark:text-[#F1F5F9] tracking-tight">
            Register Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#A8B6C7]">
            Create an account to track compliance roadmaps and submit verification reports.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-[#F1F5F9] mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 dark:text-[#7F91A5] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Rajesh Sharma"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#263B50] bg-transparent dark:bg-[#0B1A2B] text-slate-900 dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-[#16A9D8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-[#F1F5F9] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-[#7F91A5] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rajesh@apexmetal.in"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#263B50] bg-transparent dark:bg-[#0B1A2B] text-slate-900 dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-[#16A9D8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-[#F1F5F9] mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-[#7F91A5] absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#263B50] bg-transparent dark:bg-[#0B1A2B] text-slate-900 dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-[#16A9D8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-[#F1F5F9] mb-1">
              Organization / Enterprise Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 dark:text-[#7F91A5] absolute left-3 top-3" />
              <input
                type="text"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder="Apex Metal Fab Pvt Ltd"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#263B50] bg-transparent dark:bg-[#0B1A2B] text-slate-900 dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-[#16A9D8]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-[#F1F5F9] mb-1">
              Primary Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-[#263B50] bg-white dark:bg-[#0B1A2B] text-slate-900 dark:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-[#16A9D8] cursor-pointer"
            >
              <option value={UserRole.INDUSTRY} className="dark:bg-[#10243A] dark:text-[#F1F5F9]">Indian Industry / MSME Manufacturer</option>
              <option value={UserRole.CONSUMER} className="dark:bg-[#10243A] dark:text-[#F1F5F9]">Consumer / Citizen</option>
              <option value={UserRole.STUDENT_RESEARCHER} className="dark:bg-[#10243A] dark:text-[#F1F5F9]">Student / Academic Researcher</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 dark:bg-[#1268B3] dark:hover:bg-[#1583D1] text-white shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-[#A8B6C7] pt-2 border-t border-slate-100 dark:border-[#263B50]">
          <span>Already have an account? </span>
          <Link href="/login" className="text-blue-600 dark:text-[#16A9D8] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
