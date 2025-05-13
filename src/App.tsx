
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import MobileLockscreen from "@/pages/MobileLockscreen";
import ApiKeys from "@/pages/ApiKeys";
import { Toaster } from "@/components/ui/sonner";
import SavedNews from "@/pages/SavedNews";
import MyFeed from "@/pages/MyFeed";
import Notifications from "@/pages/Notifications";
import Videos from "@/pages/Videos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Index />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/api-keys" element={<ApiKeys />} />
          <Route path="auth" element={<Auth />} />
          <Route path="saved" element={<SavedNews />} />
          <Route path="my-feed" element={<MyFeed />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="videos" element={<Videos />} />
        </Route>
        <Route path="/mobile-lockscreen" element={<MobileLockscreen />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
