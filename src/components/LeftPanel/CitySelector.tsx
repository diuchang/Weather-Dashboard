import { useState, useRef, useEffect } from 'react';
import { useDashboardStore } from '../../store/dashboardStore';
import { CITIES, REGION_LABELS } from '../../data/cities';
import type { City } from '../../types';
import { HiChevronDown, HiSearch } from 'react-icons/hi';

export default function CitySelector() {
  const selectedCity = useDashboardStore((s) => s.selectedCity);
  const setSelectedCity = useDashboardStore((s) => s.setSelectedCity);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = CITIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = (['north', 'central', 'south'] as const).map((r) => ({
    region: r,
    label: REGION_LABELS[r],
    cities: filtered.filter((c) => c.region === r),
  })).filter((g) => g.cities.length > 0);

  function select(city: City) {
    setSelectedCity(city);
    setOpen(false);
    setSearch('');
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-lg bg-panel-700 border border-white/10 px-3 py-2.5 text-sm text-white hover:border-blue-500/50 transition-colors"
      >
        <span className="truncate">{selectedCity.name}</span>
        <HiChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl bg-navy-800 border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-white/5">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5">
              <HiSearch size={14} className="text-slate-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {grouped.map(({ region, label, cities }) => (
              <div key={region}>
                <p className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => select(city)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      city.id === selectedCity.id
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
