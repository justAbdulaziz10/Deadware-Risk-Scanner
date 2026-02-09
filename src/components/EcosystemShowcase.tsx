export default function EcosystemShowcase() {
  const ecosystems = [
    {
      name: 'npm',
      file: 'package.json',
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
      desc: 'Node.js packages',
    },
    {
      name: 'PyPI',
      file: 'requirements.txt',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      desc: 'Python packages',
    },
    {
      name: 'RubyGems',
      file: 'Gemfile',
      color: 'text-red-500',
      bg: 'bg-red-600/10 border-red-600/20',
      desc: 'Ruby gems',
    },
    {
      name: 'Go Modules',
      file: 'go.mod',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      desc: 'Go packages',
    },
    {
      name: 'Cargo',
      file: 'Cargo.toml',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
      desc: 'Rust crates',
    },
  ];

  return (
    <section className="py-20 px-4 border-y border-surface-800 bg-surface-900/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Scan Dependencies Across{' '}
            <span className="gradient-text">5 Ecosystems</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            One tool for all your dependency files. Just paste or upload, and we auto-detect the ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {ecosystems.map((eco) => (
            <div
              key={eco.name}
              className={`rounded-xl border p-5 text-center hover:scale-105 transition-transform ${eco.bg}`}
            >
              <div className={`text-lg font-bold ${eco.color} mb-1`}>{eco.name}</div>
              <code className="text-xs text-surface-400 bg-surface-800/50 px-2 py-0.5 rounded">
                {eco.file}
              </code>
              <p className="text-xs text-surface-500 mt-2">{eco.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
