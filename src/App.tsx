
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import MobileLockscreen from "@/pages/MobileLockscreen";
import ApiKeys from "@/pages/ApiKeys";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/api-keys" element={<ApiKeys />} />
          <Route path="auth" element={<Auth />} />
        </Route>
        <Route path="/mobile-lockscreen" element={<MobileLockscreen />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
