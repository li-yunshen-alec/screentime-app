import { useEffect, useState } from 'react';

function App() {
  const [siteUsage, setSiteUsage] = useState({});

  useEffect(() => {
    // Listen for updates from the WebSocket or Electron main process
    if (window.electron) {
      window.electron.on('updateUsage', (data) => {
        setSiteUsage(data);
      });
    }
  }, []);

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">Site Usage Tracker</h1>
      <ul className="bg-white shadow-md rounded-md p-4">
        {Object.entries(siteUsage).length === 0 ? (
          <p className="text-gray-500">No data available yet.</p>
        ) : (
          Object.entries(siteUsage).map(([site, time]) => (
            <li key={site} className="flex justify-between py-2 border-b">
              <span className="font-medium">{site}</span>
              <span>{time.toFixed(2)} seconds</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
