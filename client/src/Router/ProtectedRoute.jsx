import React from "react";
import { useVerifyTokenQuery } from "../redux/fetures/auth/auth.api";

export default function ProtectedRoute({ children }) {
    const {data} = useVerifyTokenQuery()
    console.log(data)
  return <div>{children}</div>;
}
