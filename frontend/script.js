const BASE_URL = window.APP_CONFIG.API_URL;

let timerInterval = null;
let otpExpiryTime = null;

// Input validation functions
function validatePhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

function validateOTP(otp) {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
}

// Real-time phone input validation
document.getElementById('phone').addEventListener('input', function (e) {
  let phone = e.target.value;
  phone = phone.replace(/\D/g, ''); // Remove non-digits
  if (phone.length > 10) phone = phone.slice(0, 10);
  e.target.value = phone;

  const phoneError = document.getElementById('phoneError');
  if (phone.length > 0 && !validatePhone(phone)) {
    phoneError.textContent = 'Please enter a valid 10-digit mobile number (starts with 6-9)';
    e.target.classList.add('error');
  } else {
    phoneError.textContent = '';
    e.target.classList.remove('error');
  }
});

// Real-time OTP input validation
document.getElementById('otp').addEventListener('input', function (e) {
  let otp = e.target.value;
  otp = otp.replace(/\D/g, ''); // Remove non-digits
  if (otp.length > 6) otp = otp.slice(0, 6);
  e.target.value = otp;

  const otpError = document.getElementById('otpError');
  if (otp.length > 0 && !validateOTP(otp)) {
    otpError.textContent = 'OTP must be 6 digits';
    e.target.classList.add('error');
  } else {
    otpError.textContent = '';
    e.target.classList.remove('error');
  }
});

function startTimer(expiryTime) {
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  const timerElement = document.getElementById('timer');
  const timerContainer = document.getElementById('timerContainer');
  const verifyBtn = document.getElementById('verifyOtpBtn');

  timerContainer.style.display = 'block';
  verifyBtn.disabled = false;

  timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = expiryTime - now;

    if (distance <= 0) {
      // Timer expired
      clearInterval(timerInterval);
      timerContainer.style.display = 'none';
      verifyBtn.disabled = true;
      showMessage('OTP has expired. Please request a new OTP.', 'error');

      // Clear OTP input
      document.getElementById('otp').value = '';
    } else {
      // Calculate minutes and seconds
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // Change timer color to red when less than 30 seconds
      if (distance < 30000) {
        timerElement.style.color = '#e74c3c';
        timerElement.style.fontWeight = 'bold';
      }
    }
  }, 1000);
}

function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;

  // Auto-hide success/info messages after 5 seconds
  if (type !== 'error') {
    setTimeout(() => {
      if (messageDiv.textContent === message) {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
      }
    }, 5000);
  }
}

async function sendOTP() {
  let phone = document.getElementById('phone').value;
  const sendBtn = document.getElementById('sendOtpBtn');
  const phoneError = document.getElementById('phoneError');

  // Clear previous messages
  showMessage('', '');

  // Validate phone number
  if (!phone) {
    phoneError.textContent = 'Please enter your phone number';
    document.getElementById('phone').classList.add('error');
    return;
  }

  if (!validatePhone(phone)) {
    phoneError.textContent = 'Please enter a valid 10-digit mobile number starting with 6-9';
    document.getElementById('phone').classList.add('error');
    return;
  }

  // Format phone number with +91
  const formattedPhone = '+91' + phone;

  // Disable send button during request
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  try {
    const response = await fetch(`${BASE_URL}/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ phone: formattedPhone })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(data.message, 'success');

      // Start timer if expiry time is provided
      if (data.expiryTime) {
        otpExpiryTime = new Date(data.expiryTime).getTime();
        startTimer(otpExpiryTime);
      }

      // Clear OTP input
      document.getElementById('otp').value = '';
      document.getElementById('otpError').textContent = '';

      // Focus on OTP input
      document.getElementById('otp').focus();
    } else {
      showMessage(data.message || 'Failed to send OTP', 'error');
      // Reset timer if there was an error
      document.getElementById('timerContainer').style.display = 'none';
      document.getElementById('verifyOtpBtn').disabled = true;
    }
  } catch (err) {
    console.error('Send OTP Error:', err);
    showMessage('Network error. Please check your connection.', 'error');
  } finally {
    // Re-enable send button after 2 seconds (cooldown)
    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send OTP';
    }, 2000);
  }
}

async function verifyOTP() {
  let phone = document.getElementById('phone').value;
  const otp = document.getElementById('otp').value;
  const verifyBtn = document.getElementById('verifyOtpBtn');
  const otpError = document.getElementById('otpError');

  // Clear previous messages
  showMessage('', '');

  // Validate phone number
  if (!phone) {
    showMessage('Please enter your phone number', 'error');
    return;
  }

  if (!validatePhone(phone)) {
    showMessage('Please enter a valid phone number', 'error');
    return;
  }

  // Validate OTP
  if (!otp) {
    otpError.textContent = 'Please enter the OTP';
    document.getElementById('otp').classList.add('error');
    return;
  }

  if (!validateOTP(otp)) {
    otpError.textContent = 'OTP must be 6 digits';
    document.getElementById('otp').classList.add('error');
    return;
  }

  // Format phone number with +91
  const formattedPhone = '+91' + phone;

  // Disable verify button during verification
  verifyBtn.disabled = true;
  verifyBtn.textContent = 'Verifying...';

  try {
    const response = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: formattedPhone,
        otp: otp
      })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(data.message, 'success');
      console.log("JWT Token:", data.token);
      console.log("User:", data.user);

      if (timerInterval) {
        clearInterval(timerInterval);
        document.getElementById('timerContainer').style.display = 'none';
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setTimeout(() => testProtectedRoutes(), 500);

      setTimeout(() => {
  
        showMessage('Redirecting...', 'info');
      }, 2000);
    } else {
      showMessage(data.message || 'Invalid OTP. Please try again.', 'error');
    }
  } catch (err) {
    console.error('Verify OTP Error:', err);
    showMessage('Network error. Please check your connection.', 'error');
  } finally {
    setTimeout(() => {
      verifyBtn.disabled = false;
      verifyBtn.textContent = 'Verify OTP';
    }, 1000);
  }
}

window.addEventListener('beforeunload', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

async function testProtectedRoutes() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    console.warn('No token found. Please verify OTP first.');
    showMessage('Please verify your phone number first', 'error');
    return false;
  }

  try {
    const meResponse = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (meResponse.ok) {
      const userData = await meResponse.json();
      console.log('Protected route /me success:', userData);
      showMessage(`Welcome back ${userData.user.phone}!`, 'success');
    } else {
      console.error(' Protected route /me failed:', await meResponse.text());
    }

    // Test 2: Validate token
    const validateResponse = await fetch(`${BASE_URL}/validate-token`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (validateResponse.ok) {
      const validateData = await validateResponse.json();
      console.log(' Token validation success:', validateData);
    } else {
      console.error(' Token validation failed:', await validateResponse.text());
    }

    return true;
  } catch (err) {
    console.error('Error testing protected routes:', err);
    showMessage('Failed to verify authentication', 'error');
    return false;
  }
}