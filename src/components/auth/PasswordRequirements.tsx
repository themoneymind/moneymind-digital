interface PasswordRequirementsProps {
  password: string;
}

export const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-500">Requirements:</p>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <span className={password.length >= 8 ? "text-blue-600" : ""}>✓</span>
          8+ characters
        </div>
        <div className="flex items-center gap-1">
          <span className={/[A-Z]/.test(password) ? "text-blue-600" : ""}>✓</span>
          1 uppercase
        </div>
        <div className="flex items-center gap-1">
          <span className={/[a-z]/.test(password) ? "text-blue-600" : ""}>✓</span>
          1 lowercase
        </div>
        <div className="flex items-center gap-1">
          <span className={/[0-9]/.test(password) ? "text-blue-600" : ""}>✓</span>
          1 number
        </div>
        <div className="flex items-center gap-1">
          <span className={/[!@#$%^&*]/.test(password) ? "text-blue-600" : ""}>✓</span>
          1 special char
        </div>
      </div>
    </div>
  );
};