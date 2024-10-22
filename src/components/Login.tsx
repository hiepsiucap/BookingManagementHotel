/** @format */
"use client";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2/dist/sweetalert2.js";
const Login = () => {
  const [username, changeUsername] = useState("");
  const [pass, changePass] = useState("");
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !pass) {
      const error = !username
        ? "Vui lòng nhập username"
        : " Vui lòng nhập mật khẩu";
      Swal.fire({
        icon: "error",
        title: "Vui lòng điền đầy đủ thông tin",
        text: error,
      });
      return;
    }
    await signIn("credentials", {
      username: username,
      password: pass,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-1/4 flex flex-col bg-white items-center justify-center space-y-6 p-12 px-10 rounded-xl"
    >
      <h5 className=" text-xl ">Đăng nhập</h5>
      <Input
        onChange={(e) => {
          changeUsername(e.target.value);
        }}
        type="text"
        id="text"
        label="Tài khoản"
      />
      <Input
        type="password"
        id="password"
        onChange={(e) => {
          changePass(e.target.value);
        }}
        label="Mật khẩu"
      />
      <Button type="submit">Đăng nhập</Button>
    </form>
  );
};
export default Login;
