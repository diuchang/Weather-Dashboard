import DatePicker from 'react-datepicker';
import { addDays, startOfDay } from 'date-fns';
import { useDashboardStore } from '../../store/dashboardStore';
import { HiCalendar } from 'react-icons/hi';

export default function DateRangePicker() {
  const dateRange = useDashboardStore((s) => s.dateRange);
  const setDateRange = useDashboardStore((s) => s.setDateRange);
  const setSelectedDate = useDashboardStore((s) => s.setSelectedDate);
  const [startDate, endDate] = dateRange;
  const today = startOfDay(new Date());

  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-panel-700 border border-white/10 px-3 py-2 text-sm">
      <HiCalendar size={14} className="text-slate-400" />
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          const [s, e] = update as [Date | null, Date | null];
          if (s) {
            setSelectedDate(s);
            setDateRange([s, e ?? addDays(s, 6)]);
          }
        }}
        minDate={today}
        maxDate={addDays(today, 15)}
        dateFormat="MMM d"
        placeholderText="Select range"
        className="!bg-transparent !border-none !text-white !text-sm !p-0 !w-28 cursor-pointer"
      />
    </div>
  );
}
