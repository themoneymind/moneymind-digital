import React from "react";

export const PaymentSourceHeader = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Add Payment Source</h1>
      <p className="text-sm text-muted-foreground">
        Add all your bank accounts, UPI, and credit cards (these are reference sources to manage your expenses seamlessly, not linked to actual bank accounts)
      </p>
    </div>
  );
};