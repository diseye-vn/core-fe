import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setPageTitle } from "../store/themeConfigSlice";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ImageUploading, { ImageListType } from "react-images-uploading";
import IconX from "../components/Icon/IconX";
import IconMultipleForwardRight from "../components/Icon/IconMultipleForwardRight";
import HeaderImage from "../components/header";

const Index = () => {
  const [images2, setImages2] = useState<any>([]);
  const [uploadedImages, setUploadedImages] = useState<any>([]);
  const maxNumber = 69;

  const onChange2 = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    if (!addUpdateIndex || addUpdateIndex.length === 0) {
      // No new images were added or updated, so do nothing
      return;
    }

    setIsLoadingUpload(true);

    // Upload only new or updated images
    addUpdateIndex.forEach((index) => {
      const image = imageList[index];
      const formData = new FormData();
      formData.append("file", image.file as Blob);

      fetch(import.meta.env.VITE_HOST + "/file/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          fetch(import.meta.env.VITE_HOST + "/images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              image: data.data.filename,
            }),
          })
            .then((res) => res.json())
            .then((upload_server) => {
              console.log("first", upload_server);
            }),
            console.log("data", data);
          // You might want to update your state or do something with the response
        })
        .catch((error) => console.error("Error:", error));
    });

    setImages2(imageList as never[]);

    setIsLoadingUpload(false);
  };
  const { t, i18n } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(true);

  // const [rowData, setRowData] = useState<any>([]);
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_HOST + "/images", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    dispatch(setPageTitle(t("Tải ảnh mới lên")));
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
          <div className="mb-5">
            <div
              className="custom-file-container"
              data-upload-id="mySecondImage"
            >
              <div className="label-container">
                <label>Upload </label>
                <button
                  type="button"
                  className="custom-file-container__image-clear"
                  title="Clear Image"
                  onClick={() => {
                    setImages2([]);
                  }}
                >
                  ×
                </button>
              </div>
              <label className="custom-file-container__custom-file"></label>
              <input
                type="file"
                className="custom-file-container__custom-file__custom-file-input"
                accept="image/*"
              />
              <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
              <ImageUploading
                multiple
                value={images2}
                onChange={onChange2}
                maxNumber={maxNumber}
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="upload__image-wrapper">
                    <button
                      className="custom-file-container__custom-file__custom-file-control"
                      onClick={onImageUpload}
                    >
                      Choose File...
                    </button>
                    &nbsp;
                    <div className="grid gap-4 sm:grid-cols-3 grid-cols-1">
                      {imageList.map((image, index) => (
                        <div
                          key={index}
                          className="custom-file-container__image-preview relative"
                        >
                          <button
                            type="button"
                            className="custom-file-container__image-clear bg-dark-light dark:bg-dark dark:text-white-dark rounded-full block w-fit p-0.5 absolute top-0 left-0"
                            title="Clear Image"
                            onClick={() => onImageRemove(index)}
                          >
                            <IconX className="w-3 h-3" />
                          </button>
                          <img
                            src={image.dataURL}
                            alt="img"
                            className="object-cover shadow rounded w-full !max-h-48"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ImageUploading>
              {isLoadingUpload && (
                <img
                  src="/assets/images/loading.svg"
                  className="max-w-md w-full m-auto mb-8"
                  alt=""
                  style={{ height: "100px" }}
                />
              )}
              {images2.length === 0 && !isLoadingUpload ? (
                <img
                  src="/assets/images/file-preview.svg"
                  className="max-w-md w-full m-auto"
                  alt=""
                />
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
