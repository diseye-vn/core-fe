import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import "tippy.js/dist/tippy.css";
import axios from "axios";
import { setPageTitle } from "../store/themeConfigSlice";
const PageEdit = () => {
  const { t, i18n } = useTranslation();
  const [rowData, setRowData] = useState<any>([]);
  //create useRouter
  const [data, setData] = useState<any>([]);

  const fromData = (attr: string, value: string) => {
    setData({
      ...data,
      [attr]: value,
    });
  };
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [rowData, setRowData] = useState<any>([]);
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();
  useEffect(() => {
    const slug = window.location.pathname.split("/")[2].split("?")[0];
    // axios
    //   .get(import.meta.env.VITE_HOST + "/qdocs/" + slug, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((res) => {
    //     setRowData(res.data);
    //     setIsLoading(false);
    //   });
  }, []);

  useEffect(() => {
    dispatch(setPageTitle(t("Danh sách các file")));
    // setIsLoading(false);
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
          <div>
            <div className="pb-10">
              <h1 className="pb-4 font-bold">Mẫu hợp đồng số {rowData.name}</h1>

              <p>{rowData.description}</p>
            </div>
            <div>
              <button type="button" className="btn btn-primary">
                Tạo mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageEdit;
