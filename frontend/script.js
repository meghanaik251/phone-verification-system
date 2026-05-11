const BASE_URL = "http://localhost:3000/api/auth";



async function sendOTP() {

let phone =
  document.getElementById("phone").value;

if (!phone.startsWith("+91")) {
  phone = "+91" + phone;
}
  try {

    const response = await fetch(
      `${BASE_URL}/send-otp`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ phone })
      }
    );

    const data = await response.json();

    document.getElementById("message").innerText =
      data.message;

  } catch (err) {

    document.getElementById("message").innerText =
      err.message;

  }
}




async function verifyOTP() {

  let phone =
    document.getElementById("phone").value;

  if (!phone.startsWith("+91")) {
    phone = "+91" + phone;
  }

  const otp =
    document.getElementById("otp").value;

  try {

    const response = await fetch(
      `${BASE_URL}/verify-otp`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          phone,
          otp
        })
      }
    );

    const data = await response.json();

    document.getElementById("message").innerText =
      data.message;

    console.log("JWT Token:", data.token);

  } catch (err) {

    document.getElementById("message").innerText =
      err.message;

  }
}