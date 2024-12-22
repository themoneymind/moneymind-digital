interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  return (
    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
      <div className="flex items-center gap-1">
        <span className={password.length >= 8 ? "text-blue-600" : ""}>✓</span>
        8+
      </div>
      <div className="flex items-center gap-1">
        <span className={/[A-Z]/.test(password) ? "text-blue-600" : ""}>✓</span>
        A-Z
      </div>
      <div className="flex items-center gap-1">
        <span className={/[a-z]/.test(password) ? "text-blue-600" : ""}>✓</span>
        a-z
      </div>
      <div className="flex items-center gap-1">
        <span className={/[0-9]/.test(password) ? "text-blue-600" : ""}>✓</span>
        0-9
      </div>
      <div className="flex items-center gap-1">
        <span className={/[!@#$%^&*]/.test(password) ? "text-blue-600" : ""}>✓</span>
        !@#
      </div>
    </div>
  );
};