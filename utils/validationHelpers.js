import URISanity from "urisanity";

export function validID(string) {
  // only contains letters(uppercase and lowercase) and numbers
  const regex = /^[A-Za-z0-9]*$/;
  if (
    typeof string === "string" &&
    string.length === 24 &&
    regex.test(string)
  ) {
    return true;
  } else {
    return false;
  }
}
export function validSoilID(string) {
  // only contains letters(uppercase and lowercase) and spaces
  const regex = /^[A-Za-z ]*$/;
  if (typeof string === "string" && string.length <= 50 && regex.test(string)) {
    return true;
  } else {
    return false;
  }
}
export function validEco(string) {
  // only allow numbers in string
  const regex = /^\d+$/;
  if (
    typeof string === "string" &&
    string.length > 0 &&
    string.length < 6 &&
    regex.test(string)
  ) {
    return true;
  } else {
    return false;
  }
}
export function validSearchEco(string) {
  // only allow numbers in string
  const regex = /^\d+$/;
  if (
    (typeof string === "string" &&
      string.length > 0 &&
      string.length < 5 &&
      regex.test(string)) ||
    string === "null"
  ) {
    return true;
  } else {
    return false;
  }
}
export function validName(string) {
  // no special characters
  const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;
  if (
    typeof string === "string" &&
    string.length <= 60 &&
    string.length > 1 &&
    !regex.test(string)
  ) {
    return true;
  } else {
    return false;
  }
}
export function validScientificName(string) {
  // no special characters
  const regex = /[`!@#$%^&*()+=\[\]{};:"\\\|,.<>\/?~]/;
  if (
    typeof string === "string" &&
    string.length <= 60 &&
    string.length > 1 &&
    !regex.test(string)
  ) {
    return true;
  } else {
    return false;
  }
}
export function validSearch(string) {
  // no special characters
  const regex = /[`!@#$%^&*()_+=\[\]{};:"\\\|,.<>\/?~]/;
  if (
    typeof string === "string" &&
    string.length <= 100 &&
    !regex.test(string)
  ) {
    return true;
  } else {
    return false;
  }
}
export function validEmail(string) {
  // sourced from https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts
  // const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
  // );
  // sourced from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#validation
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (typeof string === "string" && regex.test(string)) {
    return true;
  } else {
    return false;
  }
}

export function validImagePluginURL(string) {
  if (typeof string === "string" && /^blob:https?:\/\//.test(string)) {
    return true;
  } else {
    const regex =
      /^https[^\?]*.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)(\?(.*))?$/gim;

    return regex.test(string);
  }
}
export function validVideoPluginURL(string) {
  const youtube =
    /https:\/{2}(m\.|www\.)?(youtube(?:-nocookie|education)?\.com|youtu\.be)\//;

  const vimeo = /https:\/{2}(www\.|player\.)?vimeo.com\//;

  // const facebook =
  //   /https:\/{2}(www\.)?(fb\.watch|facebook.com)(\/)(video(s)?|watch|story)?(\/)?/;

  const twitch = /https:\/{2}(www\.|go|clips\.)?twitch\.tv(\/)/;

  const dailymotion = /https:\/{2}(www\.)?(dai.ly|dailymotion.com)(\/)/;

  if (
    typeof string === "string" &&
    (youtube.test(string) ||
      vimeo.test(string) ||
      // facebook.test(string) ||
      twitch.test(string) ||
      dailymotion.test(string))
  ) {
    return true;
  } else {
    return false;
  }
}

export function validKey(string) {
  const regex = /^[A-Za-z0-9]*$/;
  const key = string.substring(0, string.indexOf("."));
  if (typeof string === "string" && key.length === 32 && regex.test(key)) {
    return true;
  } else {
    return false;
  }
}

export function validURL(url) {
  const valid = URISanity.vet(url, {
    allowWebTransportURI: true,
  });

  if (valid === "about:blank") {
    return false;
  } else {
    return true;
  }
}
export function validStatInputs(v1, v2) {
  const options = [
    "kingdom",
    "phylum",
    "class",
    "order",
    "family",
    "genus",
    "species_type",
    "all species",
  ];

  if (v2 === undefined) {
    return options.includes(v1);
  } else {
    // if(options.includes(v1) && typeof v2 === 'string'){
    //   return true
    // } else {
    return options.includes(v1) && typeof v2 === "string";
    // }
  }
}
