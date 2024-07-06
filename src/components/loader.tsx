import { Loader as MantineLoader } from "@mantine/core";

export default function Loader() {
  return (
    <div className="w-full flex justify-center items-center min-h-screen ">
      <MantineLoader />
    </div>
  );
}
