import React, { useEffect } from "react";
import { useCallback, useState } from "react";
import { global } from "./Config";

// Common function toggle
export default function useToggle(initialValue = false) {
  const [value, setValue] = React.useState(initialValue);
  const toggle = React.useCallback(() => {
    setValue((v) => !v);
  }, []);
  return [value, toggle];
}

export function addBodyClass(className) {
  return () =>
    useEffect(() => {
      document.body.className = className;
      return () => {
        document.body.className = "no-bg";
      };
    });
}

export function stringLimit(string, counts) {
  var text = string;
  var count = counts;
  var result = text.slice(0, count) + (text.length > count ? "**********" : "");
  return result;
}

export function setStorage(key, value) {
  return localStorage.setItem(key, value);
}

export function removeStorage(key) {
  return localStorage.removeItem(key);
}

export function randomString(len = 5) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export const removeDublicateFrds = (friendList) => {
  friendList.forEach((data_outer, i) => {
    let count = 0;
    friendList.forEach((data_inner, j) => {
      if (data_inner.user_id == data_outer.user_id) {
        count += 1;
        if (count > 1) {
          friendList.splice(j, 1);
        }
      }
    });
  });
  return friendList;
};

export const addDefaultSrc = (ev) => {
  ev.target.src = "/assets/images/image-placeholder.jpg";
};

export const returnDefaultImage = (ev) => {
  return "/assets/images/image-placeholder.jpg";
};

export const checkLiveDomain = () => {
  // if (window.location.hostname === "indeedtraining.in") {
  return true;
  // }
  // return false
};

export const changeImageLinkDomain = () => {
  // if (window.location.hostname === "indeedtraining.in") {
  return "https://indeedtraining.in/glitter-101/public/profile_images/";
  // }
  // return "http://167.172.209.57/glitter-101/public/profile_images/"
};

export const changeGiftLinkDomain = () => {
  // if (window.location.hostname === "indeedtraining.in") {
  return "https://indeedtraining.in/glitter-101/public/gifts_icons/";
  // }
  // return "http://167.172.209.57/glitter-101/public/gifts_icons/"
};

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
}

// owl Coursel
export const home_crousal = {
  loop: true,
  margin: 0,
  nav: true,
  autoplay: true,
  slideTransition: "linear",
  autoplayTimeout: 5000,
  smartSpeed: 500,
  autoplayHoverPause: false,
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 1,
    },
    1000: {
      items: 1,
    },
  },
};

export const promise = {
  loop: true,
  margin: 0,
  nav: true,
  autoplay: true,
  autoplayTimeout: 3000,

  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 1,
    },
    1000: {
      items: 1,
    },
  },
};

export const news = {
  margin: 35,
  nav: true,
  dots: false,
  autoplay: true,
  autoplayTimeout: 3000,

  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 1,
    },
    1000: {
      items: 3,
    },
  },
};

// courses
export const owlCourses = {
  loop: false,
  // margin:10,
  nav: false,
  dots: false,
  mouseDrag: false,
  autoplay: false,
  responsive: {
    0: {
      mouseDrag: true,
      nav: false,
      items: 1,
    },
    600: {
      mouseDrag: true,
      nav: false,
      items: 2,
    },
    1000: {
      items: 5,
    },
    16080: {
      items: 5,
    },
  },
};

// End Owl crousel
export function getIDFromArrayOfObject(input, field) {
  var output = [];
  for (var i = 0; i < input.length; ++i) output.push(input[i][field]);
  return output;
}

// validate email address
export function validateEmail(email) {
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
}

//get Test date in formate (DD MMM YYYY)
export const getTestDate = (testDate) => {
  const options = { month: "short", day: "2-digit", year: "numeric" };
  return new Date(testDate).toLocaleDateString("en-GB", options);
};

//   remove tags from content
export const removeTags = (content) => {
  return content.replace(/<[^>]+>/g, "");
};

//  changed to 2 decimal places
export const toDecimal = (value) => {
  var val = parseFloat(value);
  val = Math.round(val * 100) / 100; // 10 defines 1 decimals, 100 for 2, 1000 for 3
  return val;
};

// formate time
export const formatTime = (time) => {
  return String(time).padStart(2, "0");
};

// image return with url google or default
export const returnImageType = (img) => {
  const fileName = img.split(".");
  const imageFormat = fileName[fileName.length - 1];
  if (
    imageFormat === "png" ||
    imageFormat === "jpg" ||
    imageFormat === "jpeg" ||
    imageFormat === "PNG" ||
    imageFormat === "JPG" ||
    imageFormat === "JPEG"
  ) {
    return `${global.API_HOST}assets/images/profile_images/` + img;
  } else {
    return img;
  }
};
