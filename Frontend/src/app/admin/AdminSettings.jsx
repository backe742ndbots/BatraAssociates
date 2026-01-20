import AdminLayout from "../../components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/admin/settings/forms")}
          className="border rounded-xl p-6 cursor-pointer hover:border-emerald-600"
        >
          <h3 className="font-semibold">Form Settings</h3>
          <p className="text-sm text-slate-500">
            Configure property & other forms
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
