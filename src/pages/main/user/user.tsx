import { Button, Input } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import {
  atom,
  selector,
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useResetRecoilState,
} from "recoil";
import { Search } from "tabler-icons-react";
import apiProvider from "../../../network/api_provider";
import Protected from "../../../components/protected";
import UserLoader from "./user_loader";
import UserTable from "./user_table";
import AddUser from "./add_user";

export const userSelector = selector({
  key: "userSelector",
  get: async ({ get }) => {
    const getData = get(userState);
    const data = {
      page: getData.page,
      search: getData.search,
    };
    const result = await apiProvider.fetchUserData(data);
    return result?.data?.data ?? null;
  },
});

export const userState = atom({
  key: "userState",
  default: {
    search: "",
    page: 1,
  },
});

function Users() {
  const [state, setState] = useRecoilState(userState);
  const searchRef = useRef<HTMLInputElement>(null);
  const resetUserState = useResetRecoilState(userState);
  const refershUserData = useRecoilRefresher_UNSTABLE(userSelector);

  const searchUsers = async () => {
    setState({ ...state, search: searchRef.current?.value ?? "", page: 1 });
  };

  useEffect(() => {
    if (searchRef.current != null) {
      searchRef.current.value = state.search;
    }
  }, [state]);

  useEffect(() => {
    resetUserState();
    refershUserData();
  }, []);

  return (
    <Protected>
      <div className="card px-6 pt-4 pb-6 space-y-4 mt-3">
        <div className="flex flex-row justify-between items-center space-x-4">
          <div className="text-xl font-bold text-black">Users</div>
          <div className="flex flex-row justify-between items-end space-x-4">
            {localStorage.getItem("role") === "Admin" ? <AddUser /> : <></>}
            <Input
              ref={searchRef}
              variant="filled"
              placeholder="Search"
              icon={<Search size={16} />}
            />
            <Button onClick={searchUsers} size="sm">
              Search
            </Button>
          </div>
        </div>
        <React.Suspense fallback={<UserLoader />}>
          <UserTable />
        </React.Suspense>
      </div>
    </Protected>
  );
}
export default Users;
