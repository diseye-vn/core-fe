export const Message = (props:any) => {
    console.log('props', props)
  return (
    <div className={`mt-6 flex items-center p-3.5 rounded ${props.message.error && 'text-danger bg-danger-light dark:bg-danger-dark-light'} ${props.message.success && 'text-success bg-success-light dark:bg-success-dark-light'}  ${(!props.message.error & !props.message.success) && 'text-primary bg-primary-light dark:bg-primary-dark-light' }`}>
      <span className="ltr:pr-2 rtl:pl-2">
        <strong className="ltr:mr-1 rtl:ml-1">{props.message.message}!</strong>
      </span>
      <button
        type="button"
        className="ltr:ml-auto rtl:mr-auto hover:opacity-80"
      >
        <svg
          height="1rem"
          width="1rem"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="1" y1="11" x2="11" y2="1" stroke="white" stroke-width="2" />
          <line x1="1" y1="1" x2="11" y2="11" stroke="white" stroke-width="2" />
        </svg>{" "}
      </button>
    </div>
  );
};
