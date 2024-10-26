import { DocxIcon, JSONIcon, PDFIcon, MDIcon } from "../icons";

export const downloadOptions = {
  PDF: {
    available: true,
    icon: PDFIcon,
  },
  MD: {
    available: true,
    icon: MDIcon,
  },
  JSON: {
    available: true,
    icon: JSONIcon,
  },
  DOCX: {
    available: false,
    icon: DocxIcon,
  },
};
