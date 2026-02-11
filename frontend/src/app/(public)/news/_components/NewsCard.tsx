"use client";

import { NewsArticle } from "@/lib/types/news.types";
import { ExternalLink, Calendar, Tag, Globe } from "lucide-react";
import { motion } from "framer-motion";

// Helper to format date "2 hours ago"
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

// Source badge colors
const getSourceColor = (source: string) => {
  switch (source) {
    case 'MONEYCONTROL': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'ECONOMIC_TIMES': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    case 'NSE': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export default function NewsCard({ article, index }: { article: NewsArticle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="group relative flex flex-col h-full bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl overflow-hidden hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-6 flex flex-col flex-grow relative z-10">
        {/* Header: Source & Time */}
        <div className="flex justify-between items-center mb-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getSourceColor(article.source)} flex items-center gap-1.5`}>
            <Globe className="w-3 h-3" />
            {article.source.replace('_', ' ')}
          </span>
          <span className="text-slate-500 text-xs flex items-center gap-1.5 font-medium">
            <Calendar className="w-3 h-3" />
            {formatTimeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-100 mb-3 leading-snug group-hover:text-indigo-400 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
          {article.description}
        </p>

        {/* Footer: Tags & Link */}
        <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/5">
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded-md bg-white/5 text-slate-400 text-xs font-medium border border-white/5 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {article.category}
            </span>
            {article.relatedSymbols.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                ${article.relatedSymbols[0]}
              </span>
            )}
          </div>

          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-300 group-hover:translate-x-1"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}