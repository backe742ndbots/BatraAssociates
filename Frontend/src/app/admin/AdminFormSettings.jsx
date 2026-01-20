import AdminLayout from "../../components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";

export default function AdminFormSettings() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-6">Form Settings</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/admin/settings/forms/property")}
          className="border rounded-xl p-6 cursor-pointer hover:border-emerald-600"
        >
          <h3 className="font-semibold">Property Form</h3>
          <p className="text-sm text-slate-500">
            Manage Add Property form fields & pages
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
