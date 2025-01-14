import React, { useEffect } from 'react';
import Panel1 from './Panel1';
import Panel2 from './Panel2';

const App = () => {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Disable the default long-press menu
    };

    // Attach the event listener to the entire document
    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-700 p-4">
        <h1 className="text-3xl md:text-5xl text-white font-bold text-center">
          Robot Controller
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] overflow-hidden">
        {/* Panel 1: Path Management */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full overflow-auto border-b lg:border-b-0 lg:border-r border-gray-700">
          <Panel1 />
        </div>

        {/* Panel 2: Servo Node Controller */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full overflow-auto">
          <Panel2 />
        </div>
      </main>
    </div>
  );
}

export default App;