export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  void navigator.serviceWorker.register("/service_worker.js", {
    updateViaCache: "none"
  });
}
