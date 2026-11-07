import { useState, type ClipboardEvent, type KeyboardEvent } from "react";
import {
  formatCurrencyInput,
  formatMoneyDigits,
  moneyDigitsToNumber,
  numberToMoneyDigits,
  sanitizeMoneyDigits,
} from "../engine/format";

interface MoneyFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
  readOnly?: boolean;
  liveDigits?: boolean;
}

export function MoneyField({
  label,
  value,
  onChange,
  hint,
  readOnly,
  liveDigits,
}: MoneyFieldProps) {
  const digitsMode = liveDigits ?? !readOnly;
  const [digits, setDigits] = useState<string | null>(null);
  const editing = digits !== null && !readOnly && digitsMode;

  const displayValue = readOnly
    ? formatCurrencyInput(value)
    : editing
      ? formatMoneyDigits(digits)
      : value === 0
        ? ""
        : formatCurrencyInput(value);

  const handleFocus = () => {
    if (readOnly) return;
    if (digitsMode) setDigits(numberToMoneyDigits(value));
  };

  const handleBlur = () => {
    if (digitsMode) setDigits(null);
  };

  const handleChange = (raw: string) => {
    if (readOnly || !digitsMode) return;
    const next = sanitizeMoneyDigits(raw);
    setDigits(next);
    onChange(moneyDigitsToNumber(next));
  };

  const blockNonNumericKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!digitsMode || readOnly) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (allowed.includes(e.key)) return;
    if (/^\d$/.test(e.key)) return;
    e.preventDefault();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (!digitsMode || readOnly) return;
    e.preventDefault();
    const pasted = sanitizeMoneyDigits(e.clipboardData.getData("text"));
    setDigits(pasted);
    onChange(moneyDigitsToNumber(pasted));
  };

  return (
    <label className={`field ${readOnly ? "field-readonly" : ""}`}>
      <span className="field-label">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        readOnly={readOnly}
        value={displayValue}
        placeholder={digitsMode ? "0,00" : undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={blockNonNumericKey}
        onPaste={handlePaste}
        onChange={(e) => handleChange(e.target.value)}
        aria-label={label}
      />
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

interface PercentFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}

export function PercentField({ label, value, onChange, hint }: PercentFieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="percent-wrap">
        <input
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={Math.round(value * 10000) / 100}
          onChange={(e) => onChange(Math.min(1, Math.max(0, Number(e.target.value) / 100)))}
          aria-label={label}
        />
        <span>%</span>
      </div>
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

interface IntFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

export function IntField({ label, value, onChange }: IntFieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
        aria-label={label}
      />
    </label>
  );
}
