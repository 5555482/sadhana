import { RouterProvider } from "react-router-dom";

import { AppProviders } from "./AppProviders";
import { router } from "./routes";

export function AppRouter() {
  return (
    <AppProviders>
      <RouterProvider router={router} fallbackElement={<main aria-busy="true">Loading Sadhana Pro</main>} />
    </AppProviders>
  );
}
