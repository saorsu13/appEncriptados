import { useEffect } from "react";
import { useRestoreSession } from "@/hooks/useRestoreSession";

interface Props {
  onFinish: () => void;
  deviceUUID: string | null;
}

export default function RestoreSessionWrapper({ onFinish, deviceUUID }: Props) {
  useRestoreSession(deviceUUID);

  useEffect(() => {
    onFinish();
  }, []);

  return null;
}
