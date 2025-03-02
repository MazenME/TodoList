import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LoginForm } from "../data";
import axiosInstance from "../config/config.axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResbonse } from "../interfaces";
import InputErrorMsg from "../components/ui/InputErrorMessage";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  // ** States
  const [loading, setLoading] = useState(false);

  // ** Handler
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);

    try {
      const { status, data: resData } = await axiosInstance.post(
        "/auth/local",
        data
      );

      if (status === 200) {
        toast.success("login complete, you will navigate to home page now", {
          duration: 1500,
          position: "top-center",
          style: {
            background: "#006000",
            color: "#F3F4F6",
            width: "fit-content",
          },
        });
        localStorage.setItem("token", JSON.stringify(resData));

        setTimeout(() => {
          location.replace("/");
        }, 1500);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResbonse>;
      toast.error(`${errorObj.response?.data.error.message}`, {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#bb0000",
          color: "#F3F4F6",
          width: "fit-content",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // ** Render
  const renderInputs = LoginForm.map(
    ({ name, placeholder, type, validation }, index) => {
      return (
        <div key={index}>
          <Input
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
          />
          <InputErrorMsg msg={errors[name]?.message} />
        </div>
      );
    }
  );

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderInputs}
        <Button fullWidth isLoading={loading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
