"use client";

import { NewsArticle } from "@/lib/types/news.types";
import { ExternalLink, Calendar, TrendingUp, Zap, Globe, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

// Helper for source colors matching your dashboard theme
const getSourceStyles = (source: string) => {
  switch (source) {
    case 'MONEYCONTROL': 
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', iconBg: 'bg-green-100' };
    case 'ECONOMIC_TIMES': 
      return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', iconBg: 'bg-pink-100' };
    case 'NSE': 
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', iconBg: 'bg-blue-100' };
    default: 
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100', iconBg: 'bg-slate-100' };
  }
};

// Helper for category icons
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'MARKET': return TrendingUp;
    case 'STOCKS': return Zap;
    case 'ECONOMY': return Globe;
    default: return Newspaper;
  }
};

export default function NewsDashboardCard({ article, index }: { article: NewsArticle; index: number }) {
  const styles = getSourceStyles(article.source);
  const CategoryIcon = getCategoryIcon(article.category);
  
  // Format relative time
  const timeAgo = (dateStr: string) => {
    const diff = (new Date().getTime() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col h-full bg-white rounded-2xl shadow-sm border ${styles.border} hover:shadow-md transition-all duration-300 overflow-hidden`}
    >
      {/* Top Decor Bar */}
      <div className={`h-1.5 w-full ${styles.bg.replace('50', '400')}`} />

      <div className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold ${styles.bg} ${styles.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${styles.text.replace('text', 'bg')}`} />
            {article.source.replace('_', ' ')}
          </div>
          <span className="text-slate-400 text-xs font-medium whitespace-nowrap">
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-slate-800 font-bold text-lg mb-2 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {article.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              <CategoryIcon className="w-3 h-3" />
              {article.category}
            </span>
          </div>

          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
          >
            Read <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
