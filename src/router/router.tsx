
import { createBrowserRouter } from "react-router-dom";
import { IndexLayout, IndexPage, LibraryPage } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexLayout />,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
      {
        path: "/library/:name",
        element: <LibraryPage />,
      },
    ],
  },
]);

export default router;
