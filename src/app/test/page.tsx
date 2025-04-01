export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Color Test</h1>

      <div className="bg-pink-shocking p-4 text-white rounded">
        This should have a shocking pink background
      </div>

      <div className="bg-cinnamon p-4 text-white rounded">
        This should have a cinnamon background
      </div>

      <div className="bg-lemon p-4 text-slate-800 rounded">
        This should have a lemon background
      </div>

      <div className="bg-slate-800 p-4 text-white rounded">
        This should have a dark slate background
      </div>
    </div>
  );
}
