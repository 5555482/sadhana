import { useEffect, useRef, useState } from "react";

export function useAppUpdate() {
  const [updateReady, setUpdateReady] = useState(false);
  const activeRegistration = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return undefined;
    }

    navigator.serviceWorker.ready.then((registration) => {
      activeRegistration.current = registration;
      setUpdateReady(Boolean(registration.waiting));
    });

    function onControllerChange() {
      setUpdateReady(false);
    }

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  function applyUpdate() {
    void activeRegistration.current?.waiting?.postMessage({ type: "SKIP_WAITING" });
  }

  return { updateReady, applyUpdate };
}
