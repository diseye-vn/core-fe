
const Logout = () => {
  document.cookie = "";
  localStorage.removeItem('token')
  window.location.href = '/login'
  return (<>Logging out</>)
};

export default Logout;
