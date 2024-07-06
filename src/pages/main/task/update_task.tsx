/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import {
  ActionIcon,
  Button,
  Drawer,
  FileButton,
  Group,
  LoadingOverlay,
  Modal,
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
import { showNotification } from "@mantine/notifications";

function TaskEdit({ task }: any) {
  const { id } = useParams();
  const [opened, setOpened] = useState(false);
  const [imageUrls, setImageUrls] = useState<any>([]);
  const [modalsOpen, setModalsOpen] = useState(false);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [imageOpen, setImageOpen] = useState(false);
  const [assignedId, setAssignedId] = useState<any[]>([]);
  const [activePage, setPage] = useState<any>(1);
  const [userName, setUserName] = useState<string | null>(null);
  const [statusId, setStatusId] = useState<string | null>(null);
  const [taskFile, setTaskFile] = useState<any>([]);
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
      id: "",
    },
    validate: {},
  });

  async function fetchUsers() {
    const params = {
      page: 0,
      searchRef: "",
    };
    const result = await apiProvider.fetchUserData(params);
    if (result != null) {
      setAssignedId(result.data.data?.data ?? []);
      getUserName();
      getStatusId();
    }
    return null;
  }

  function getUserName(): any {
    let userName = task?.userOnTeams.map(
      (e: any) => `${e?.assignees?.id ?? []}`
    );
    let userNames = task?.userOnTeams.map(
      (e: any) => `${e?.assignees?.lastName ?? []}`
    );
    setUserName(userName);
  }

  function getStatusId(): any {
    setStatusId(`${task.statusId ?? 0}`);
  }

  function changeAssignedName(val: any) {
    form.setFieldValue("userName", val);
    setUserName(val);
  }

  function changeStatus(val: any) {
    form.setFieldValue("statusId", val);
    setStatusId(val);
  }

  function ClearForm() {
    setImageUrls([]);
  }

  function projectTitle() {
    const projectName = task?.title;
    setProjectName(projectName);
  }

  function setImage() {
    setTaskFile((task.images?.length ?? 0) > 0 ? task.images : null);
  }

  const onSubmit = async (values: typeof form.values) => {
    setLoading(true);
    const formData: any = new FormData();
    file.forEach((file) => {
      formData.append("files", file);
    });
    taskFile.forEach((file: File[]) => {
      formData.append("files", file);
    });
    formData.append("status", statusId === null ? task?.statusId : +statusId);
    formData.append("projectId", +task.projectId);
    formData.append("taskCreatorId", +task?.taskCreatorId);
    formData.append("title", values.tasktitle);
    formData.append("description", values.description);
    values?.taskAssigneeId.forEach((item, index) => {
      formData.append(`taskAssigneeId[${index}]`, item);
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
    let userName = task?.userOnTeams.map(
      (e: any) => `${e?.assignees?.id ?? []}`
    );
    let userNames = task?.userOnTeams.map(
      (e: any) => `${e?.assignees?.firstName ?? []}`
    );
    form.setFieldValue("tasktitle", task.title);
    form.setFieldValue("description", task.description);
    form.setFieldValue("taskAssigneeId", userName);
    form.setFieldValue("status", task.statusId.toString());
    form.setFieldValue("type", task.typeId === 1 ? "1" : "2");
    form.setFieldValue(
      "createdAt",
      moment(task.createdAt.toString()).format("DD MMMM YYYY, h:mm a")
    );
    form.setFieldValue(
      "updatedAt",
      moment(task.updatedAt.toString()).format("DD MMMM YYYY, h:mm a")
    );
  }

  const deleteImage = async (index: number) => {
    try {
      const result = await ApiClient.patch<any | null>(
        `/task/image/${task.images[index].id}`
      );
      let statusCode = result.status ?? 0;
      let message = result.data?.message ?? "Something went wrong";
      let successMessage = "Image deleted successfully";
      setTaskFile((images: any) => {
        return images.filter((value: any, i: any) => i !== index);
      });
      if (statusCode == 200) {
        setModalsOpen(false);
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
  };

  const downloadImage = (index: any) => {
    saveAs(
      imageUrl + `${task.images[index].file}`,
      `${task.images[index].file}`
    );
  };

  const buttonDownload = () => {
    saveAs(
      imageUrl + `${task.images[selectedImage].file}`,
      `${task.images[selectedImage].file}`
    );
  };

  function deleteImages(e: any) {
    setFile((index: any) => {
      return index.filter((value: any, i: any) => i !== e);
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
                    />
                  </div>

                  <div className="w-full ">
                    <MultiSelect
                      label={<div className="font-bold">Assignee</div>}
                      {...form.getInputProps("taskAssigneeId")}
                      variant="filled"
                      onChange={changeAssignedName}
                      placeholder="Select Name"
                      data={assignedId?.map((item: any) => ({
                        value: (item.id ?? 0).toString(),
                        label: item.firstName ?? "",
                      }))}
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
                        setImageOpen(false), setZoomFactor(1);
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
                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
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
                                    `${`${task.images[selectedImage].file}`}`
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
                                      setModalsOpen(true);
                                      setSelectedImage(index);
                                    }}
                                    color="red"
                                  >
                                    <Modal
                                      opened={modalsOpen}
                                      onClose={() => setModalsOpen(false)}
                                      title="Delete Image"
                                    >
                                      <div color="gray">
                                        Are you sure, Do you want to delete?
                                      </div>
                                      <Group className="flex justify-end">
                                        <Button
                                          variant="default"
                                          onClick={() => setModalsOpen(false)}
                                          mt="md"
                                        >
                                          No
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            deleteImage(selectedImage),
                                              setModalsOpen(false);
                                          }}
                                          mt="md"
                                        >
                                          Yes
                                        </Button>
                                      </Group>
                                    </Modal>
                                    <Trash />
                                  </ActionIcon>
                                </Tooltip>
                              </div>
                              <div className="flex  space-x-2">
                                <Image
                                  width={"100%"}
                                  height={90}
                                  onClick={(e: any) => {
                                    setImageOpen(true), setSelectedImage(index);
                                  }}
                                  src={imageUrl + `${`${item.file}`}`}
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
