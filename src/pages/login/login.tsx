import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import { AuthContext } from "../../context/auth_context";
import ApiClient from "../../network/api_client";
import apiProvider from "../../network/api_provider";
import LoginHead from "../../components/login_header";

function LoginPage() {
  const authContext = useContext(AuthContext);
  localStorage.clear();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({
    initialValues: { email: "", password: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8 ? "password more than 8 letters" : null,
    },
  });

  const onSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const data = {
        email: values.email,
        password: values.password,
      };
      const result = await ApiClient.post<any>("auth", data);
      const statusCode = result?.status ?? 0;
      if (statusCode == 200 || statusCode == 201) {
        if (result.data?.data) {
          const message = "Login Successfully";
          authContext?.login(result?.data?.data);

          apiProvider.showAlert(message, true);
          navigate("/dashboard");
        }
      } else {
        const message = result?.data?.message ?? "Login failed";
        apiProvider.showAlert(message, false);
        setLoading(false);
      }
    } catch (error: any) {
      apiProvider.axiosError(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <LoginHead />
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="flex flex-col space-y-3 px-6 pt-6 pb-8 bg-white shadow-md rounded-lg">
            <div className="flex items-center text-xl font-semibold justify-center text-black">
              Login
            </div>
            <div>
              <TextInput
                {...form.getInputProps("email")}
                variant="filled"
                className="w-96"
                placeholder="Enter Email"
                label="Email"
                withAsterisk
              />
            </div>
            <div>
              <PasswordInput
                {...form.getInputProps("password")}
                variant="filled"
                placeholder="Enter Password"
                label="Password"
                withAsterisk
              />
            </div>
            <div className="">
              <Button loading={loading} type="submit" className="w-96 mt-2">
                Login
              </Button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;

// const [chechAccessid, setCheckAccessid] = useState<any>();
//To Check the length of access Id (default-6)
// function accessIdlen() {
//   let checkaccessIdLength = "";
//   if (checkaccessIdLength.length != 6) {
//     const add_Zero = 6 - checkaccessIdLength.length;
//     checkaccessIdLength = "0".repeat(add_Zero) + checkaccessIdLength;
//     setCheckAccessid(checkaccessIdLength);
//   } else {
//     setCheckAccessid(checkaccessIdLength);
//   }

// }
