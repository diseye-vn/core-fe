import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setPageTitle } from "../store/themeConfigSlice";
import { useTranslation } from "react-i18next";
import { DataTable } from "mantine-datatable";
import axios from "axios";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconDownload from "../components/Icon/IconDownload";

const History = () => {
  const { t, i18n } = useTranslation();
  const [rowData, setRowData] = useState<any>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [rowData, setRowData] = useState<any>([]);
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = rowData.slice(0, pageSize);
  const [recordsData, setRecordsData] = useState(initialRecords);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_HOST + "/images", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRowData(res.data);
        setIsLoading(false);

        // console.log("res", res.data);
        setPageSize(pageSize + 1);
      });
  }, []);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(rowData.slice(from, to));
  }, [page, pageSize]);
  useEffect(() => {
    dispatch(setPageTitle(t("Danh sách các file")));
  });

  return (
    <div>
      <div className="panel mb-5">
        {isLoading && (
          <div className="w-full flex">
            <span className="animate-spin border-4 border-transparent border-l-primary rounded-full w-12 h-12 inline-block align-middle m-auto mb-10"></span>
          </div>
        )}
        {!isLoading && (
          <DataTable
            noRecordsText="Không có mẫu nào"
            highlightOnHover
            className="table-hover whitespace-nowrap"
            records={recordsData}
            columns={[
              { accessor: "_id", title: "ID" },

              {
                accessor: "image",
                title: "Ảnh",
                titleClassName: "!text-center",
                render: (id: { _id: string; image: string }) => (
                  <div className="mx-auto flex w-max items-center">
                    <img
                      className="w-auto h-20 rounded-md"
                      key={id._id}
                      src={import.meta.env.VITE_HOST + "/file/view/" + id.image}
                    />
                  </div>
                ),
              },

              {
                accessor: "image",
                title: "Kết quả",
                titleClassName: "!text-center",
                render: (id: { _id: string; result: string }) =>
                  id.result !== "-" ? (
                    <div className="mx-auto flex w-max items-center">
                      <img
                        className="w-auto h-20 rounded-md"
                        key={id._id}
                        src={
                          import.meta.env.VITE_HOST + "/file/view/" + id.result
                        }
                        alt="Image"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto flex w-auto justify-center items-center">
                      <div className="flex items-center justify-center w-full h-20  bg-gray-300 rounded  dark:bg-gray-700">
                        <svg
                          className="w-10 h-10 text-gray-200 dark:text-gray-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                      </div>
                    </div>
                  ),
              },
              {
                accessor: "status",
                title: "Trạng thái",
                titleClassName: "!flex !justify-center",
                render: (id: any) => {
                  let statusBadge;

                  switch (id.status) {
                    case "NEW":
                      statusBadge = (
                        <span className="badge bg-dark">{id.status}</span>
                      );
                      break;

                    case "PROCESSING":
                      statusBadge = (
                        <span className="badge bg-primary">{id.status}</span>
                      );
                      break;
                    case "DONE":
                      statusBadge = (
                        <span className="badge bg-success">{id.status}</span>
                      );
                      break;
                    case "FAIL":
                      statusBadge = (
                        <span className="badge bg-danger">{id.status}</span>
                      );
                      break;
                    default:
                      statusBadge = (
                        <span className="badge bg-dark">{id.status}</span>
                      );
                      break;
                  }

                  return (
                    <div className="flex justify-center">{statusBadge}</div>
                  );
                },
              },

              {
                accessor: "_id",
                title: "Xem tài liệu",
                titleClassName: "!text-center",
                render: (id: { _id: string }) => (
                  <div className="mx-auto flex w-max items-center">
                    <Tippy content="Tải về">
                      <a href={`edit/${id._id}`}>
                        <IconDownload />
                      </a>
                    </Tippy>
                  </div>
                ),
              },
              { accessor: "createdBy", title: "Người tạo" },
            ]}
            totalRecords={rowData.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => setPage(p)}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            minHeight={200}
            paginationText={({ from, to, totalRecords }) =>
              `Hiển thị  ${from} từ ${to} trên ${totalRecords}`
            }
          />
        )}
      </div>
    </div>
  );
};

export default History;
