import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import MainPanel from './components/MainPanel';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-navy-900">
      <Header />
      <div className="flex flex-1 min-h-0">
        <LeftPanel />
        <MainPanel />
      </div>
    </div>
  );
}
