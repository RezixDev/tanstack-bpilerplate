// app/routes/index.tsx
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

// Używamy createLazyFileRoute dla file-based routingu, co jest zalecane przez TanStack Router
export const Route = createFileRoute("/")({
	component: lazyRouteComponent(() => import("../Dashboard")),
});
