import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/chat.png";
import {  useSignupMutation } from "../redux/fetures/auth/auth.api";
import { toast } from "sonner";

export default function SignUpPage() {
  const [passwordError, setPasswordError] = useState(null);
   const [signup] = useSignupMutation();
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    const toastId = toast.loading("Logging in");
    e.preventDefault();
    const signUpData = {
     name: e.target.name.value,
      email: e.target.emailAddress.value,
      password: e.target.password.value,
      confirm_password: e.target.confirmPassword.value,
    };
    signup(signUpData)
    .then((data) => {
console.log(data)
      // const decoded = jwtDecode(data.data.accessToken);
      // dispatch(setUser({ user: decoded, token: data.data.accessToken }));
      toast.success("Logged in successfully", {
        id: toastId,
        duration: 2000,
      });

      // navigate("/")
    })
    .catch(() => {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    });
    // axios
    //   .post(
    //     "http://localhost:5000/api/v1/authentication_api/sign_up",
    //     signUpData
    //   )
    //   .then((response) => {
    //     setPasswordError(response.data.message);
    //     console.log();
    //     if (response.data.insertedId) {
    //       navigate("/login");
    //     }
    //   })
    //   .catch((error) => console.log(error));
  };

  return (
    <div className="bg-[#E8E8E8] h-screen flex justify-center items-center">
      <form
        onSubmit={handleSignUp}
        className="bg-white w-[600px] shadow-lg md:py-[20px]  lg:py-[30px] rounded-2xl flex justify-center items-center flex-col"
      >
        <img className="w-24 mb-2" src={logo} alt="" />
        <h3 className="text-3xl font-medium mb-4 text-gray-700">CHATIFY</h3>
        <div className="flex flex-col w-4/5 md:w-3/5 mb-4">
          <label htmlFor="">Name</label>
          <input
            required
            className="border mt-1 p-2 rounded border-[#E8E8E8]"
            id="name"
            name="name"
            placeholder="Name"
            type="text"
          />
        </div>
        <div className="flex flex-col w-4/5 md:w-3/5 mb-4">
          <label htmlFor="">Email address</label>
          <input
            required
            className="border mt-1 p-2 rounded border-[#E8E8E8]"
            id="emailAddress"
            name="emailAddress"
            placeholder="Email address"
            type="text"
          />
        </div>
        <div className="flex flex-col w-4/5 md:w-3/5 mb-4">
          <label htmlFor="">Password</label>
          <input
            required
            className="border mt-1 p-2 rounded border-[#E8E8E8]"
            id="password"
            name="password"
            placeholder="Password"
            type="password"
          />
        </div>
        <div className="flex flex-col w-4/5 md:w-3/5 lg:mb-4">
          <label htmlFor="">Confirm password</label>
          <input
            required
            className="border mt-1 p-2 rounded border-[#E8E8E8]"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm password"
            type="password"
          />
        </div>
        {passwordError && (
          <p className="text-sm text-red-500">{passwordError}</p>
        )}
        <button
          className={` bg-blue-500 text-white py-[10px] px-12 rounded-xl font-bold mt-3 md:mt-3 md:mb-3 lg:mb-6 `}
        >
          Signup
        </button>
        <p className="text-[#b5b4b4] mt-3 md:mt-4 lg:mt-8">
          Already have an account?{" "}
          <Link
            to={`/login`}
            className="hover:cursor-pointer hover:underline hover:text-[#959595]"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
