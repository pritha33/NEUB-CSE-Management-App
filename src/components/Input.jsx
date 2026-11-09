import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  textarea = false,
  showPasswordToggle = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    showPasswordToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <label className="field">
      <span>{label}</span>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || label}
          required={required}
        />
      ) : (
        <div className="password-input-wrap">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type={inputType}
            placeholder={placeholder || label}
            required={required}
          />

          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="password-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      )}
    </label>
  );
}