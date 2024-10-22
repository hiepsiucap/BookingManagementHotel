/** @format */
import Gallery from "./Gallery";
import { formatPrice } from "@/func/Format";
const EachRoom = ({
  images,
  name,
  utilities,
  price,
  id,
  UpdateChooseRoom,
}: {
  images: Array<{ original: string; thumbnail: string }>;
  name: string;
  utilities: Array<string>;
  price: number;
  id: number;
  UpdateChooseRoom: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const onclickHandler = async (e: any) => {
    UpdateChooseRoom(e);
  };
  return (
    <div className=" p-4 pt-6 border border-gray-200">
      <Gallery images={images}></Gallery>
      <div className="flex justify-between">
        <div className="flex flex-col space-y-1">
          <h5 className=" font-bold text-xl pb-3 pt-2">{name}</h5>
          {utilities?.map((utility) => {
            return (
              <p key={utility} className=" text-gray-800 font-extralight">
                - {utility}
              </p>
            );
          })}
        </div>
        <div className=" pt-12 flex flex-col items-center space-y-2">
          <h4 className=" font-bold text-2xl">
            {price == 0 ? "Hết phòng" : formatPrice(price)}
          </h4>
          <button
            id={id.toString()}
            onClick={onclickHandler}
            className={
              price == 0
                ? "hidden"
                : " py-2 px-3 bg-green-500 font-thin rounded-lg  text-white"
            }
          >
            Đặt phòng
          </button>
        </div>
      </div>
    </div>
  );
};
export default EachRoom;
