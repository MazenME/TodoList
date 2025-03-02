import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import InputErrorMsg from "../components/ui/InputErrorMessage";
import { RegisterForm } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation";
import axiosInstance from "../config/config.axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResbonse } from "../interfaces";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  // ** States
  const [loading, setLoading] = useState(false);
  const go = useNavigate();

  // ** Handler
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(registerSchema) });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);

    try {
      const { status } = await axiosInstance.post("/auth/local/register", data);
      if (status === 200) {
        toast.success("Register completed successfully, you can login now", {
          duration: 1500,
          position: "top-center",
          style: {
            background: "#006000",
            color: "#F3F4F6",
            width: "fit-content",
          },
        });
        setTimeout(() => {
          go("/login");
        }, 1500);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResbonse>;
      toast.error(`${errorObj.response?.data.error.message}`, {
        duration: 1500,
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
  const renderInputs = RegisterForm.map(
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
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderInputs}
        <Button isLoading={loading} fullWidth>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
