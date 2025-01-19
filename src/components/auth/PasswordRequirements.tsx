interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

export const PasswordRequirements = ({ password, show }: PasswordRequirementsProps) => {
  if (!show) return null;

  const requirements = [
    { label: "8+", test: () => password.length >= 8 },
    { label: "A-Z", test: () => /[A-Z]/.test(password) },
    { label: "a-z", test: () => /[a-z]/.test(password) },
    { label: "0-9", test: () => /[0-9]/.test(password) },
    { label: "!@#", test: () => /[!@#$%^&*]/.test(password) },
  ];

  const getColor = (test: () => boolean) => {
    return test() ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
      {requirements.map((req) => (
        <div key={req.label} className="flex items-center gap-1">
          <span className={getColor(req.test)}>✓</span>
          {req.label}
        </div>
      ))}
    </div>
  );
};