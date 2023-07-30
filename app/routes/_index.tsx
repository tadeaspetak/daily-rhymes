import { Link, Outlet, V2_MetaFunction } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <h1 className="text-primary-color">Hello world!</h1>
      <Link to="/home">Home</Link>
      <Link to="/sub">index sub</Link>
      <Outlet />{" "}
    </div>
  );
}
