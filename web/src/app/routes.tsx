import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./AppShell";

function Placeholder({ title }: { title: string }) {
  return (
    <section className="page-section">
      <h1>{title}</h1>
    </section>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Placeholder title="Today" /> },
      { path: "charts", element: <Placeholder title="Charts" /> },
      { path: "yatras", element: <Placeholder title="Yatras" /> },
      { path: "settings", element: <Placeholder title="Settings" /> }
    ]
  },
  {
    path: "/login",
    element: <Placeholder title="Login" />
  }
]);
