"use client";

import { NewsArticle } from "@/lib/types/news.types";
import { ExternalLink, Calendar, Tag, Globe, Share2 } from "lucide-react";
import { motion } from "framer-motion";

// Helper to format date
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

// Source colors
const getSourceColor = (source: string) => {
  switch (source) {
    case 'MONEYCONTROL': return 'text-green-400 border-green-500/20 bg-green-500/10';
    case 'ECONOMIC_TIMES': return 'text-pink-400 border-pink-500/20 bg-pink-500/10';
    case 'NSE': return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
    default: return 'text-slate-400 border-slate-500/20 bg-slate-500/10';
  }
};

export default function NewsCard({ article, index }: { article: NewsArticle; index: number }) {
  return (
    <motion.div
      // --- COOL ANIMATION SETTINGS ---
      initial={{ opacity: 0, y: 100, scale: 0.95 }} // Start: Invisible, down, small
      whileInView={{ opacity: 1, y: 0, scale: 1 }}  // End: Visible, up, normal
      viewport={{ once: true, margin: "-100px" }}   // Trigger when 100px into view
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      
      className="group relative flex flex-col bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-500"
    >
      {/* Dynamic Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="p-8 md:p-10 flex flex-col relative z-10">
        
        {/* TOP META: Source & Date */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 uppercase tracking-wider ${getSourceColor(article.source)}`}>
              <Globe className="w-3 h-3" />
              {article.source.replace('_', ' ')}
            </span>
            {article.relatedSymbols.length > 0 && (
               <span className="px-3 py-1 rounded-full bg-slate-800 text-indigo-300 text-xs font-bold border border-slate-700">
                 ${article.relatedSymbols[0]}
               </span>
            )}
          </div>
          <span className="text-slate-500 text-xs font-semibold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatTimeAgo(article.publishedAt)}
          </span>
        </div>

        {/* CONTENT: Big Title & Description */}
        <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4 leading-tight group-hover:text-indigo-400 transition-colors">
            {article.title}
            </h3>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            {article.description}
            </p>
        </div>

        {/* FOOTER: Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-medium border border-white/5 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" />
              {article.category}
            </span>
          </div>

          <div className="flex gap-3">
             {/* Read More Button */}
            <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-indigo-600 hover:text-white transition-all duration-300 group/btn"
            >
                Read Full Story
                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </motion.div>
  );
}