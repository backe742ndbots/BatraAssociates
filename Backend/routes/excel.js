const express = require("express");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const router = express.Router();

/* ================= SAVE EXCEL ================= */
router.post("/save", (req, res) => {
  try {
    const { sheetName, headers, data } = req.body;

    if (!sheetName || !headers || !data) {
      return res.status(400).json({ message: "Missing data" });
    }

    // Path to Excel file
    const filePath = path.join(
      __dirname,
      "../excel/COMBINE (2).xlsx"
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Excel file not found" });
    }

    const workbook = XLSX.readFile(filePath);

    const fullData = [headers, ...data];

    const worksheet = XLSX.utils.aoa_to_sheet(fullData);

    workbook.Sheets[sheetName] = worksheet;

    XLSX.writeFile(workbook, filePath);

    return res.json({ success: true });
  } catch (error) {
    console.error("Excel Save Error:", error);
    return res.status(500).json({ success: false });
  }
});

router.get("/excel-data/:sheet", (req, res) => {
  const sheetName = req.params.sheet;
  const filePath = path.join(__dirname, "../excel/COMBINE (2).xlsx");

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];

  let data = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    raw: true   // keep raw numbers
  });

  // Convert Excel serial dates manually
  data = data.map(row =>
    row.map(cell => {
      if (typeof cell === "number" && cell > 20000 && cell < 60000) {
        const excelEpoch = new Date(1899, 11, 30);
        const converted = new Date(excelEpoch.getTime() + cell * 86400000);

        return converted.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
      }
      return cell;
    })
  );

  res.json({ data });
});



router.post("/excel-data/:sheet", (req, res) => {
  const sheetName = req.params.sheet;
  const { data } = req.body;

  const filePath = path.join(__dirname, "../excel/COMBINE (2).xlsx");

  const workbook = XLSX.readFile(filePath);
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  workbook.Sheets[sheetName] = worksheet;
  XLSX.writeFile(workbook, filePath);

  res.json({ success: true });
});


router.get("/sheets", (req, res) => {
  const filePath = path.join(__dirname, "../excel/COMBINE (2).xlsx");

  const workbook = XLSX.readFile(filePath);

  res.json({ sheets: workbook.SheetNames });
});
module.exports = router;