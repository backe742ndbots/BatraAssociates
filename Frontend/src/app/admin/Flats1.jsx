// import React, { useEffect, useState } from "react";
// import { HotTable } from "@handsontable/react";
// import Handsontable from "handsontable";
// import { registerAllModules } from "handsontable/registry";
// import "handsontable/dist/handsontable.full.css";
// import * as XLSX from "xlsx";
// import AdminLayout from "../../components/layout/AdminLayout";
// import SectionHeader from "./components/SectionHeader";

// registerAllModules(); // 🔥 REQUIRED FOR FILTERS

// export default function ExcelViewer() {
//   const [workbook, setWorkbook] = useState(null);
//   const [sheetNames, setSheetNames] = useState([]);
//   const [activeSheet, setActiveSheet] = useState("");
//   const [data, setData] = useState([]);
//   const [columns, setColumns] = useState([]);

//   useEffect(() => {
//     loadExcel();
//   }, []);

//   const loadExcel = async () => {
//     const response = await fetch("/files/COMBINE (2).xlsx");
//     const arrayBuffer = await response.arrayBuffer();

//     const wb = XLSX.read(arrayBuffer, { type: "array" });

//     setWorkbook(wb);
//     setSheetNames(wb.SheetNames);

//     if (wb.SheetNames.length > 0) {
//       loadSheet(wb, wb.SheetNames[0]);
//     }
//   };

//   const loadSheet = (wb, sheetName) => {
//     const worksheet = wb.Sheets[sheetName];

//     const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//       header: 1,
//       defval: "",
//     });

//     const cleaned = jsonData.filter(row =>
//       row.some(cell => cell !== "")
//     );

//     if (cleaned.length === 0) return;

//     const headerRow = cleaned[0];

//     const generatedColumns = headerRow.map((col, index) => ({
//       data: index,
//       title: col || `Column ${index + 1}`,
//     }));

//     setColumns(generatedColumns);
//     setData(cleaned.slice(1));
//     setActiveSheet(sheetName);
//   };

//   return (
//     <AdminLayout>
//       <SectionHeader
//         title="Excel Viewer"
//         subtitle="Manage Excel Data"
//       />

//       <div className="px-4 md:px-8 pb-8">

//         {/* Sheet Tabs */}
//         <div className="flex gap-2 flex-wrap mb-4 overflow-x-auto">
//           {sheetNames.map((sheet) => (
//             <button
//               key={sheet}
//               onClick={() => loadSheet(workbook, sheet)}
//               className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
//                 activeSheet === sheet
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 dark:bg-neutral-800 dark:text-white"
//               }`}
//             >
//               {sheet}
//             </button>
//           ))}
//         </div>

//         {/* Excel Table */}
//         <div className="w-full rounded-xl border dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2">

//           <HotTable
//             data={data}
//             columns={columns}
//             colHeaders={columns.map(col => col.title)}
//             rowHeaders={true}
//             filters={true}          // 🔥 FILTER ENABLED
//             dropdownMenu={true}     // 🔥 REQUIRED
//             contextMenu={true}
//             stretchH="all"
//             width="100%"
//             height="600"
//             manualColumnResize={true}
//             manualRowResize={true}
//             licenseKey="non-commercial-and-evaluation"
//           />

//         </div>
//       </div>
//     </AdminLayout>
//   );
// }


import React, { useEffect, useState } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";
import AdminLayout from "../../components/layout/AdminLayout";
import SectionHeader from "./components/SectionHeader";
import api from "../../services/api";
registerAllModules();

export default function ExcelViewer() {
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSheets();
  }, []);

  // const fetchSheets = async () => {
  //   try {
  //     const res = await fetch(
  //       "https://batraassociates.onrender.com/api/excel/sheets"
  //     );
  //     const result = await res.json();

  //     if (result.sheets && result.sheets.length > 0) {
  //       setSheetNames(result.sheets);
  //       setActiveSheet(result.sheets[0]);
  //       loadSheet(result.sheets[0]);
  //     }
  //   } catch (err) {
  //     console.error("Sheet fetch error:", err);
  //   }
  // };


  const fetchSheets = async () => {
  try {
    const res = await api.get("/excel/sheets");

    const result = res;   // ✅ important

    if (result && result.sheets && result.sheets.length > 0) {
      setSheetNames(result.sheets);
      setActiveSheet(result.sheets[0]);
      loadSheet(result.sheets[0]);
    }
  } catch (err) {
    console.error("Sheet fetch error:", err);
  }
};
  // const loadSheet = async (sheet) => {
  //   try {
  //     const res = await fetch(
  //       `https://batra-backend.onrender.com/api/excel/excel-data/${sheet}`
  //     );
  //     const result = await res.json();

  //     setData(result.data || []);
  //     setActiveSheet(sheet);
  //   } catch (err) {
  //     console.error("Load sheet error:", err);
  //   }
  // };

  const loadSheet = async (sheet) => {
  try {
    const { data: result } = await api.get(
      `/excel/excel-data/${sheet}`
    );

    setData(result || []);
    setActiveSheet(sheet);
  } catch (err) {
    console.error("Load sheet error:", err);
  }
};

  // const saveSheet = async () => {
  //   try {
  //     await fetch(
  //       `https://batra-backend.onrender.com/api/excel/excel-data/${activeSheet}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ data }),
  //       }
  //     );

  //     alert("Saved permanently ✅");
  //   } catch (err) {
  //     console.error("Save error:", err);
  //     alert("Save failed ❌");
  //   }
  // };

  const saveSheet = async () => {
  try {
    await api.post(
      `/excel/excel-data/${activeSheet}`,
      { data }   // body goes here automatically as JSON
    );

    alert("Saved permanently ✅");
  } catch (err) {
    console.error("Save error:", err);
    alert("Save failed ❌");
  }
};

  return (
    <AdminLayout>
      <SectionHeader
        title="Excel Viewer"
        subtitle="Manage Excel Data"
      />

      <div className="px-6">

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {sheetNames.map((sheet) => (
            <button
              key={sheet}
              onClick={() => loadSheet(sheet)}
              className={`px-3 py-1 rounded ${
                activeSheet === sheet
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300"
              }`}
            >
              {sheet}
            </button>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={saveSheet}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Save Changes
        </button>

        {/* Table */}
        <HotTable
          data={data}
          colHeaders={true}
          rowHeaders={true}
          filters={true}
          dropdownMenu={true}
          contextMenu={true}
          stretchH="all"
          minSpareRows={5}
          minSpareCols={2}
          width="100%"
          height="600"
          licenseKey="non-commercial-and-evaluation"
        />
      </div>
    </AdminLayout>
  );
}