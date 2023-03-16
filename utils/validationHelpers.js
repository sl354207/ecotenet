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
export function validEco(string) {
  // only allow numbers
  const regex = /^\d+$/;
  return regex.test(string);
}
export function validName(string) {
  // no special characters
  const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;
  if (
    typeof string === "string" &&
    string.length <= 60 &&
    !regex.test(string)
  ) {
    return true;
  } else {
    return false;
  }
}
export function validSearch(string) {
  // no special characters
  const regex = /[`!@#$%^&*()_+\-=\[\]{};:"\\\|,.<>\/?~]/;
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
  if (regex.test(string)) {
    return true;
  } else {
    return false;
  }
}

export function validImagePluginURL(string) {
  if (/^blob:https?:\/\//.test(string)) {
    // console.log("true blob");
    return true;
  } else {
    const regex =
      /^http[^\?]*.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)(\?(.*))?$/gim;
    return regex.test(string);
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
