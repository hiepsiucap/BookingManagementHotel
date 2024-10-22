/** @format */
import { DatePicker } from "@nextui-org/react";
import { now, today, getLocalTimeZone } from "@internationalized/date";

const DatePickers = ({ setSelectedDate, selectedDate, UpdateModal }: any) => {
  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    UpdateModal(true);
  };

  return (
    <div className="w-full max-w-xl flex flex-row gap-4">
      <DatePicker
        label="Ngày nhận "
        variant="bordered"
        minValue={today(getLocalTimeZone())}
        hideTimeZone
        value={selectedDate} // Bind the value
        onChange={handleDateChange} // Ha
        showMonthAndYearPickers
      />
    </div>
  );
};
export default DatePickers;
