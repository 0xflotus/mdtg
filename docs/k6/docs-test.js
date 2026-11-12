import { check } from "k6";
import http from "k6/http";

export const options = {
  vus: 5,
  iterations: 3,
  thresholds: {
    checks: ["rate>0.99"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get("https://0xflotus.is-a.dev/mdtg");

  check(res, {
    "HTTP-Status is 200": (r) => r.status === 200,
    "Title is Military date-time groups | MDTG": (r) => r.body.includes("<title>Military date-time groups | MDTG</title>"),
  });
}
