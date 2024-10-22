/** @format */

export const generateTimeSlots = () => {
  const times = [];
  let currentTime = new Date();
  currentTime.setHours(0, 0, 0, 0);

  for (let i = 0; i < 48; i++) {
    const timeString = currentTime.toTimeString().substring(0, 5); // Lấy định dạng HH:MM
    times.push({ timeString: timeString, timenumb: i / 2 });
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }
  console.log(times);
  return times;
};
export const generatePastTimeSlots = () => {
  const times = [];
  const now = new Date(); // Thời điểm hiện tại
  let currentTime = new Date();
  currentTime.setHours(0, 0, 0, 0); // Đặt giờ hiện tại về 00:00

  for (let i = 0; i < 48; i++) {
    const timeString = currentTime.toTimeString().substring(0, 5); // Lấy định dạng HH:MM

    // Chỉ thêm khung giờ nếu nó trước thời điểm hiện tại
    if (currentTime < now) {
      times.push((i / 2).toString());
    }
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }
  console.log(times, now);
  return times;
};
