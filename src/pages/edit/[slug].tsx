import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setPageTitle } from "../../store/themeConfigSlice";
import { useTranslation } from "react-i18next";
import "tippy.js/dist/tippy.css";
import axios from "axios";
import { AddressInput } from "../../components/Address";
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
    axios
      .get(import.meta.env.VITE_HOST + "/qdocs/" + slug, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRowData(res.data);
        setIsLoading(false);
      });
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
              {rowData.attr.map((item: any, index: any) => {
                if (item.type.toUpperCase() === "STRING") {
                  return (
                    <div className="mb-5" key={index}>
                      <div className="flex">
                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                          {item.name}
                        </div>
                        <input
                          type="text"
                          placeholder=""
                          onChange={(e) => fromData(item.var, e.target.value)}
                          className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                        />
                      </div>
                    </div>
                  );
                } else if (item.type.toUpperCase() === "ADDRESS") {
                  return (
                    <AddressInput
                      key={index}
                      name={item.name}
                      var={item.var}
                      setAddress={fromData}
                    />
                  );
                }
              })}

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
