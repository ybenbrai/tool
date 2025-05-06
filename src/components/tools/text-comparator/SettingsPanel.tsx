import * as React from "react";

export interface ComparatorSettings {
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  ignorePunctuation: boolean;
  addColor: string;
  delColor: string;
  changeColor: string;
}

interface SettingsPanelProps {
  settings: ComparatorSettings;
  onChange: (settings: ComparatorSettings) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = e.target;
    onChange({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  }
  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="ignoreCase"
          checked={settings.ignoreCase}
          onChange={handleChange}
        />
        Ignore case
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="ignoreWhitespace"
          checked={settings.ignoreWhitespace}
          onChange={handleChange}
        />
        Ignore whitespace
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="ignorePunctuation"
          checked={settings.ignorePunctuation}
          onChange={handleChange}
        />
        Ignore punctuation
      </label>
      <label className="flex items-center gap-2 text-sm">
        Add color
        <input
          type="color"
          name="addColor"
          value={settings.addColor}
          onChange={handleChange}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        Delete color
        <input
          type="color"
          name="delColor"
          value={settings.delColor}
          onChange={handleChange}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        Change color
        <input
          type="color"
          name="changeColor"
          value={settings.changeColor}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
