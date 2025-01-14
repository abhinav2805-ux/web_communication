import React from 'react';
import Panel1 from './Panel1';
import Panel2 from './Panel2';

  const App = () => {
    return (
      <>
        {/* Header */}
        <div className='h-full'>
          <h1 className='border-r border-gray-700 bg-gray-950 text-center text-5xl text-white font-bold'>
            Robot Controller
          </h1>
          {/* Main Content */}
          <div className="flex flex-col md:flex-row h-screen bg-black text-white p-1">
            {/* Panel 1: Path Management */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <Panel1 />
            </div>
  
            {/* Panel 2: Servo Node Controller */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <Panel2 />
            </div>
          </div>
        </div>
      </>
    );
  };
  


export default App;
