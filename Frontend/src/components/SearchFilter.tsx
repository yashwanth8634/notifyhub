import { Search, Filter } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

export function SearchFilter({ searchTerm, onSearchChange, category, onCategoryChange, categories }: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 border border-white/10 rounded-xl leading-5 bg-[#151515]/70 backdrop-blur-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          placeholder="Search notices..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="relative w-full sm:w-64 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Filter className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
        </div>
        <select
          className="block w-full pl-11 pr-10 py-3 border border-white/10 rounded-xl leading-5 bg-[#151515]/70 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)] appearance-none cursor-pointer"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="" className="bg-[#151515] text-white">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c} className="bg-[#151515] text-white">{c}</option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}
