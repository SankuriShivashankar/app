document.getElementById("registerForm").addEventListener("submit", async function(e){
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
      document.getElementById("message").innerText = data.message;
      if (response.ok) {
        document.getElementById("registerForm").reset();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
  