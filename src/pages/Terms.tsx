import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const Terms = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <Link to="/" className="inline-block mb-8">
        <ArrowLeft className="h-6 w-6" />
      </Link>

      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Terms and Conditions</h1>
        
        <div className="prose prose-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to our financial management application. By using our service,
            you agree to these terms. Please read them carefully.
          </p>

          <h2>2. Use of Service</h2>
          <p>
            Our service is designed to help you manage your personal finances.
            You agree to use it only for its intended purpose and in compliance
            with all applicable laws.
          </p>

          <h2>3. Privacy</h2>
          <p>
            We take your privacy seriously. All personal and financial information
            is encrypted and stored securely. We never share your data with third
            parties without your explicit consent.
          </p>

          <h2>4. Account Security</h2>
          <p>
            You are responsible for maintaining the security of your account
            credentials. We recommend using a strong password and enabling
            two-factor authentication when available.
          </p>

          <h2>5. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued
            use of the service after changes constitutes acceptance of the new
            terms.
          </p>
        </div>

        <div className="pt-6">
          <Link to="/signin" className="text-primary hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};