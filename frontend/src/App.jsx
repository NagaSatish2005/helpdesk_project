import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/common/Layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}
