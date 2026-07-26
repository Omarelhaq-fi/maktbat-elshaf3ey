import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/support/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
