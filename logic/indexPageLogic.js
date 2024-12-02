document.addEventListener("DOMContentLoaded",()=>{
    const token = localStorage.getItem("token");
    if (!token) {
        // window.location.href = 'login.html'; // Redirect if no token
        console.log("no token");
    } else {
        try {
            const decoded = jwt_decode(token);
            const userDetails = document.getElementById("userDetails");
            userDetails.innerHTML = `<img src="../icons/user.svg" alt="userImage" height="25">${decoded.fullName.split(" ")[0]}`;
            console.log(decoded);
        } catch (error) {
            alert('Invalid token');
            localStorage.removeItem('token');
            // window.location.href = 'login.html'; // Redirect on invalid token
        }
    }
})