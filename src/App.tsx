import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative bg-static">
      <div className="scanline" />
      
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 z-10 screen-tear">
        
        {/* Left/Top Side: Game */}
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>

        {/* Right/Bottom Side: Music Player & Info */}
        <div className="flex flex-col items-center lg:items-start gap-8 w-full lg:w-auto">
          <div className="text-center lg:text-left border-l-4 border-magenta pl-4">
            <h1 className="text-4xl md:text-5xl font-pixel mb-4 glitch" data-text="SYS.OP.SNAKE">
              SYS.OP.SNAKE
            </h1>
            <p className="text-cyan font-terminal text-xl tracking-widest">
              DIRECTIVE: CONSUME_DATA
            </p>
            <p className="text-magenta font-terminal text-lg tracking-widest animate-pulse mt-2">
              STATUS: ONLINE // AWAITING_INPUT
            </p>
          </div>

          <MusicPlayer />
          
          <div className="bg-black border-4 border-cyan p-4 w-full max-w-md relative">
            <div className="absolute top-0 left-0 bg-cyan text-black px-2 py-1 font-pixel text-xs -translate-y-full border-t-4 border-l-4 border-r-4 border-cyan">
              MANUAL_OVERRIDE
            </div>
            <ul className="text-white text-lg space-y-2 font-terminal mt-2">
              <li className="flex justify-between border-b border-magenta/30 pb-1">
                <span className="text-cyan">INPUT.VECTOR</span>
                <span>[W,A,S,D] OR [ARROWS]</span>
              </li>
              <li className="flex justify-between border-b border-magenta/30 pb-1">
                <span className="text-cyan">SYS.HALT</span>
                <span>[SPACE]</span>
              </li>
              <li className="flex justify-between pb-1">
                <span className="text-cyan">SYS.REBOOT</span>
                <span>[ENTER]</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
