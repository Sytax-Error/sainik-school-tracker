import * as XLSX from "xlsx";
import { type ItemStatus } from "../constants/status.js";

export interface RawWorkbookRow {
  "Bidder Name "?: string;
  __EMPTY?: number | string;
  "CYGNUS INFORMATION SOLUTIONS PRIVATE LIMITED  (L1)"?: number | string;
  __EMPTY_1?: number | string;
  __EMPTY_2?: string;
  __EMPTY_3?: string;
}

export interface ParsedPhase {
  name: string;
  code: string;
  order: number;
  items: ParsedItem[];
}

export interface ParsedItem {
  code: string;
  name: string;
  description?: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  status: ItemStatus;
  progressPercent: number;
  valueCompleted: number;
  remarks?: string;
}

function sanitizeString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const str = String(value).trim();
  return str === "" ? undefined : str;
}

function sanitizeNumber(value: unknown): number {
  if (value === undefined || value === null) return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

function generateItemCode(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .substring(0, 50);
}

function parsePhaseSheet(
  sheetName: string,
  sheet: XLSX.WorkSheet,
  order: number,
): ParsedPhase {
  const rows = XLSX.utils.sheet_to_json<RawWorkbookRow>(sheet, { defval: "" });
  const dataRows = rows.slice(1); // Skip header row

  const items: ParsedItem[] = [];

  for (const row of dataRows) {
    const itemName = sanitizeString(row["Bidder Name "]);
    const quantity = sanitizeNumber(row["__EMPTY"]);
    const rate = sanitizeNumber(
      row["CYGNUS INFORMATION SOLUTIONS PRIVATE LIMITED  (L1)"],
    );
    const amount = sanitizeNumber(row["__EMPTY_1"]);

    if (!itemName || itemName === "Total Value") continue;

    // Only include items with quantity > 0 for this phase
    if (quantity <= 0) continue;

    const code = generateItemCode(itemName);

    items.push({
      code,
      name: itemName,
      description: undefined,
      unit: "NOS",
      quantity,
      rate,
      amount,
      status: "NOT_STARTED",
      progressPercent: 0,
      valueCompleted: 0,
      remarks: undefined,
    });
  }

  // Generate phase code from sheet name
  const phaseCode = sheetName
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .substring(0, 20);

  return {
    name: sheetName,
    code: phaseCode,
    order,
    items,
  };
}

export function parseWorkbook(buffer: Buffer): ParsedPhase[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const phases: ParsedPhase[] = [];
  let order = 1;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    phases.push(parsePhaseSheet(sheetName, sheet, order));
    order++;
  }

  return phases;
}
