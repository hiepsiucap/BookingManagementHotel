/** @format */
"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";
function Submit() {
  const { pending } = useFormStatus(); // Theo dõi trạng thái form

  return (
    <Button
      type="submit"
      className={pending ? " px-4 py-2 bg-white " : " px-12 py-2 bg-green-400"}
    >
      {pending ? "Đang gửi..." : "Gửi"}
    </Button>
  );
}
export default Submit;
