import { lazy } from "react";
import Loadable from "@/components/utils/Loadable";

// PAGES
export const IndexPage = Loadable(lazy(() => import("@/pages/IndexPage")));
export const LibraryPage = Loadable(lazy(() => import("@/pages/LibraryPage")));

// LAYOUTS
export const IndexLayout = Loadable(lazy(() => import("@/layouts/IndexLayout")));