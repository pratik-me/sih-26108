'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QueryAnalyticsData } from '@bis/shared-types';
import { apiClient } from '@bis/api-client';
import { LoadingState } from '@bis/ui';
import { isAuthenticated } from '@/lib/auth';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Clock,
  ThumbsUp,
  Flag,
  Globe,
  Award
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<QueryAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const analytics = await apiClient.getAnalytics();
        setData(analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [router]);


  if (isLoading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingState
          message="Loading BIS Intelligence Analytics..."
          submessage="Aggregating query logs, latency metrics, and citation accuracy statistics..."
        />
      </div>
    );
  }

  const intentChartData = Object.entries(data.queriesByIntent).map(([intent, count]) => ({
    name: intent.replace(/_/g, ' '),
    count
  }));

  const languageChartData = Object.entries(data.languageDistribution).map(([lang, percent]) => ({
    name: lang,
    value: percent
  }));

  const COLORS = ['#1E3A8A', '#D97706', '#059669', '#7C3AED', '#DC2626', '#0284C7'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>System Observability & Query Analytics</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          BIS Saarthi Intelligence Analytics
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Real-time metrics on user intents, popular standards, multilingual breakdown, retrieval latencies, and zero-hallucination accuracy.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Queries Processed</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {data.totalQueries.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">↑ 18% month over month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Citation Grounding Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {Math.round(data.citationAccuracyRate * 1000) / 10}%
          </div>
          <span className="text-[11px] text-slate-500">Zero-hallucination policy</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Avg Retrieval Latency</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {data.averageRetrievalLatencyMs} ms
          </div>
          <span className="text-[11px] text-slate-500">Hybrid BM25 + pgvector</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">User Satisfaction</span>
            <ThumbsUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">
            {Math.round(data.userSatisfactionRate * 1000) / 10}%
          </div>
          <span className="text-[11px] text-slate-500">{data.userFeedbackStats.helpful} verified ratings</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Intent Distribution Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Queries by Intent Category
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intentChartData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" textAnchor="end" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#1E3A8A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Distribution Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Multilingual Language Breakdown (%)
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {languageChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Searched Standards Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Most Inquired Indian Standards & Regulatory Mandates</span>
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {data.topSearchedStandards.map((std, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{std.standardNumber}</span>
              </div>
              <span className="font-bold text-blue-700 dark:text-blue-400 font-mono">
                {std.count.toLocaleString()} inquiries
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
