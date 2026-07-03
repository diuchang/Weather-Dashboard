import { useThemeStore } from '../store/themeStore';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import DateRangePicker from './MainPanel/DateRangePicker';

export default function Header() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-navy-900 flex-none">
      <h1 className="text-2xl font-semibold text-white tracking-tight">
        Vietnam Weather
      </h1>

      <div className="flex items-center gap-3">
        <DateRangePicker />

        <div className="flex items-center gap-0.5 rounded-full bg-panel-700 border border-white/10 p-0.5">
        <button
          onClick={() => setTheme('light')}
          aria-label="Light mode"
          aria-pressed={theme === 'light'}
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
            theme === 'light'
              ? 'bg-white text-amber-500 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HiOutlineSun size={15} />
        </button>
        <button
          onClick={() => setTheme('dark')}
          aria-label="Dark mode"
          aria-pressed={theme === 'dark'}
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
            theme === 'dark'
              ? 'bg-navy-600 text-blue-300 shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HiOutlineMoon size={15} />
        </button>
        </div>
      </div>
    </header>
  );
}
