function sendVerificationCode() {
    const email = document.getElementById("email").value;

    fetch("http://localhost:3000/password-reset/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("step1").style.display = "none";
                document.getElementById("step2").style.display = "block";
            } else {
                alert(data.message);
            }
        });
}

function verifyCode() {
    const email = document.getElementById("email").value;
    const code = document.getElementById("verificationCode").value;

    fetch("http://localhost:3000/password-reset/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("step2").style.display = "none";
                document.getElementById("step3").style.display = "block";
            } else {
                alert(data.message);
            }
        });
}

function resetPassword() {
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    fetch("http://localhost:3000/password-reset/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Password reset successfully!");
                window.location.reload();
            } else {
                alert(data.message);
            }
        });
}

