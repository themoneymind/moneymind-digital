import { AccountInformation } from "./account/AccountInformation";
import { ConnectedDevices } from "./account/ConnectedDevices";
import { LoginHistory } from "./account/LoginHistory";

export const AccountSettings = () => {
  return (
    <div className="space-y-6">
      <AccountInformation />
      <ConnectedDevices />
      <LoginHistory />
    </div>
  );
};