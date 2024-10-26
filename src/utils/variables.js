import { DocxIcon, JsonIcon, PdfIcon, MdIcon } from "../icons";

export const downloadOptions = [
  {
    format: "PDF",
    available: true,
    Icon: PdfIcon,
  },
  {
    format: "MD",
    available: true,
    Icon: MdIcon,
  },
  {
    format: "JSON",
    available: true,
    Icon: JsonIcon,
  },
  {
    format: "DOCX",
    available: false,
    Icon: DocxIcon,
  },
];
