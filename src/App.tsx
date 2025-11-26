import { ReactLenis } from "lenis/react";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";

const App = () => {
  return (
    <ReactLenis root>
      <RouterProvider router={router} />
    </ReactLenis>
  );
};

export default App;
