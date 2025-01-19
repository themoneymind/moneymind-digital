import { Link } from "react-router-dom";

export const SignUpFooter = () => {
  return (
    <>
      <p className="text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <Link to="/signin" className="text-[#7F3DFF] hover:text-[#6366F1] transition-colors">
          Sign In
        </Link>
      </p>

      <p className="text-xs text-gray-500 text-center">
        By clicking Sign Up, you agree to our{" "}
        <Link to="/terms" className="text-[#7F3DFF] hover:text-[#6366F1] transition-colors">
          Terms & Conditions
        </Link>
      </p>
    </>
  );
};