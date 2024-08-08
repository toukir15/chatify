import { Link, useNavigate } from "react-router-dom";
import logo from "/chat.png";
import { useLoginMutation } from "../redux/fetures/auth/auth.api";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/fetures/auth/auth.slice";
import { toast } from "sonner";

export default function LoginPage() {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    const toastId = toast.loading("Logging in");
    e.preventDefault();
    const loginData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    login(loginData)
      .then((data) => {
        const decoded = jwtDecode(data.data.accessToken);
        dispatch(setUser({ user: decoded, token: data.data.accessToken }));
        toast.success("Logged in successfully", {
          id: toastId,
          duration: 2000,
        });
        navigate("/");
      })
      .catch(() => {
        toast.error("Something went wrong", { id: toastId, duration: 2000 });
      });
  };
  return (
    <div className="bg-[#E8E8E8] h-screen flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="bg-white w-[500px] shadow-lg pb-[70px] pt-[50px] rounded-2xl flex justify-center items-center flex-col"
      >
        <img className="w-24 mb-2" src={logo} alt="" />
        <h3 className="text-3xl font-medium mb-4 text-gray-700">CHATIFY</h3>
        <div className="flex flex-col w-4/5 md:w-3/5 mb-4">
          <label htmlFor="email">Email</label>
          <input
            className="border mt-1 p-2 rounded border-[#E8E8E8]"
            id="email"
            name="email"
            placeholder="Email"
            type="email"
          />
        </div>
        <div className="flex flex-col w-4/5 md:w-3/5 mb-4">
          <label htmlFor="password">Password</label>
          <input
            className="border mt-1 p-2 rounded border-[#E8E8E8]"
            id="password"
            name="password"
            placeholder="Password"
            type="password"
          />
        </div>
        <button className="bg-[#7ae8af] text-white py-[10px] px-12 rounded-xl font-bold mt-4">
          Login
        </button>
        <Link
          to={`/sign-up`}
          className="text-[#b5b4b4] hover:underline mt-4 hover:cursor-pointer  hover:text-[#959595]"
        >
          Create a new account
        </Link>
      </form>
    </div>
  );
}
