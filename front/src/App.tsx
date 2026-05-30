import { BrowserRouter, Route, Routes } from "react-router";
import { DataTable } from "@/components/dashboard/data-table"
import AdminPage from "./pages/AdminPage"
import { Toaster } from "sonner";
import data from "@/components/dashboard/data.json"
import ChartInfo from "./components/dashboard/chartinfo";
function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/admin" element={<AdminPage />}> 
            <Route index element={<ChartInfo />} />
            <Route path="table" element={<DataTable data={data} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
