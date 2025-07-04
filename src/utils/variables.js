import { DocxIcon, JsonIcon, PdfIcon, MdIcon } from "../icons";

/**@type {Array<import('../types.d').SaveBtnOptionType>} */
export const downloadOptions = [
  {
    format: "PDF",
    available: false,
    label: "pdf - broken",
    Icon: PdfIcon,
  },
  {
    format: "MD",
    label: "Markdown",
    available: true,
    Icon: MdIcon,
  },
  {
    format: "JSON",
    available: true,
    Icon: JsonIcon,
  },
];

export const sidebarClosingBtnSelector = `button[data-testid="close-sidebar-button"]`;
export const sidebarOpeningBtnSelector = `button[aria-controls="stage-slideover-sidebar"]`;
