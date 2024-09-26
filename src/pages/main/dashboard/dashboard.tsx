import { useState, useEffect } from "react";
import { SimpleGrid } from "@mantine/core";
import { atom, selector, useRecoilState, useResetRecoilState } from "recoil";
import Protected from "../../../components/protected";
import { StatsCard } from "../../../components/stats";
import apiProvider from "../../../network/api_provider";
import Loader from "../../../components/loader";
import React from "react";

export const dashboardFilterState = atom({
  key: "dashboardFilterState",
  default: {
    type: "Today",
    date: undefined,
    isFilterApplied: false,
  },
});

export const dashboardSelector = selector({
  key: "dashboardSelector",
  get: async () => {
    const result = await apiProvider.get_dashboard();
    return result?.data?.data ?? null;
  },
});

const DashboardCard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const resetDashboardState = useResetRecoilState(dashboardFilterState);
  const [filters] = useRecoilState(dashboardFilterState);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await apiProvider.get_dashboard();
      setDashboardData(result?.data?.data ?? null);
      setIsLoading(false);
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, [filters]);

  useEffect(() => {
    resetDashboardState();
  }, [resetDashboardState]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <SimpleGrid
        cols={5}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        <StatsCard
          title="Total Users"
          value={(dashboardData?.userCount ?? 0).toString()}
          color="primary"
          shape="diamond"
        />
        <StatsCard
          title="Total Projects"
          value={(dashboardData?.projectCount ?? 0).toString()}
          color="orange"
          shape="octagon"
        />
        <StatsCard
          title="Total Task Count"
          value={(dashboardData?.totalTaskCount ?? 0).toString()}
          color="violet"
          shape="star"
        />
        <StatsCard
          title="Total Task"
          value={(dashboardData?.taskCount ?? 0).toString()}
          color="amber"
          shape="hexagon"
        />
        <StatsCard
          title="Total Bugs"
          value={(dashboardData?.bugCount ?? 0).toString()}
          color="red"
          shape="hexagon"
        />
        <StatsCard
          title="Total To Do Items"
          value={(dashboardData?.toDoCount ?? 0).toString()}
          color="gray"
          shape="squircle"
        />
        <StatsCard
          title="Total InProgress"
          value={(dashboardData?.inProgressCount ?? 0).toString()}
          color="pink"
          shape="star2"
        />
        <StatsCard
          title="Total Resolved"
          value={(dashboardData?.doneCount ?? 0).toString()}
          color="green"
          shape="star2"
        />
        <StatsCard
          title="Total Reopened"
          value={(dashboardData?.reopenedCount ?? 0).toString()}
          color="cyan"
          shape="star2"
        />
      </SimpleGrid>
    </div>
  );
};

function Dashboard() {
  return (
    <Protected>
      <div className="card px-6 pt-4 pb-6 space-y-4 mt-3">
        <div className="flex flex-row justify-between items-center space-x-4">
          <div className="flex flex-col">
            <div className="text-xl font-bold text-black">Dashboard</div>
            <div className="text-sm mt-1"></div>
          </div>
        </div>
        <React.Suspense fallback={<Loader />}>
          <DashboardCard />
        </React.Suspense>
      </div>
    </Protected>
  );
}

export default Dashboard;
