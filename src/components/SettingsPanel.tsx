'use client';

import { useState, useEffect } from 'react';
import { UserSettings } from '@/types';
import { getSettings, saveSettings } from '@/lib/storage';
import { Key, Save, Eye, EyeOff } from 'lucide-react';
import { useT } from './I18nProvider';

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const t = useT();
  const [settings, setSettings] = useState<UserSettings>({});
  const [showGithub, setShowGithub] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function handleSave() {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-surface-900/90 border border-surface-800 rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Key className="w-5 h-5 text-primary-500" />
          {t.settings_title}
        </h3>
        <button
          onClick={onClose}
          className="text-surface-500 hover:text-surface-300 text-sm"
        >
          {t.settings_close}
        </button>
      </div>

      <p className="text-sm text-surface-400 mb-6">
        {t.settings_desc}
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            {t.settings_github_label}
          </label>
          <p className="text-xs text-surface-500 mb-2">
            {t.settings_github_help}{' '}
            {t.settings_github_needs} <code className="bg-surface-800 px-1 rounded">public_repo</code> scope.
          </p>
          <div className="relative">
            <input
              type={showGithub ? 'text' : 'password'}
              value={settings.githubToken || ''}
              onChange={(e) => setSettings({ ...settings, githubToken: e.target.value })}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full bg-surface-800 border border-surface-700 rounded-lg px-4 py-2.5 text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-primary-500 pr-10"
            />
            <button
              onClick={() => setShowGithub(!showGithub)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
              type="button"
            >
              {showGithub ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {t.settings_save}
        </button>
        {saved && (
          <span className="text-sm text-emerald-400 animate-fade-in">{t.settings_saved}</span>
        )}
      </div>
    </div>
  );
}
