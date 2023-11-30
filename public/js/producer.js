async function logOut() {
    await fetch('/logout', {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        
    }
    )

    location.reload();
};