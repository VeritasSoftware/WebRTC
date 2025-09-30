import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { WebRTCService } from 'ts-webrtc-react-client';
import VideoChat from './components/VideoChat';

const App: React.FC<{videoChatService: WebRTCService}> = ({videoChatService: videoChatService}) => {
  const [selectedOption, setSelectedOption] = useState('-1'); // Initial state
  
  const handleChange = (e: any) => {
    console.log("selectedOption: ", e.target.value);
    setSelectedOption(e.target.value);
  };

  return (
    <div className="App">
      
      <div>
        {/* Video chat component will go here */}
        <select name="userType" id="userType" value={selectedOption}  onChange={handleChange} defaultValue={-1}>
            <option value="-1">Please select</option>
            <option value="0">Local</option>
            <option value="1">Remote</option>
        </select>
       
        {selectedOption !== '-1' && 
          <VideoChat videoChatService={videoChatService} userType={parseInt(selectedOption)} />
        }
      </div>
    </div>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
