"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Loader2, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { tradingApi } from "@/lib/api/trading.api";
import { TradeRequest, PortfolioHolding } from "@/lib/types/trading.types";

interface TradingPanelProps {
    symbol: string;
    stockName: string;
    currentPrice: number;
    userHolding?: PortfolioHolding | null;
    availableBalance: number;
    onTradeExecuted?: () => void;
}

export const TradingPanel: React.FC<TradingPanelProps> = ({
    symbol,
    stockName,
    currentPrice,
    userHolding,
    availableBalance,
    onTradeExecuted,
}) => {
    const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
    const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP_LOSS'>('MARKET');
    const [quantity, setQuantity] = useState<number>(1);
    const [limitPrice, setLimitPrice] = useState<string>('');
    const [stopLossPrice, setStopLossPrice] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const MIN_REASON_LENGTH = 50;
    const isReasonValid = reason.trim().length >= MIN_REASON_LENGTH;

    // Calculate total amount
    const effectivePrice = orderType === 'LIMIT' && limitPrice
        ? parseFloat(limitPrice)
        : currentPrice;
    const totalAmount = quantity * effectivePrice;

    // Validation
    const canBuy = tradeType === 'BUY' && totalAmount <= availableBalance;
    const canSell = tradeType === 'SELL' && userHolding && quantity <= userHolding.quantity;
    const isTradeValid = tradeType === 'BUY' ? canBuy : canSell;
    const isValid = isTradeValid && isReasonValid;

    // Handle quick quantity selectors
    const quickQuantities = [5, 10, 25, 50];

    // Execute trade
    const handleExecuteTrade = async () => {
        setError(null);
        setSuccess(null);

        if (!isValid) {
            setError(
                tradeType === 'BUY'
                    ? 'Insufficient balance'
                    : 'Insufficient holdings'
            );
            return;
        }

        setLoading(true);

        try {
            const request: TradeRequest = {
                symbol,
                type: tradeType,
                quantity,
                orderType,
                reason: reason.trim(),
            };

            if (orderType === 'LIMIT' && limitPrice) {
                request.limitPrice = parseFloat(limitPrice);
            }

            if (orderType === 'STOP_LOSS' && stopLossPrice) {
                request.stopLossPrice = parseFloat(stopLossPrice);
            }

            const response = await tradingApi.executeTrade(request);

            if (response.success) {
                setSuccess(response.message);
                setQuantity(1);
                setLimitPrice('');
                setStopLossPrice('');
                setReason('');
                onTradeExecuted?.();

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to execute trade');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Trade Type Toggle */}
            <div className="flex gap-2">
                <button
                    onClick={() => setTradeType('BUY')}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all",
                        tradeType === 'BUY'
                            ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50"
                            : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
                    )}
                >
                    Buy
                </button>
                <button
                    onClick={() => setTradeType('SELL')}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all",
                        tradeType === 'SELL'
                            ? "bg-red-500/20 text-red-400 border-2 border-red-500/50"
                            : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
                    )}
                    disabled={!userHolding || userHolding.quantity === 0}
                >
                    Sell
                </button>
            </div>

            {/* Order Type */}
            <div>
                <label className="text-xs text-slate-400 font-medium mb-2 block">
                    Order Type
                </label>
                <div className="flex gap-2">
                    {['MARKET', 'LIMIT', 'STOP_LOSS'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setOrderType(type as any)}
                            className={cn(
                                "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
                                orderType === type
                                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                                    : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
                            )}
                        >
                            {type === 'MARKET' ? 'Market' : type === 'LIMIT' ? 'Limit' : 'Stop Loss'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantity */}
            <div>
                <label className="text-xs text-slate-400 font-medium mb-2 block">
                    Quantity
                </label>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <div className="flex gap-2 mt-2">
                    {quickQuantities.map((q) => (
                        <button
                            key={q}
                            onClick={() => setQuantity(q)}
                            className="flex-1 py-1.5 px-3 bg-white/5 border border-white/5 rounded-md text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* Limit Price (conditional) */}
            {orderType === 'LIMIT' && (
                <div>
                    <label className="text-xs text-slate-400 font-medium mb-2 block">
                        Limit Price (₹)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        placeholder={currentPrice.toFixed(2)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                </div>
            )}

            {/* Stop Loss Price (conditional) */}
            {orderType === 'STOP_LOSS' && (
                <div>
                    <label className="text-xs text-slate-400 font-medium mb-2 block">
                        Stop Loss Price (₹)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={stopLossPrice}
                        onChange={(e) => setStopLossPrice(e.target.value)}
                        placeholder={(currentPrice * 0.95).toFixed(2)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                </div>
            )}

            {/* Reason / Thesis Textarea */}
            <div>
                <label className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Trading Reason / Thesis
                    <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={tradeType === 'BUY'
                        ? "Why are you buying this stock? Explain your thesis (min 50 characters)..."
                        : "Why are you selling this stock? Explain your reasoning (min 50 characters)..."
                    }
                    rows={3}
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none placeholder:text-slate-600"
                />
                <div className="flex justify-between items-center mt-1.5">
                    <div className={cn(
                        "text-xs font-medium transition-colors",
                        isReasonValid ? "text-emerald-400" : "text-amber-500"
                    )}>
                        {isReasonValid ? (
                            <span className="flex items-center gap-1">✓ Valid reason</span>
                        ) : (
                            <span>Min 50 chars required</span>
                        )}
                    </div>
                    <div className={cn(
                        "text-xs font-medium tabular-nums transition-colors",
                        isReasonValid ? "text-emerald-400" : "text-amber-500"
                    )}>
                        {reason.length} / 1000
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="text-xs text-slate-400 font-bold uppercase mb-3">
                    Order Summary
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Stock Price</span>
                    <span className="text-white font-medium">₹{currentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Quantity</span>
                    <span className="text-white font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                    <span className="text-slate-400 font-bold">Total Amount</span>
                    <span className="text-white font-bold">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Available Balance</span>
                    <span className={cn(
                        "font-medium",
                        totalAmount > availableBalance ? "text-red-400" : "text-emerald-400"
                    )}>
                        ₹{availableBalance.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-red-400">{error}</span>
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <ShoppingCart className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">{success}</span>
                </div>
            )}

            {/* Execute Button */}
            <button
                onClick={handleExecuteTrade}
                disabled={!isValid || loading}
                className={cn(
                    "w-full py-4 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                    isValid && !loading
                        ? tradeType === 'BUY'
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-white/5 text-slate-500 cursor-not-allowed opacity-50"
                )}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Executing...
                    </>
                ) : (
                    <>
                        <ShoppingCart className="h-5 w-5" />
                        Execute {tradeType === 'BUY' ? 'Buy' : 'Sell'} Order
                    </>
                )}
            </button>
        </div>
    );
};
