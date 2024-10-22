/** @format */
import Image from "next/image";
const Footer = () => {
  return (
    <div className=" flex justify-between px-10 shadow-xl w-full bg-green-100 bg-opacity-40 py-5">
      <div className=" flex space-x-5 items-center ">
        <Image
          src="https://res.cloudinary.com/dhhuv7n0h/image/upload/v1723450908/logo-footer-5187_1_oesws2.png"
          alt=""
          width={160}
          height={160}
        />
        <div className="">
          <p className="">Thông tin liên hệ</p>
          <p className=" text-3xl font-bold text-green-500 pt-2">LÁ HOTEL</p>
          <div className="flex space-x-1 pt-4">
            <p className=" font-bold">HOTLINE:</p>
            <p> 0902 306 514</p>
          </div>
          <div className="flex space-x-1 pt-2">
            <p className=" font-bold">EMAIL:</p>
            <p>billhiepnguyen@gmail.com</p>
          </div>
          <div className="flex space-x-1 pt-2">
            <p className=" font-bold">WEBSITE:</p>
            <p>lahotel.com.vn</p>
          </div>
          <div className=" text-gray-600 pt-2">
            Copyright © 2024 Lá Hotel - Nơi không gian xanh thư giãn cho mọi
            người
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
