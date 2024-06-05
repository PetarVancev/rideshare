const crypto = require("crypto");

const storekey = process.env.PAY_STORE_KEY;

const generateHash = (objData, storeKey) => {
  const expectedParams = Object.keys(objData)
    .filter(
      (key) =>
        key.toLowerCase() !== "hash" &&
        key.toLowerCase() !== "encoding" &&
        key.toLowerCase() !== "countdown"
    )
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const sortedPairs = expectedParams
    .map((key) => {
      let value = objData[key];
      if (value == null) value = "";
      value = String(value);
      // Escape backslashes and pipes
      return `${value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|")}|`;
    })
    .join("");

  // Append storeKey
  const hashVal =
    sortedPairs + storeKey.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");

  // Generate hash using SHA-512 algorithm
  const hash = crypto.createHash("sha512").update(hashVal).digest("base64");

  return hash;
};

const processPayment = async (paymentData) => {
  paymentData.clientid = process.env.PAY_CLIENT_ID;
  paymentData.currency = 807;
  paymentData.TranType = "Auth";
  paymentData.Instalment = "";
  paymentData.storetype = "3D_PAY_HOSTING";
  paymentData.lang = "mk";
  paymentData.hashAlgorithm = "ver3";
  paymentData.BillToName = "name";
  paymentData.BillToCompany = "company";
  paymentData.refreshtime = 5;
  paymentData.rnd = new Date().toISOString();
  paymentData.encoding = "UTF-8";

  const hash = generateHash(paymentData, storekey);

  paymentData.hash = hash;

  return paymentData;
};

const isValidPayment = (paymentData) => {
  const expectedHash = paymentData.HASH;
  const hash = generateHash(paymentData, storekey);

  if (hash == expectedHash) {
    return true;
  } else {
    return false;
  }
};

module.exports = { processPayment, isValidPayment };
