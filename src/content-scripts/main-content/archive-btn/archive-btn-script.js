import { advanceQuerySelector, syncDB } from "../../../utils";

const archiveIconPath =
  "M4.82918 4.10557C5.16796 3.428 5.86049 3 6.61803 3H17.382C18.1395 3 18.832 3.428 19.1708 4.10557L20.7889 7.34164C20.9277 7.61935 21 7.92558 21 8.23607V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V8.23607C3 7.92558 3.07229 7.61935 3.21115 7.34164L4.82918 4.10557ZM17.382 5H6.61803L5.61803 7H18.382L17.382 5ZM19 9H5V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V9ZM11.2929 10.7929C11.6834 10.4024 12.3166 10.4024 12.7071 10.7929L15.2071 13.2929C15.5976 13.6834 15.5976 14.3166 15.2071 14.7071C14.8166 15.0976 14.1834 15.0976 13.7929 14.7071L13 13.9142V16.5C13 17.0523 12.5523 17.5 12 17.5C11.4477 17.5 11 17.0523 11 16.5V13.9142L10.2071 14.7071C9.81658 15.0976 9.18342 15.0976 8.79289 14.7071C8.40237 14.3166 8.40237 13.6834 8.79289 13.2929L11.2929 10.7929Z";

async function handleOnArchive() {
  const data = await fetch("/backend-api/conversations?limit=2&is_archived=false")
    .then((res) => res.json())
    .then(({ items }) => items);

  await syncDB(window.userId, "conversations", data);
}

/**@type {HTMLButtonElement | null} */
let archiveBtn = null;

export default async () => {
  if (archiveBtn) archiveBtn.removeEventListener("click", handleOnArchive);

  archiveBtn = await advanceQuerySelector(`main button:has(path[d="${archiveIconPath}"])`);

  archiveBtn.addEventListener("click", handleOnArchive, { once: true });
};
