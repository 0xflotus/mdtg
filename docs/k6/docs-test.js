import { check } from "k6";
import http from "k6/http";

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    checks: ["rate>=0.75"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get("https://0xflotus.is-a.dev/mdtg");

  check(res, {
    "HTTP-Status is 200": (r) => r.status === 200,
  });
}
