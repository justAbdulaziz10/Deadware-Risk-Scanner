import { CheckCircle2, XCircle, Minus } from 'lucide-react';

const FEATURES = [
  { name: 'Deadware / abandonment detection', us: true, snyk: false, dependabot: false, socketdev: 'partial' },
  { name: 'CVE vulnerability scanning', us: true, snyk: true, dependabot: true, socketdev: true },
  { name: 'Bus factor / maintainer analysis', us: true, snyk: false, dependabot: false, socketdev: 'partial' },
  { name: 'Replacement suggestions', us: true, snyk: false, dependabot: false, socketdev: false },
  { name: '100% client-side (no data sent)', us: true, snyk: false, dependabot: false, socketdev: false },
  { name: 'No account required', us: true, snyk: false, dependabot: false, socketdev: false },
  { name: 'Multi-ecosystem support', us: true, snyk: true, dependabot: true, socketdev: true },
  { name: 'CI badge generation', us: true, snyk: true, dependabot: false, socketdev: false },
  { name: 'PDF / CSV / JSON export', us: true, snyk: true, dependabot: false, socketdev: 'partial' },
  { name: 'Free tier available', us: true, snyk: true, dependabot: true, socketdev: true },
  { name: 'Open-source', us: true, snyk: false, dependabot: true, socketdev: 'partial' },
  { name: 'License risk detection', us: true, snyk: true, dependabot: false, socketdev: true },
] as const;

type CellValue = boolean | 'partial';

function CellIcon({ value }: { value: CellValue }) {
  if (value === true) return <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />;
  if (value === 'partial') return <Minus className="w-4 h-4 text-yellow-400 mx-auto" />;
  return <XCircle className="w-4 h-4 text-surface-600 mx-auto" />;
}

export default function ComparisonSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How We <span className="gradient-text">Compare</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            Most security tools focus only on CVEs. Deadware Risk Scanner goes further, detecting abandoned packages before they become a problem.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 px-4 text-surface-400 font-medium">Feature</th>
                <th className="text-center py-3 px-4 min-w-[100px]">
                  <span className="text-primary-400 font-semibold">Deadware</span>
                </th>
                <th className="text-center py-3 px-4 text-surface-400 font-medium min-w-[100px]">Snyk</th>
                <th className="text-center py-3 px-4 text-surface-400 font-medium min-w-[100px]">Dependabot</th>
                <th className="text-center py-3 px-4 text-surface-400 font-medium min-w-[100px]">Socket.dev</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.name} className="border-b border-surface-800/50 hover:bg-surface-900/30">
                  <td className="py-3 px-4 text-surface-300">{f.name}</td>
                  <td className="py-3 px-4"><CellIcon value={f.us} /></td>
                  <td className="py-3 px-4"><CellIcon value={f.snyk} /></td>
                  <td className="py-3 px-4"><CellIcon value={f.dependabot} /></td>
                  <td className="py-3 px-4"><CellIcon value={f.socketdev} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
