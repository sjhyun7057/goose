import axios from "axios";

export default axios.create({
  baseURL: "http://i7c209.p.ssafy.io:8080/api/v1",
  headers: {
    "Content-type": "application/json",
  },
});