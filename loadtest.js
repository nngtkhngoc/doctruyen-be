import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 10000, // virtual users
  duration: "30s", // how long to run
};

export default function () {
  http.get("http://[::1]:5173");
  sleep(1); // simulate user think time
}
