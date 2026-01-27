export default function Features() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold text-blue-400 mb-8 text-center">
        Features
      </h1>
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">AI-powered</h2>
          <p>Harness advanced AI for smart trading decisions.</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">User-friendly</h2>
          <p>Intuitive interface for all experience levels.</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">No-code DeFi automation app</h2>
          <p>Build complex strategies without coding expertise.</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">AI-powered</h2>
          <p>Optimized analytics for real-time market insights.</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold">User-friendly</h2>
          <p>Seamless experience with drag-and-drop simplicity.</p>
        </div>
      </div>
    </div>
  );
}