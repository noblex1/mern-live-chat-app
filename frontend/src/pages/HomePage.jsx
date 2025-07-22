import { Users } from 'lucide-react';
import React from 'react';
import ChartCard from '../components/ChartCard.jsx';
import ChartArea from '../components/ChartArea.jsx';

function HomePage() {
  return (
    <div className="w-full pt-[80px] flex h-screen overflow-hidden bg-gray-900 text-white">


      {/* Sidebar */}
      <aside className="w-full max-w-sm bg-gray-800 p-4 flex flex-col border-r border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <Users className="text-cyan-400" />
            <h2 className="text-lg font-semibold">Contacts</h2>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4 px-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            View Online only
          </label>
        </div>

        {/* Contact List */}
        <div className="overflow-y-auto space-y-2">
          <ChartCard />
          <ChartCard />
          <ChartCard />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-950">
        <ChartArea />
      </main>
    </div>
  );
}

export default HomePage;