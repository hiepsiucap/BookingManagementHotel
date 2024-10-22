/** @format */
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
export function formatDate(dateString: string) {
  // Tạo đối tượng Date từ chuỗi ngày tháng ban đầu
  const date = new Date(dateString);

  // Lấy ngày, tháng, và năm
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() trả về giá trị từ 0 đến 11, nên cần +1
  const year = date.getFullYear();

  // Ghép các giá trị lại theo định dạng DD/MM/YYYY
  return `${day}/${month}/${year}`;
}
export const formatPrice = (number: number) => {
  const newNumber = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  }).format(number);
  return newNumber;
};
export function formatDateToCustomString(utcDate: Date) {
  let utcHours = utcDate.getUTCHours();
  let utcMinutes = utcDate.getUTCMinutes();
  let utcSeconds = utcDate.getUTCSeconds();
  let utcDay = utcDate.getUTCDate();
  let utcMonth = utcDate.getUTCMonth() + 1; // getUTCMonth() is zero-based
  let utcYear = utcDate.getUTCFullYear();

  // Add 7 hours to the UTC time to convert to HCM time
  let hcmDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

  // Get the HCM time components
  let hcmHours = ("0" + hcmDate.getUTCHours()).slice(-2);
  let hcmMinutes = ("0" + hcmDate.getUTCMinutes()).slice(-2);
  let hcmDay = ("0" + hcmDate.getUTCDate()).slice(-2);
  let hcmMonth = ("0" + (hcmDate.getUTCMonth() + 1)).slice(-2);
  let hcmYear = hcmDate.getUTCFullYear();

  return `${hcmHours}:${hcmMinutes}, ${hcmDay}/${hcmMonth}/${hcmYear}`;
}
export const formatDateToCustomStringDay = (utcDate: Date) => {
  // Mảng các ngày trong tuần bằng tiếng Việt
  const weekdays = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];

  // Add 7 hours to the UTC time to convert to HCM time
  let hcmDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

  // Get the HCM time components
  let hcmHours = ("0" + hcmDate.getUTCHours()).slice(-2);
  let hcmMinutes = ("0" + hcmDate.getUTCMinutes()).slice(-2);
  let hcmDay = ("0" + hcmDate.getUTCDate()).slice(-2);
  let hcmMonth = ("0" + (hcmDate.getUTCMonth() + 1)).slice(-2);
  let hcmYear = hcmDate.getUTCFullYear();

  // Lấy ngày trong tuần (0 = Chủ Nhật, 6 = Thứ Bảy)
  let dayOfWeek = weekdays[hcmDate.getUTCDay()];

  // Return formatted date and time string with day of the week
  return `${dayOfWeek}, ${hcmHours}:${hcmMinutes}, ${hcmDay}/${hcmMonth}/${hcmYear}`;
};

export function calculateHoursBetweenDates(date1: Date, date2: Date) {
  // Chuyển đổi thời gian của hai date thành mili giây
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());

  // Chuyển đổi mili giây thành giờ
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  return hoursDiff;
}
