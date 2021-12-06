import { useEffect } from "react";
import Favico from "favico.js-slevomat";

let favicon = new Favico({
  animation: "pop",
});

export const useFavicon = (requestNumber: number) => {
  useEffect(() => {
    // adds favicon badge and shows number of requests in parentheses
    if (requestNumber > 0) {
      favicon.badge(requestNumber);
      document.title = `(${requestNumber}) Memory`;
    } else {
      favicon.reset();
      document.title = `Memory`;
    }
  }, [requestNumber]);
};
