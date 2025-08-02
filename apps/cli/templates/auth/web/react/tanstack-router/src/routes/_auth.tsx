import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: `${location.pathname}${location.search}${location.hash}`,
        },
      });
    }
  },
  component: () => <Outlet />,
});
