'use client';

import GeoJSONMap from './components/GeoJSONMap';
import './globals.css';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Ontario Data Centre Map
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Click on features to view detailed information
            </p>
          </div>
          <GeoJSONMap geojsonUrl="/data/SCOOP2023_1km_Z17_Index.geojson" />
        </div>
      </div>
    </main>
  );
}
