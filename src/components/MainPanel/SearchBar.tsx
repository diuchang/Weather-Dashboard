import { useState, useEffect, useRef } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { searchLocations } from '../../api/geocoding';
import type { GeoResult } from '../../types';
import { CITIES } from '../../data/cities';
import { HiSearch, HiX } from 'react-icons/hi';

export default function SearchBar() {
  const setSelectedCity = useDashboardStore((s) => s.setSelectedCity);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (query.length < 2) { setResults([]); return; }
    timerRef.current = setTimeout(async () => {
      const r = await searchLocations(query);
      setResults(r);
      setOpen(r.length > 0);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function pick(r: GeoResult) {
    const existing = CITIES.find(
      (c) => Math.abs(c.lat - r.latitude) < 0.05 && Math.abs(c.lon - r.longitude) < 0.05
    );
    if (existing) {
      setSelectedCity(existing);
    } else {
      setSelectedCity({
        id: `geo_${r.id}`,
        name: r.name,
        lat: r.latitude,
        lon: r.longitude,
        region: r.latitude < 12 ? 'south' : r.latitude < 17 ? 'central' : 'north',
      });
    }
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-xs">
      <div className="flex items-center gap-2 rounded-lg bg-panel-700 border border-white/10 px-3 py-2 focus-within:border-blue-500/50 transition-colors">
        <HiSearch size={14} className="text-slate-400 flex-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search location..."
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }}>
            <HiX size={14} className="text-slate-400 hover:text-white" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl bg-navy-800 border border-white/10 shadow-2xl overflow-hidden">
          {results.slice(0, 6).map((r) => (
            <button
              key={r.id}
              onClick={() => pick(r)}
              className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0"
            >
              <span className="font-medium text-white">{r.name}</span>
              <span className="text-slate-500 ml-1">{[r.admin1, r.country].filter(Boolean).join(', ')}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
