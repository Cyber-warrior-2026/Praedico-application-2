"use client";

import { useState, useEffect } from 'react';
import { X, Loader2, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { coordinatorApi } from '@/lib/api';

interface ViewPortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
}

export default function ViewPortfolioModal({ isOpen, onClose, student }: ViewPortfolioModalProps) {
    const [portfolio, setPortfolio] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && student) {
            fetchPortfolio();
        }
    }, [isOpen, student]);

    const fetchPortfolio = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await coordinatorApi.getStudentPortfolio(student._id);
            if (response.success) {
                setPortfolio(response.portfolio);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch portfolio');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !student) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(value);
    };

    const getPLColor = (pl: number) => {
        if (pl > 0) return 'text-emerald-400';
        if (pl < 0) return 'text-red-400';
        return 'text-slate-400';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-indigo-400" />
                            Portfolio Analysis
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Viewing portfolio for <span className="text-white font-medium">{student.name}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                            <p className="text-slate-400">Loading portfolio data...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                            {error}
                        </div>
                    ) : portfolio ? (
                        <div className="space-y-8">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                                    <p className="text-slate-400 text-sm mb-1">Total Invested</p>
                                    <p className="text-2xl font-bold text-white">
                                        {formatCurrency(portfolio.summary?.totalInvested || 0)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                                    <p className="text-slate-400 text-sm mb-1">Current Value</p>
                                    <p className="text-2xl font-bold text-white">
                                        {formatCurrency(portfolio.summary?.currentValue || 0)}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                                    <p className="text-slate-400 text-sm mb-1">Total P&L</p>
                                    <p className={`text-2xl font-bold ${getPLColor(portfolio.summary?.totalPL || 0)} flex items-center gap-2`}>
                                        {(portfolio.summary?.totalPL || 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                        {formatCurrency(Math.abs(portfolio.summary?.totalPL || 0))}
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                                    <p className="text-slate-400 text-sm mb-1">Return</p>
                                    <p className={`text-2xl font-bold ${getPLColor(portfolio.summary?.totalPLPercentage || 0)}`}>
                                        {(portfolio.summary?.totalPLPercentage || 0) > 0 ? '+' : ''}
                                        {(portfolio.summary?.totalPLPercentage || 0).toFixed(2)}%
                                    </p>
                                </div>
                            </div>

                            {/* Holdings Table */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Holdings</h3>
                                {portfolio.holdings && portfolio.holdings.length > 0 ? (
                                    <div className="overflow-x-auto rounded-xl border border-white/5">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-900/50 text-xs uppercase text-slate-400 font-medium">
                                                <tr>
                                                    <th className="p-4">Stock</th>
                                                    <th className="p-4 text-right">Qty</th>
                                                    <th className="p-4 text-right">Avg. Price</th>
                                                    <th className="p-4 text-right">Current Price</th>
                                                    <th className="p-4 text-right">Invested</th>
                                                    <th className="p-4 text-right">Current Value</th>
                                                    <th className="p-4 text-right">P&L</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-sm">
                                                {portfolio.holdings.map((holding: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="p-4">
                                                            <div>
                                                                <div className="font-bold text-white">{holding.symbol}</div>
                                                                <div className="text-xs text-slate-500">{holding.stockName}</div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-right text-slate-300 font-mono">{holding.quantity}</td>
                                                        <td className="p-4 text-right text-slate-300 font-mono">{formatCurrency(holding.averageBuyPrice)}</td>
                                                        <td className="p-4 text-right text-slate-300 font-mono">{formatCurrency(holding.currentPrice)}</td>
                                                        <td className="p-4 text-right text-slate-300 font-mono">{formatCurrency(holding.totalInvested)}</td>
                                                        <td className="p-4 text-right text-slate-300 font-mono">{formatCurrency(holding.currentValue)}</td>
                                                        <td className={`p-4 text-right font-bold font-mono ${getPLColor(holding.pl)}`}>
                                                            <div className="flex flex-col items-end">
                                                                <span>{(holding.pl > 0 ? '+' : '')}{formatCurrency(holding.pl)}</span>
                                                                <span className="text-xs opacity-70">{(holding.plPercentage > 0 ? '+' : '')}{(holding.plPercentage || 0).toFixed(2)}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-white/5 border-dashed">
                                        <div className="h-12 w-12 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <DollarSign className="h-6 w-6 text-slate-600" />
                                        </div>
                                        <p className="text-slate-400">No holdings found in this portfolio.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-400">
                            Failed to load portfolio data.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
