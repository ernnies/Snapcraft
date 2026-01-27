export default function Connect() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-400 mb-4 text-center">
        Connect Wallet
      </h1>
      <p className="text-lg mb-4">Please connect your wallet to proceed.</p>
      <button className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700">
        Connect Wallet
      </button>
    </div>
  );
}