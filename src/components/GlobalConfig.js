// const app_url = "http://127.0.0.1:8000/api/"
const app_url = "https://bmkbck.herokuapp.com/api/"
const headers = {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    'Content-type': 'application/json; charset=UTF-8'
}

export { app_url, headers }