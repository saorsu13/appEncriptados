import { useEffect } from "react";
import { useRestoreSession } from "@/hooks/useRestoreSession";

interface Props {
  onFinish: () => void;
}

export default function RestoreSessionWrapper({ onFinish }: Props) {
  useRestoreSession();

  useEffect(() => {
    onFinish();
  }, []);

  return null;
}
