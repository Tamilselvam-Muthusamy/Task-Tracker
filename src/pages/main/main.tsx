import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../../components/layout";
import Loader from "../../components/loader";

function MainPage() {
  return (
    <React.Suspense fallback={<Loader />}>
      <Layout>
        <Outlet />
      </Layout>
    </React.Suspense>
  );
}
export default MainPage;
