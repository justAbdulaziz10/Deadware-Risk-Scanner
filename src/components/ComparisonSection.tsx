'use client';

import { CheckCircle2, XCircle, Minus } from 'lucide-react';
import { useT } from './I18nProvider';

type CellValue = boolean | 'partial';

function CellIcon({ value }: { value: CellValue }) {
  if (value === true) return <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />;
  if (value === 'partial') return <Minus className="w-4 h-4 text-yellow-400 mx-auto" />;
  return <XCircle className="w-4 h-4 text-surface-600 mx-auto" />;
}

export default function ComparisonSection() {
  const t = useT();

  const FEATURES = [
    { name: t.compare_f1, us: true, snyk: false, dependabot: false, socketdev: 'partial' as const },
    { name: t.compare_f2, us: true, snyk: true, dependabot: true, socketdev: true },
    { name: t.compare_f3, us: true, snyk: false, dependabot: false, socketdev: 'partial' as const },
    { name: t.compare_f4, us: true, snyk: false, dependabot: false, socketdev: false },
    { name: t.compare_f5, us: true, snyk: false, dependabot: false, socketdev: false },
    { name: t.compare_f6, us: true, snyk: false, dependabot: false, socketdev: false },
    { name: t.compare_f7, us: true, snyk: true, dependabot: true, socketdev: true },
    { name: t.compare_f8, us: true, snyk: true, dependabot: false, socketdev: false },
    { name: t.compare_f9, us: true, snyk: true, dependabot: false, socketdev: 'partial' as const },
    { name: t.compare_f10, us: true, snyk: true, dependabot: true, socketdev: true },
    { name: t.compare_f11, us: true, snyk: false, dependabot: true, socketdev: 'partial' as const },
    { name: t.compare_f12, us: true, snyk: true, dependabot: false, socketdev: true },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t.compare_title_1} <span className="gradient-text">{t.compare_title_2}</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-2xl mx-auto">
            {t.compare_subtitle}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 px-4 text-surface-400 font-medium">{t.compare_feature}</th>
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
