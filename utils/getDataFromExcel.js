import XLSX from "xlsx";

const getDataFromExcelData = (data) => {
  const workbook = XLSX.read(data, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const result = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  return result;
};

export { getDataFromExcelData };
