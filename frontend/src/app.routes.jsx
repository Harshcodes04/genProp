import { createBrowserRouter, Outlet } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import NavBar from "./components/NavBar";

const RootLayout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        index: true,
        element: (
          <Protected>
            <Home />
          </Protected>
        ),
      },
      {
        path: "interview/:interviewId",
        element: (
          <Protected>
            <Interview />
          </Protected>
        ),
      },
      {
        path: "interview/plan/:interviewId",
        element: (
          <Protected>
            <Interview />
          </Protected>
        ),
      },
    ],
  },
]);
