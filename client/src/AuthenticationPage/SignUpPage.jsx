import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/chat.png";

export default function SignUpPage() {
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    const signUpData = {
      first_name: e.target.firstName.value,
      last_name: e.target.lastName.value,
      email_address: e.target.emailAddress.value,
      password: e.target.password.value,
      confirm_password: e.target.confirmPassword.value,
    };

    axios
      .post(
        "http://localhost:5000/api/v1/authentication_api/sign_up",
        signUpData
      )
      .then((response) => {
        setPasswordError(response.data.message);
        console.log();
        if (response.data.insertedId) {
          navigate("/login");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="bg-[#E8E8E8] h-screen flex justify-center items-center">
      <form
        onSubmit={handleSignUp}
        className="bg-white w-[600px] shadow-lg py-[30px] rounded-2xl flex justify-center items-center flex-col"
      >
        <img className="w-24 mb-2" src={logo} alt="" />
        <h3 className="text-3xl font-medium mb-4 text-gray-700">CHATIFY</h3>
        <div className="flex flex-col w-4/5 md:w-3/5 mb-4">
          <label htmlFor="firstName">First name</label>
          <input
            required
            className="border mt-1 p-2 rounded border-[#E8E8E8]"
            id="firstName"
            name="firstName"
            placeholder="First name"
            type="text"
          />
        </div>
        <div className="flex flex-col w-4/5 md:w-3/5 mb-4">
          <label htmlFor="">Last name</label>
          <input
            required
            className="border mt-1 p-2 rounded border-[#E8E8E8]"
            id="lastName"
            name="lastName"
            placeholder="Last name"
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
        <div className="flex flex-col w-4/5 md:w-3/5 mb-4">
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
          className={` bg-blue-500 text-white py-[10px] px-12 rounded-xl font-bold mt-3 md:mt-6 mb-6`}
        >
          Signup
        </button>
        <p className="text-[#b5b4b4] mt-3 md:mt-8">
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
