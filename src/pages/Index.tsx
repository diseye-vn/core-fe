import FullCalendar from "@fullcalendar/react";
// import '@fullcalendar/core';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../store/themeConfigSlice";
import { useTranslation } from "react-i18next";

import enLocale from "@fullcalendar/core/locales/en-gb";
import vnLocale from "@fullcalendar/core/locales/vi";
import axios from "axios";
import { debug } from "console";
const Index = () => {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle(t("Lịch UMT")));
  });
  const now = new Date();
  const getMonth = (dt: Date, add: number = 0) => {
    let month = dt.getMonth() + 1 + add;
    const str = (month < 10 ? "0" + month : month).toString();
    return str;
    // return dt.getMonth() < 10 ? '0' + month : month;
  };

  const [events, setEvents] = useState<any>();
  const [isAddEventModal, setIsAddEventModal] = useState(false);
  const [minStartDate, setMinStartDate] = useState<any>("");
  const [minEndDate, setMinEndDate] = useState<any>("");
  const [isLoading, setLoading] = useState<any>(true);
  const defaultParams = {
    id: null,
    title: "",
    start: "",
    end: "",
    description: "",
    type: "primary",
  };
  const [params, setParams] = useState<any>(defaultParams);
  const dateFormat = (dt: any) => {
    dt = new Date(dt);
    const month =
      dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
    const date = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
    const hours = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
    const mins = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
    dt = dt.getFullYear() + "-" + month + "-" + date + "T" + hours + ":" + mins;
    return dt;
  };
  const editEvent = (data: any = null) => {
    let params = JSON.parse(JSON.stringify(defaultParams));
    setParams(params);
    if (data) {
      let obj = JSON.parse(JSON.stringify(data.event));
      setParams({
        id: obj.id ? obj.id : null,
        title: obj.title ? obj.title : null,
        start: dateFormat(obj.start),
        end: dateFormat(obj.end),
        type: obj.classNames ? obj.classNames[0] : "primary",
        description: obj.extendedProps ? obj.extendedProps.description : "",
      });
      setMinStartDate(new Date());
      setMinEndDate(dateFormat(obj.start));
    } else {
      setMinStartDate(new Date());
      setMinEndDate(new Date());
    }
    setIsAddEventModal(true);
  };
  
  const editDate = (data: any) => {
      let obj = {
          event: {
              start: data.start,
              end: data.end,
          },
      };
      editEvent(obj);
  };

  const saveEvent = () => {
      if (!params.title) {
          return true;
      }
      if (!params.start) {
          return true;
      }
      if (!params.end) {
          return true;
      }
      if (params.id) {
          //update event
          let dataevent = events || [];
          let event: any = dataevent.find((d: any) => d.id === parseInt(params.id));
          event.title = params.title;
          event.start = params.start;
          event.end = params.end;
          event.description = params.description;
          event.className = params.type;

          setEvents([]);
          setTimeout(() => {
              setEvents(dataevent);
          });
      } else {
          //add event
          let maxEventId = 0;
          if (events) {
              maxEventId = events.reduce((max: number, character: any) => (character.id > max ? character.id : max), events[0].id);
          }
          maxEventId = maxEventId + 1;
          let event = {
              id: maxEventId,
              title: params.title,
              start: params.start,
              end: params.end,
              description: params.description,
              className: params.type,
          };
          let dataevent = events || [];
          dataevent = dataevent.concat([event]);
          setTimeout(() => {
              setEvents(dataevent);
          });
      }
      showMessage('Event has been saved successfully.');
      setIsAddEventModal(false);
  };
  const startDateChange = (event: any) => {
    const dateStr = event.target.value;
    if (dateStr) {
      setMinEndDate(dateFormat(dateStr));
      setParams({ ...params, start: dateStr, end: "" });
    }
  };
  
  const changeValue = (e: any) => {
    const { value, id } = e.target;
    setParams({ ...params, [id]: value });
  };
  const showMessage = (msg = "", type = "success") => {
    const toast: any = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: "toast" },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: "10px 20px",
    });
  };

  const [myLink, setMyLink] = useState("")
  const [ myCalendar, setMyCalendar ]= useState(false);
  useEffect(() => {
    if (!myCalendar) {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://127.0.0.1:3002/courses/me",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      };
      let all_events = [];
      setMyCalendar(true);
      axios
        .request(config)
        .then((response) => {
            setMyLink(response.data.url)
            // debugger;
            // count
            response.data.courses.forEach((element: any, index_count: number) => {
                all_events.push({
                    id: index_count,
                    title: element.ses_coursenameen  ,
                    start: element.ses_start,
                    end: element.ses_stop,
                    className: 'primary',
                    description: element.ses_facultyname + "\r\n" + element.ses_roomname +  "\r\n" + element.ses_institutionclassid,
                },)
            })
            // console.log('all_events', all_events)
            setEvents(all_events);
            setLoading(false);
        })
        .catch((error) => {
            document.cookie = "";
            localStorage.removeItem("token");
            window.location.href = "/login";
          console.log(error);
        });
    }
  }, []);
  function copy_paste_link() {
    
    navigator.clipboard.writeText(myLink);
    console.log('myLink', myLink)
    showMessage(t("copied_link"), "success")

  }

  return (
    <div>
      <div className="panel mb-5">
      {isLoading && <div className="w-full flex">
            <span className="animate-spin border-4 border-transparent border-l-primary rounded-full w-12 h-12 inline-block align-middle m-auto mb-10"></span>

            </div>}
        {!isLoading && <div>
        <div className="mb-4 flex items-center sm:flex-row flex-col sm:justify-between justify-center">
            
            <div className="w-full sm:mb-0 mb-4">
              
              <div className="!font-semibold ltr:sm:text-left rtl:sm:text-right !text-center !text-3xl ">
                
                {t('calendar_title')}
              </div>
              <div className="relative text-right text-sm text-gray-500 dark:text-gray-400">
                <button type="button" onClick={copy_paste_link} className="btn btn-info absolute bottom-0 right-0 hover:bg-teal-200">{t('sync_calendar')}</button>

              </div>
              <div className="flex items-center mt-2 flex-wrap sm:justify-start justify-center">
                <div className="flex items-center ltr:mr-4 rtl:ml-4">
                  <div className="h-2.5 w-2.5 rounded-sm ltr:mr-2 rtl:ml-2 bg-primary"></div>
                  <div>UMT</div>
                </div>
                <div className="flex items-center ltr:mr-4 rtl:ml-4">
                  <div className="h-2.5 w-2.5 rounded-sm ltr:mr-2 rtl:ml-2 bg-success"></div>
                  <div>Personal</div>
                </div>
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-sm ltr:mr-2 rtl:ml-2 bg-danger"></div>
                  <div>Important</div>
                </div>
              </div>
            </div>
          </div>
          <div className="calendar-wrapper">
  
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              editable={true}
              dayMaxEvents={true}
              selectable={false}
              droppable={false}
              events={events}
              eventClick={(event: any) => editEvent(event)}
              select={(event: any) => editDate(event)}
              
              locales={[enLocale, vnLocale]}
              locale={i18n.language === "en" ? "en-gb" : "vi"}
            />
          </div>
        </div>}
      </div>

      {/* add event modal */}
      <Transition appear show={isAddEventModal} as={Fragment}>
                <Dialog as="div" onClose={() => setIsAddEventModal(false)} open={isAddEventModal} className="relative z-[51]">
                    <Transition.Child
                        as={Fragment}
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="duration-300 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                        onClick={() => setIsAddEventModal(false)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params.id ? t('event_title') : ''}
                                    </div>
                                    <div className="p-5">
                                        <form className="space-y-5">
                                            <div>
                                                <label htmlFor="title">{t('course_title')}</label>
                                                <input
                                                    id="title"
                                                    type="text"
                                                    name="title"
                                                    className="form-input"
                                                    
                                                    value={params.title || ''}
                                                    onChange={(e) => changeValue(e)}
                                                    disabled
                                                />
                                                <div className="text-danger mt-2" id="titleErr"></div>
                                            </div>

                                            <div>
                                                <label htmlFor="dateStart">{t('course_from')} :</label>
                                                <input
                                                    id="start"
                                                    type="datetime-local"
                                                    name="start"
                                                    className="form-input"
                                                    value={params.start || ''}
                                                    min={minStartDate}
                                                    onChange={(event: any) => startDateChange(event)}
                                                    required
                                                />
                                                <div className="text-danger mt-2" id="startDateErr"></div>
                                            </div>
                                            <div>
                                                <label htmlFor="dateEnd">{t('course_end')} :</label>
                                                <input
                                                    id="end"
                                                    type="datetime-local"
                                                    name="end"
                                                    className="form-input"
                                                    value={params.end || ''}
                                                    min={minEndDate}
                                                    onChange={(e) => changeValue(e)}
                                                    required
                                                />
                                                <div className="text-danger mt-2" id="endDateErr"></div>
                                            </div>
                                            <div>
                                                <label htmlFor="description">{t('course_description')} :</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    className="form-textarea min-h-[130px]"
                                                    value={params.description || ''}
                                                    onChange={(e) => changeValue(e)}
                                                    disabled
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-end items-center !mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setIsAddEventModal(false)}>
                                                    {t('close')}                                            </button>
                                               
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
    </div>
  );
};

export default Index;
