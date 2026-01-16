import { ChatWindow } from './components/Chat/ChatWindow';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col relative">
        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none rounded-2xl" />
        <header className="p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md z-10 flex items-center justify-between">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                AI Shopping Assistant
            </h1>
            <div className="text-xs text-slate-400">Powered by Gemini & MCP</div>
        </header>
        <main className="flex-1 overflow-hidden relative z-10">
            <ChatWindow />
        </main>
      </div>
    </div>
  );
}

export default App;
