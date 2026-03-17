/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Fuel, 
  TrendingUp, 
  Clock, 
  Leaf, 
  IndianRupee, 
  Calculator,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'motion/react';

export default function App() {
  // Input States
  const [dailyDistance, setDailyDistance] = useState<number>(50);
  const [petrolMileage, setPetrolMileage] = useState<number>(15);
  const [fuelPrice, setFuelPrice] = useState<number>(100);
  const [evEfficiency, setEvEfficiency] = useState<number>(7);
  const [electricityCost, setElectricityCost] = useState<number>(8);
  const [extraEvCost, setExtraEvCost] = useState<number>(400000);

  // Calculations - This useMemo hook recalculates values whenever any input changes
  const results = useMemo(() => {
    // Prevent division by zero errors
    const safePetrolMileage = petrolMileage || 1;
    const safeEvEfficiency = evEfficiency || 1;

    // 1. Monthly fuel cost for petrol vehicle: (daily distance ÷ mileage) × fuel price × 30 days
    const monthlyPetrolCost = (dailyDistance / safePetrolMileage) * fuelPrice * 30;
    
    // 2. Monthly electricity cost for EV: (daily distance ÷ EV efficiency) × electricity cost × 30 days
    const monthlyEvCost = (dailyDistance / safeEvEfficiency) * electricityCost * 30;
    
    // 3. Monthly savings: Petrol cost − EV cost
    const monthlySavings = monthlyPetrolCost - monthlyEvCost;
    
    // 4. Yearly savings: Monthly savings × 12 months
    const yearlySavings = monthlySavings * 12;
    
    // 5. Break-even time (in months): Extra EV cost ÷ monthly savings
    // We only calculate this if savings are positive
    const breakEvenMonths = monthlySavings > 0 ? extraEvCost / monthlySavings : -1;
    
    // 6. CO2 emissions saved: Assume petrol emits 2.3 kg CO2 per litre
    const co2Saved = (dailyDistance / safePetrolMileage) * 2.3 * 30;

    return {
      monthlyPetrolCost,
      monthlyEvCost,
      monthlySavings,
      yearlySavings,
      breakEvenMonths,
      co2Saved
    };
  }, [dailyDistance, petrolMileage, fuelPrice, evEfficiency, electricityCost, extraEvCost]);

  // Helper to format break-even time
  const formatBreakEven = (months: number) => {
    if (months < 0) return "No Break-even (EV cost > Petrol)";
    if (months === 0) return "Instant (No extra cost)";
    
    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);
    
    if (years === 0) return `${remainingMonths} Months`;
    return `${years} Year${years > 1 ? 's' : ''} ${remainingMonths} Month${remainingMonths !== 1 ? 's' : ''}`;
  };

  // Data for the comparison chart
  const chartData = [
    { name: 'Petrol', cost: Math.round(results.monthlyPetrolCost), fill: '#ef4444' },
    { name: 'EV', cost: Math.round(results.monthlyEvCost), fill: '#22c55e' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center md:justify-start gap-3 mb-2"
          >
            <div className="bg-emerald-500 p-2 rounded-xl text-white">
              <Calculator size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              EV vs Petrol <span className="text-emerald-600">Cost Calculator</span>
            </h1>
          </motion.div>
          <p className="text-slate-500 text-lg">Compare running costs and see how much you can save by switching to electric.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Info size={20} className="text-emerald-500" />
                Input Details
              </h2>
              
              <div className="space-y-4">
                <InputField 
                  label="Daily Travel (km)" 
                  value={dailyDistance} 
                  onChange={setDailyDistance} 
                  icon={<TrendingUp size={18} />}
                />
                <InputField 
                  label="Petrol Mileage (km/L)" 
                  value={petrolMileage} 
                  onChange={setPetrolMileage} 
                  icon={<Fuel size={18} />}
                />
                <InputField 
                  label="Fuel Price (₹/L)" 
                  value={fuelPrice} 
                  onChange={setFuelPrice} 
                  icon={<IndianRupee size={18} />}
                />
                <InputField 
                  label="EV Efficiency (km/unit)" 
                  value={evEfficiency} 
                  onChange={setEvEfficiency} 
                  icon={<Zap size={18} />}
                />
                <InputField 
                  label="Electricity Cost (₹/unit)" 
                  value={electricityCost} 
                  onChange={setElectricityCost} 
                  icon={<IndianRupee size={18} />}
                />
                <InputField 
                  label="Extra EV Cost (Price Difference) (₹)" 
                  value={extraEvCost} 
                  onChange={setExtraEvCost} 
                  icon={<IndianRupee size={18} />}
                />
              </div>
            </div>

            {/* Savings Message */}
            <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg shadow-emerald-200">
              <h3 className="text-lg font-medium opacity-90 mb-1">Total Yearly Savings</h3>
              <p className="text-3xl font-bold">₹{results.yearlySavings > 0 ? results.yearlySavings.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'}</p>
              <p className="mt-2 text-sm opacity-80 italic">
                {results.yearlySavings > 0 
                  ? `"You save ₹${Math.round(results.yearlySavings).toLocaleString('en-IN')} per year by switching to EV"`
                  : `"EV running cost is currently higher than Petrol with these settings"`}
              </p>
            </div>
          </motion.section>

          {/* Results Section */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultCard 
                title="Monthly Petrol Cost" 
                value={results.monthlyPetrolCost} 
                icon={<Fuel className="text-red-500" />}
                color="red"
              />
              <ResultCard 
                title="Monthly EV Cost" 
                value={results.monthlyEvCost} 
                icon={<Zap className="text-emerald-500" />}
                color="emerald"
              />
              <ResultCard 
                title="Monthly Savings" 
                value={results.monthlySavings > 0 ? results.monthlySavings : 0} 
                icon={<TrendingUp className="text-blue-500" />}
                color="blue"
              />
              <ResultCard 
                title="CO2 Saved (kg/mo)" 
                value={results.co2Saved} 
                icon={<Leaf className="text-green-600" />}
                color="green"
                suffix="kg"
              />
            </div>

            {/* Break-even Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-4 rounded-full text-amber-600">
                  <Clock size={32} />
                </div>
                <div>
                  <h3 className="text-slate-500 font-medium">Break-even Time</h3>
                  <p className="text-2xl md:text-3xl font-bold text-slate-900">
                    {formatBreakEven(results.breakEvenMonths)}
                  </p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-slate-400 max-w-xs">
                  Time taken to recover the extra upfront cost (₹{extraEvCost.toLocaleString('en-IN')}) through fuel savings.
                </p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-semibold mb-6">Monthly Cost Comparison</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>© 2026 EV vs Petrol Cost Calculator. Built for a greener future.</p>
        </footer>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, icon }: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium"
      />
    </div>
  );
}

function ResultCard({ title, value, icon, color, suffix = "₹" }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}) {
  const colorClasses = {
    red: "bg-red-50 text-red-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-900">
          {suffix === "₹" ? "₹" : ""}{Math.round(value).toLocaleString('en-IN')} {suffix !== "₹" ? suffix : ""}
        </p>
      </div>
    </div>
  );
}
