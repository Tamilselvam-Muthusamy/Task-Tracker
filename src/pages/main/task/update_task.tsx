/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import {
  ActionIcon,
  Button,
  Drawer,
  FileButton,
  Group,
  LoadingOverlay,
  Text,
  ScrollArea,
  Select,
  SimpleGrid,
  Textarea,
  TextInput,
  Tooltip,
  Image,
  MultiSelect,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import moment from "moment";
import ApiClient, { imageUrl } from "../../../network/api_client";
import { AxiosError } from "axios";
import {
  Download,
  Edit,
  Trash,
  ZoomIn,
  ZoomOut,
  ZoomReset,
} from "tabler-icons-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { ImAttachment } from "react-icons/im";
import PageLoader from "../../../components/loader";
import apiProvider from "../../../network/api_provider";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { taskSelector } from "./task";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import { modals } from "@mantine/modals";

function TaskEdit({ task }: any) {
  const { id } = useParams();
  const loggedUserRole = localStorage.getItem("role");
  const [opened, setOpened] = useState(false);
  const [imageUrls, setImageUrls] = useState<any>([]);
  const [imageOpen, setImageOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignedId, setAssignedId] = useState<any[]>([]);
  const [statusId, setStatusId] = useState<string | null>(null);
  const [taskFile, setTaskFile] = useState<File[]>([]);
  const [projectName, setProjectName] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [file, setFile] = useState<File[]>([]);
  const refreshTaskDetails = useRecoilRefresher_UNSTABLE(taskSelector(id));
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      description: "",
      taskAssigneeId: [],
      projectId: "",
      tasktitle: "",
      type: "",
      statusId: "",
      taskId: "",
    },
    validate: {
      description: (value) => (value.length < 2 ? "Enter description" : null),
      taskAssigneeId: (value) =>
        value != null && value.length > 0 ? null : "Select Name",
      tasktitle: (value) => (value.length < 2 ? "Enter title" : null),
    },
  });

  async function fetchUsers() {
    const params = {
      page: 0,
      searchRef: "",
    };
    const result = await apiProvider.fetchUserData(params);
    if (result != null) {
      setAssignedId(result.data.data?.data ?? []);
      getStatusId();
    }
    return null;
  }

  function getStatusId(): any {
    setStatusId(`${task.statusId ?? 0}`);
  }

  function changeStatus(val: any) {
    form.setFieldValue("statusId", val);
    setStatusId(val);
  }

  function projectTitle() {
    const projectName = task?.title;
    setProjectName(projectName);
  }

  function setImage() {
    setTaskFile((task.TaskImages?.length ?? 0) > 0 ? task.TaskImages : null);
  }

  const onSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const formData: any = new FormData();
    file.forEach((file) => {
      formData.append("files", file);
    });
    // taskFile.forEach((file: any) => {
    //   console.log("2", file);

    //   formData.append("files", file);
    // });
    formData.append("status", statusId === null ? task?.statusId : +statusId);
    formData.append("projectId", +task.projectId);
    formData.append("title", values.tasktitle);
    formData.append("description", values.description);
    values?.taskAssigneeId.forEach((item) => {
      formData.append(`taskAssigneeIds`, item);
    });
    formData.append("typeId", +values.type);
    const result = await apiProvider.update_task(formData, task?.id);
    if (result != null) {
      setOpened(false);
      refreshTaskDetails();
      setFile([]);
    }
    setLoading(false);
  };

  function setData() {
    let userName = task?.TaskAssignees.map(
      (e: any) => `${e?.TaskToUser?.id ?? []}`
    );

    form.setFieldValue("tasktitle", task.title);
    form.setFieldValue("description", task.description);
    form.setFieldValue("taskAssigneeId", userName);
    setStatusId(task.statusId.toString());
    form.setFieldValue("type", task.typeId === 1 ? "1" : "2");
    form.setFieldValue(
      "createdAt",
      moment(task.createdAt).format("DD MMMM YYYY, h:mm a")
    );
    form.setFieldValue(
      "updatedAt",
      moment(task.updatedAt).format("DD MMMM YYYY, h:mm a")
    );
  }

  const deleteImage = async (index: number) => {
    setIsLoading(true);
    try {
      const result = await ApiClient.delete<any | null>(
        `/task/image/${task.TaskImages[index].id}`
      );
      let statusCode = result.status ?? 0;
      let message = result.data?.message ?? "Something went wrong";
      setTaskFile((images: any) => {
        return images.filter((_: any, i: any) => i !== index);
      });
      if (statusCode == 200) {
        modals.closeAll();
        refreshTaskDetails();
        apiProvider.showAlert(message, true);
      }
    } catch (error: any) {
      let message = "Something went wrong";
      if (error instanceof AxiosError && error.response) {
        message = error.response.data?.message ?? message;
        apiProvider.showAlert(message, false);
      } else {
        message = error.toString();
        apiProvider.showAlert(message, false);
      }
    }
    setIsLoading(false);
  };

  const downloadImage = (index: any) => {
    saveAs(
      imageUrl + `${task.TaskImages[index].image}`,
      `${task.TaskImages[index].image}`
    );
  };

  const buttonDownload = () => {
    saveAs(
      imageUrl + `${task.TaskImages[selectedImage].image}`,
      `${task.TaskImages[selectedImage].image}`
    );
  };

  function deleteImages(e: any) {
    setFile((index: any) => {
      return index.filter((i: any) => i !== e);
    });
  }

  useEffect(() => {
    projectTitle();
    setImage();
    if (opened) {
      setData();
      fetchUsers();
    }
    const urls = file.map((img: any) => URL.createObjectURL(img));
    setImageUrls(urls);

    return () => {
      urls.forEach((url: any) => URL.revokeObjectURL(url));
    };
  }, [opened, file]);

  const openConfirmationModal = (image: any) =>
    modals.open({
      title: "Remove Image",
      padding: "lg",
      yOffset: 30,
      children: (
        <>
          <LoadingOverlay visible={isLoading} />
          <Text c="gray">Are you sure you want to remove this image?</Text>
          <Group className="flex justify-end">
            <Button variant="default" onClick={() => modals.closeAll()} mt="md">
              No
            </Button>
            <Button
              style={{ backgroundColor: "primary", color: "white" }}
              onClick={() => deleteImage(image)}
              mt="md"
              loading={isLoading}
            >
              Yes
            </Button>
          </Group>
        </>
      ),
    });

  return (
    <div>
      <div>
        <Drawer
          position="right"
          opened={opened}
          onClose={() => {
            setOpened(false);
            setFile([]);
          }}
          title={<div className="font-bold p-4">{projectName}</div>}
        >
          <LoadingOverlay loader={<PageLoader />} visible={loading} />
          <ScrollArea style={{ height: 900 }}>
            <form onSubmit={form.onSubmit(onSubmit)}>
              <div className="p-4 ">
                <div className="space-y-4  flex flex-col">
                  <div className="w-full ">
                    <TextInput
                      {...form.getInputProps("tasktitle")}
                      label={<div className="font-bold">Title</div>}
                      variant="filled"
                      readOnly={loggedUserRole == "User"}
                    />
                  </div>
                  <div className="w-full">
                    <Select
                      label={
                        <div className="font-bold">
                          Type<span className="ml-1 text-red-500">*</span>
                        </div>
                      }
                      searchable
                      variant="filled"
                      placeholder="Select Type"
                      {...form.getInputProps("type")}
                      data={[
                        { value: "1", label: "Task" },
                        { value: "2", label: "Bug" },
                      ]}
                      readOnly={loggedUserRole == "User"}
                    />
                  </div>

                  <div className="w-full ">
                    <MultiSelect
                      label={<div className="font-bold">Assignee</div>}
                      {...form.getInputProps("taskAssigneeId")}
                      variant="filled"
                      placeholder="Select Name"
                      data={assignedId?.map((item: any) => ({
                        value: (item.id ?? 0).toString(),
                        label: item.firstName ?? "",
                      }))}
                      readOnly={loggedUserRole == "User"}
                    />
                  </div>
                  <div className="w-full">
                    <Select
                      label={<div className="font-bold">Status</div>}
                      {...form.getInputProps("statusId")}
                      value={statusId}
                      onChange={changeStatus}
                      variant="filled"
                      placeholder="Select Name"
                      data={[
                        { value: "1", label: "To Do" },
                        { value: "2", label: "InProgress" },
                        { value: "3", label: "Reopen" },
                        { value: "4", label: "Done" },
                      ]}
                    />
                  </div>
                  <div className="w-full ">
                    <TextInput
                      label={<div className="font-bold">Created At</div>}
                      {...form.getInputProps("createdAt")}
                      variant="filled"
                      readOnly
                    />
                  </div>
                  <div className="w-full">
                    <TextInput
                      label={<div className="font-bold">Updated At</div>}
                      variant="filled"
                      readOnly
                      {...form.getInputProps("updatedAt")}
                    />
                  </div>

                  <div>
                    <Textarea
                      variant="filled"
                      label={<div className="font-bold">Description</div>}
                      {...form.getInputProps("description")}
                    />
                  </div>
                  <div>
                    <div className=" flex flex-row space-x-4">
                      <SimpleGrid
                        className=""
                        cols={3}
                        breakpoints={[
                          { maxWidth: "md", cols: 2 },
                          { maxWidth: "xs", cols: 1 },
                        ]}
                      >
                        {" "}
                        {imageUrls.map((item: any, index: any) => (
                          <div className={`flex  flex-col  p-2`}>
                            <div className="flex mb-2 flex-row space-x-2 items-end justify-end">
                              <Tooltip label="Delete">
                                <ActionIcon
                                  size={20}
                                  color="red"
                                  onClick={() => deleteImages(index)}
                                >
                                  <Trash />
                                </ActionIcon>
                              </Tooltip>
                            </div>
                            <div className="flex  space-x-2">
                              <Image width={"100%"} height={90} src={item} />
                            </div>
                          </div>
                        ))}
                      </SimpleGrid>
                    </div>
                  </div>
                  <div>
                    <FileButton
                      onChange={(e: any) => {
                        setFile(e);
                      }}
                      accept="image/png,image/jpeg,image/avif"
                      multiple
                    >
                      {(props) => (
                        <Button
                          className=""
                          color="gray"
                          leftIcon={<ImAttachment />}
                          {...form.getInputProps("files")}
                          {...props}
                        >
                          Attach Files
                        </Button>
                      )}
                    </FileButton>
                  </div>
                  <div className="flex flex-row space-x-2 justify-between">
                    <Drawer
                      opened={imageOpen}
                      onClose={() => {
                        setImageOpen(false);
                      }}
                      position="bottom"
                      title={
                        <div className="font-bold">
                          <Button onClick={buttonDownload}>
                            Download Image
                          </Button>
                        </div>
                      }
                      className="bg-black"
                      padding="sm"
                      size="100%"
                    >
                      <TransformWrapper
                        initialScale={1}
                        initialPositionX={1}
                        initialPositionY={1}
                      >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                          <>
                            <div
                              style={{
                                width: "70%",
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                              className="flex items-center  justify-center"
                            >
                              <TransformComponent>
                                <Image
                                  className="items-center	ml-44"
                                  width={"100%"}
                                  height={500}
                                  src={
                                    imageUrl +
                                    `${`${task.TaskImages[selectedImage].image}`}`
                                  }
                                />
                              </TransformComponent>
                            </div>
                            <div className="w-full space-x-3 text-center fixed bottom-0 right-0">
                              <button onClick={() => zoomIn()}>
                                <ZoomIn
                                  className="bg-white  text-black"
                                  size={24}
                                />
                              </button>
                              <button onClick={() => zoomOut()}>
                                <ZoomOut
                                  className="bg-white  text-black"
                                  size={24}
                                />
                              </button>
                              <button onClick={() => resetTransform()}>
                                <ZoomReset
                                  className="bg-white  text-black"
                                  size={24}
                                />
                              </button>
                            </div>
                          </>
                        )}
                      </TransformWrapper>
                    </Drawer>
                    {taskFile === null ? (
                      <></>
                    ) : (
                      <div className=" flex flex-row space-x-4">
                        <SimpleGrid
                          className=""
                          cols={3}
                          breakpoints={[
                            { maxWidth: "md", cols: 2 },
                            { maxWidth: "xs", cols: 1 },
                          ]}
                        >
                          {" "}
                          {taskFile.map((item: any, index: number) => (
                            <div className={`flex  flex-col  p-2`}>
                              <div className="flex mb-2 flex-row space-x-2 justify-end">
                                <Tooltip label="Download">
                                  <ActionIcon
                                    size={20}
                                    onClick={() => downloadImage(index)}
                                    color="blue"
                                  >
                                    <Download />
                                  </ActionIcon>
                                </Tooltip>

                                <Tooltip label="Delete">
                                  <ActionIcon
                                    size={20}
                                    onClick={() => {
                                      openConfirmationModal(selectedImage);
                                      setSelectedImage(index);
                                    }}
                                    color="red"
                                  >
                                    <Trash />
                                  </ActionIcon>
                                </Tooltip>
                              </div>
                              <div className="flex  space-x-2">
                                <Image
                                  width={"100%"}
                                  height={90}
                                  onClick={() => {
                                    setImageOpen(true), setSelectedImage(index);
                                  }}
                                  src={imageUrl + `${`${item?.image}`}`}
                                />
                              </div>
                            </div>
                          ))}
                        </SimpleGrid>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end flex-row">
                    <Button className="w-full" type="submit">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </ScrollArea>
        </Drawer>
        <Button
          onClick={() => setOpened(true)}
          compact
          variant="light"
          size="xs"
          leftIcon={<Edit size={16} />}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}

export default TaskEdit;
