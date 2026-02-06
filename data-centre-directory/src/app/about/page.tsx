import '../globals.css';

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          About This Project
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            ClimateFast Ontario Data Centres
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This project is part of ClimateFast's initiative to understand and
            address the environmental impact of digital infrastructure in
            Ontario.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Data centres are significant consumers of electricity and
            contributors to carbon emissions. By mapping their locations and
            analyzing their impact, we can better understand how to build a more
            sustainable digital future.
          </p>
        </div>
      </div>
    </main>
  );
}
