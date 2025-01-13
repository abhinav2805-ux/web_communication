import React from 'react';
import Panel1 from './Panel1';
import Panel2 from './Panel2';

const App = () => {
  return (
    <>
      {/* Header */}
      <div className='min-h-screen'>
      <div className="text-4xl font-bold text-center text-cyan-400 pb-1 pt-2 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        Robot Controls
      </div>
    
      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-stretch bg-black text-white p-3">
        {/* Panel 1: Path Management */}
        <div className="w-full md:w-1/2 md:mr-2">
          <Panel1 />
        </div>

        {/* Panel 2: Servo Node Controller */}
        <div className="w-full md:w-1/2">
          <Panel2 />
        </div>
      </div>
      </div>
    </>
  );
};

export default App;
