import { SecretValidateResult, getService } from "./config";
import { getPref, getPrefJSON, setPref } from "./prefs";

export function getServiceSecret(serviceId: string) {
  try {
    return getPrefJSON("secretObj")[serviceId] || "";
  } catch (e) {
    setPref("secretObj", "{}");
    return "";
  }
}

export function setServiceSecret(serviceId: string, secret: string) {
  let secrets;
  try {
    secrets = getPrefJSON("secretObj");
  } catch (e) {
    secrets = {};
  }
  secrets[serviceId] = secret;
  setPref("secretObj", JSON.stringify(secrets));
}

export function validateServiceSecret(
  serviceId: string,
  validateCallback?: (result: SecretValidateResult) => void,
): SecretValidateResult {
  const secret = getServiceSecret(serviceId);
  const validator = getService(serviceId).secretValidator;
  if (!validator) {
    return { secret, status: true, info: "" };
  }
  const validateResult = validator(secret);
  if (validateCallback) {
    validateCallback(validateResult);
  }
  return validateResult;
}
