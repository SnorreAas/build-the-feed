import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import routes, { Paths } from "./routes/routes";
import { Navbar } from "./components/Navbar";
import { UserProvider } from "./components/auth/UserProvider";
import { AuthChecker } from "./components/auth/AuthChecker";

function App() {
  // TODO: check if 404 is necessary here
  return (
    <UserProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                route.protected ? (
                  <AuthChecker>
                    <route.component />
                  </AuthChecker>
                ) : route.path === Paths.FOUR_O_FOUR ? (
                  <Navigate to={Paths.HOME} replace />
                ) : (
                  <route.component />
                )
              }
            />
          ))}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
