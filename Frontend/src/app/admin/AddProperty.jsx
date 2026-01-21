

//this is new one 
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";
import api from "../../services/api";

/* =========================
   CONSTANTS (UNCHANGED)
========================= */
const CATEGORY_MAP = {
  residential: ["builder_floor", "flat", "kothi"],
  commercial: ["shop", "office", "showroom"],
  land: ["plot"],
  industrial: ["warehouse"],
  rent: ["builder_floor", "flat", "shop"],
};

const AMENITIES = [
  "swimmingPool",
  "garden",
  "garage",
  "lift",
  "powerBackup",
  "security",
];

const FieldWrapper = ({ field, children }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {field.label}
      {field.required && (
        <span className="text-red-500 ml-1">*</span>
      )}
    </label>
    {children}
  </div>
);

export default function AdminAddProperty() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);

  /* =========================
     FORM STATE (UNCHANGED)
  ========================= */
  const [form, setForm] = useState({
    amenities: {},
    dealerType: "dealer",
    availabilityStatus: "available",
    approvalStatus: "approved",
  });

  const [files, setFiles] = useState({
    cover: null,
    gallery: [],
    map: null,
    floorPlan: null,
    documents: [],
  });

  /* =========================
     FETCH FORM CONFIG
  ========================= */
  useEffect(() => {
    api.get("/admin/form-config/property").then(cfg => {
      const fixed = {
        ...cfg,
        pages: cfg.pages.map(page => ({
          ...page,
          fields: page.fields.map(field => ({
            ...field,
            id: field.id ?? crypto.randomUUID()
          }))
        }))
      };
      setConfig(fixed);
    });
  }, []); // ✅ EMPTY DEPENDENCY — RUNS ONCE




  if (!config || !config.pages) {
    return <AdminLayout>Loading property form…</AdminLayout>;
  }

  const isSystemStep = step === config.pages.length + 1;
  const currentPage = !isSystemStep ? config.pages[step - 1] : null;

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAmenity = (name) => {
    setForm(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [name]: !prev.amenities?.[name],
      },
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;

    setFiles(prev => ({
      ...prev,
      [name]:
        name === "gallery" || name === "documents"
          ? Array.from(selectedFiles)
          : selectedFiles[0] || null,
    }));
  };

  const normalizeFiles = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  };

  /* =========================
     FIELD RENDERER (CORE)
  ========================= */
  // const renderField = (field) => {
  //   if (field.visible === false) return null;

  //   let options = field.options || [];

  //   // category → propertyType dependency
  //   if (field.key === "propertyType") {
  //     options = CATEGORY_MAP[form.category] || [];
  //   }

  //   switch (field.type) {
  //     case "text":
  //     case "number":
  //       return (
  //         <input
  //           type={field.type}
  //           name={field.key}
  //           value={form[field.key] || ""}
  //           onChange={handleChange}
  //           placeholder={field.label}
  //           className="input"
  //         />
  //       );

  //     case "textarea":
  //       return (
  //         <textarea
  //           name={field.key}
  //           value={form[field.key] || ""}
  //           onChange={handleChange}
  //           placeholder={field.label}
  //           className="input md:col-span-2"
  //         />
  //       );
  //     case "select": {
  //       let selectOptions = field.options || [];

  //       // SYSTEM OPTIONS (same as old form)
  //       if (field.key === "category") {
  //         selectOptions = Object.keys(CATEGORY_MAP);
  //       }

  //       if (field.key === "propertyType") {
  //         selectOptions = CATEGORY_MAP[form.category] || [];
  //       }

  //       if (field.key === "bhk") {
  //         selectOptions = ["1", "2", "3", "4"];
  //       }

  //       if (field.key === "layout") {
  //         selectOptions = ["1/1", "2+1/1", "3+1/1", "3+1/2", "4+1/2", "4+1/3"];
  //       }

  //       if (field.key === "facing") {
  //         selectOptions = ["north", "south", "east", "west"];
  //       }

  //       if (field.key === "furnishing") {
  //         selectOptions = ["furnished", "semi-furnished", "unfurnished"];
  //       }

  //       if (field.key === "availabilityStatus") {
  //         selectOptions = ["available", "hold", "sold", "rented"];
  //       }

  //       if (field.key === "legalStatus") {
  //         selectOptions = ["map_pass", "old_map", "with_roof", "mcd", "janta_faced"];
  //       }

  //       if (field.key === "approvalStatus") {
  //         selectOptions = ["approved", "pending"];
  //       }

  //       return (
  //         <select
  //           name={field.key}
  //           value={form[field.key] || ""}
  //           onChange={handleChange}
  //           className="input"
  //         >
  //           <option value="">{field.label}</option>
  //           {selectOptions.map(opt => (
  //             <option key={opt} value={opt}>
  //               {opt.replace("_", " ")}
  //             </option>
  //           ))}
  //         </select>
  //       );
  //     }

  //     case "amenities":
  //       return (
  //         <div className="grid md:grid-cols-3 gap-3">
  //           {AMENITIES.map(a => (
  //             <label key={a} className="flex gap-2 items-center">
  //               <input
  //                 type="checkbox"
  //                 checked={form.amenities?.[a] || false}
  //                 onChange={() => handleAmenity(a)}
  //               />
  //               {a.replace(/([A-Z])/g, " $1")}
  //             </label>
  //           ))}
  //         </div>
  //       );

  //     default:
  //       return null;
  //   }
  // };




  const renderField = (field) => {
    if (field.visible === false) return null;

    let options = field.options || [];

    if (field.key === "propertyType") {
      options = CATEGORY_MAP[form.category] || [];
    }

    switch (field.type) {
      case "text":
      case "number":
        return (
          <FieldWrapper field={field}>
            <input
              type={field.type}
              name={field.key}
              value={form[field.key] ?? ""}
              onChange={handleChange}
              className="input"
              required={field.required}
            />
          </FieldWrapper>
        );

      case "textarea":
        return (
          <FieldWrapper field={field}>
            <textarea
              name={field.key}
              value={form[field.key] ?? ""}
              onChange={handleChange}
              className="input min-h-[100px]"
              required={field.required}
              autoComplete="off"
            />
          </FieldWrapper>
        );


      case "select": {
        let selectOptions = options;

        if (field.key === "category") {
          selectOptions = Object.keys(CATEGORY_MAP);
        }
        if (field.key === "bhk") {
          selectOptions = ["1", "2", "3", "4"];
        }
        if (field.key === "layout") {
          selectOptions = ["1/1", "2+1/1", "3+1/1", "3+1/2", "4+1/2", "4+1/3"];
        }
        if (field.key === "facing") {
          selectOptions = ["north", "south", "east", "west"];
        }
        if (field.key === "furnishing") {
          selectOptions = ["furnished", "semi-furnished", "unfurnished"];
        }

        return (
          <FieldWrapper field={field}>
            <select
              name={field.key}
              value={form[field.key] || ""}
              onChange={handleChange}
              className="input"
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {selectOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt.replace("_", " ")}
                </option>
              ))}
            </select>
          </FieldWrapper>
        );
      }

      case "amenities":
        return (
          <FieldWrapper field={field}>
            <div className="grid md:grid-cols-3 gap-3">
              {AMENITIES.map(a => (
                <label key={a} className="flex gap-2 items-center text-sm">
                  <input
                    type="checkbox"
                    checked={form.amenities?.[a] || false}
                    onChange={() => handleAmenity(a)}
                  />
                  {a.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>
          </FieldWrapper>
        );

      default:
        return null;
    }
  };




  const handleSubmit = async () => {
    setLoading(true);

    try {
      const data = new FormData();

      /**
       * Fields that EXIST in Property schema
       * (keep this list explicit & controlled)
       */
      const SYSTEM_FIELDS = [
        "propertyTitle",
        "category",
        "propertyType",
        "description",

        "bhk",
        "layout",
        "bedrooms",
        "bathrooms",
        "balconies",
        "floorNumber",
        "totalFloors",

        "areaSqFt",
        "priceLakhs",
        "netPrice",
        "demand",

        "facing",
        "furnishing",

        "city",
        "sector",
        "block",
        "pocket",
        "road",
        "locality",
        "address",
        "pincode",

        "availabilityStatus",
        "legalStatus",
        "approvalStatus",

        "propertySource",
        "comments",

        "dealerType",
        "dealerName",
        "dealerMobile",
        "dealerSource",
        "referredBy",
      ];

      const customFields = {};

      // -------------------------
      // TEXT + NON-FILE FIELDS
      // -------------------------
      Object.entries(form).forEach(([key, value]) => {
        if (key === "amenities") {
          Object.entries(value).forEach(([a, v]) => {
            if (v) data.append(`amenities[${a}]`, true);
          });
          return;
        }

        if (SYSTEM_FIELDS.includes(key)) {
          data.append(key, value);
        } else {
          // 🔥 DYNAMIC FIELD
          customFields[key] = value;
        }
      });

      // -------------------------
      // SEND DYNAMIC FIELDS
      // -------------------------
      data.append("customFields", JSON.stringify(customFields));

      // -------------------------
      // FILE FIELDS
      // -------------------------
      if (files.cover) data.append("cover", files.cover);

      normalizeFiles(files.gallery).forEach(file =>
        data.append("gallery", file)
      );

      normalizeFiles(files.documents).forEach(file =>
        data.append("documents", file)
      );

      if (files.map) data.append("map", files.map);
      if (files.floorPlan) data.append("floorPlan", files.floorPlan);

      // -------------------------
      // SUBMIT
      // -------------------------
      await api.post("/admin/add-property", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Property added successfully");
      window.location.href = "/admin/properties";
    } catch (err) {
      console.error("ADD PROPERTY ERROR:", err);
      alert("Failed to add property");
    } finally {
      setLoading(false);
    }
  };







  const FileField = ({
    label,
    name,
    onChange,
    multiple,
    required,
    description,
    className = "",
  }) => (
    <div className={`space-y-1 ${className}`}>
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        type="file"
        name={name}
        multiple={multiple}
        onChange={onChange}
        className="input"
      />

      {description && (
        <p className="text-xs text-slate-500">{description}</p>
      )}
    </div>
  );



  const totalSteps = config.pages.length + 1; // +1 = system step
  const isLastStep = step === totalSteps;



  /* =========================
     UI
  ========================= */
  // console.log("this is ", currentPage.fields.map(f => f.id));

  return (
    <AdminLayout>
      <SectionHeader
        title="Add New Property"
        subtitle="Create and publish a new property listing"
      />

      {/* STEP INDICATOR (RESTORED) */}
      <div className="flex items-center gap-4 mb-8 max-w-3xl">
        {[...config.pages, "SYSTEM"].map((_, i) => {
          const stepNumber = i + 1;
          return (
            <div key={stepNumber} className="flex items-center gap-4 flex-1">
              <div
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-semibold
            ${step === stepNumber
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-slate-300 dark:border-border text-slate-400"
                  }`}
              >
                {stepNumber}
              </div>

              {i < config.pages.length && (
                <div className="flex-1 h-[2px] bg-slate-200 dark:bg-border" />
              )}
            </div>
          );
        })}
      </div>


      <div className="bg-white dark:bg-black border dark:border-border rounded-xl p-6 max-w-6xl">

        {/* ================= STEP 1–3 (DYNAMIC BUT SAME UX) ================= */}
        {
          step <= config.pages.length && (
            <>
              <h2 className="text-lg font-semibold mb-4">
                {currentPage.title}
              </h2>

              {/* GRID MATCHES ORIGINAL FORM */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">


                {currentPage.fields.map(field => (

                  <div
                    key={field.id}
                    className={
                      field.type === "textarea"
                        ? "md:col-span-2 lg:col-span-3"
                        : ""
                    }
                  >
                    {renderField(field)}
                  </div>
                ))}

              </div>
            </>
          )}
        {/* ================= STEP 4 (UNCHANGED UX) ================= */}
        {isSystemStep && (
          <>
            <h2 className="text-lg font-semibold mb-6">
              Media, Status & Owner Details
            </h2>

            {/* ================= MEDIA ================= */}
            <div className="mb-10">
              <h3 className="text-sm font-semibold mb-4 text-slate-600 uppercase">
                Media
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <FileField
                  label="Cover Image"
                  required
                  name="cover"
                  onChange={handleFileChange}
                  description="Main image shown on property cards & listings"
                />

                <FileField
                  label="Property Map / Location Image"
                  name="map"
                  onChange={handleFileChange}
                />

                <FileField
                  label="Gallery Images"
                  name="gallery"
                  multiple
                  onChange={handleFileChange}
                  className="md:col-span-2"
                />

                <FileField
                  label="Floor Plan (Optional)"
                  name="floorPlan"
                  onChange={handleFileChange}
                  className="md:col-span-2"
                />
              </div>
            </div>

            {/* ================= STATUS ================= */}
            <div className="mb-10">
              <h3 className="text-sm font-semibold mb-4 text-slate-600 uppercase">
                Status
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <select
                  name="availabilityStatus"
                  value={form.availabilityStatus}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="available">Available</option>
                  <option value="hold">Hold</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>

                <select
                  name="legalStatus"
                  value={form.legalStatus || ""}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Legal Status</option>
                  <option value="map_pass">Map Pass</option>
                  <option value="old_map">Old Map</option>
                  <option value="with_roof">With Roof</option>
                  <option value="mcd">MCD</option>
                  <option value="janta_faced">Janta Faced</option>
                </select>

                <select
                  name="approvalStatus"
                  value={form.approvalStatus}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* ================= OWNER / DEALER ================= */}
            <div className="mb-10">
              <h3 className="text-sm font-semibold mb-4 text-slate-600 uppercase">
                Owner / Dealer
              </h3>

              <div className="flex gap-6 mb-6">
                {["dealer", "owner"].map(v => (
                  <label key={v} className="flex gap-2 items-center text-sm">
                    <input
                      type="radio"
                      name="dealerType"
                      value={v}
                      checked={form.dealerType === v}
                      onChange={handleChange}
                    />
                    {v}
                  </label>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input name="dealerName" placeholder="Name" className="input" onChange={handleChange} />
                <input name="dealerMobile" placeholder="Mobile" className="input" onChange={handleChange} />
                <input name="dealerSource" placeholder="Source" className="input" onChange={handleChange} />
                <input name="referredBy" placeholder="Referred By" className="input" onChange={handleChange} />
              </div>

              <input
                type="file"
                name="documents"
                multiple
                onChange={handleFileChange}
                className="input"
              />
            </div>

            {/* ================= COMMENTS ================= */}
            <textarea
              name="comments"
              placeholder="Comments / remarks"
              className="input min-h-[120px]"
              onChange={handleChange}
            />
          </>
        )}



        {/* ================= NAV (RESTORED) ================= */}
        <div className="flex justify-between mt-8">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>

          {!isLastStep ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-black dark:bg-neutral-400/60 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 text-white rounded"
            >
              {loading ? "Saving..." : "Save Property"}
            </button>
          )}
        </div>

      </div>
    </AdminLayout>
  );

}
