document.getElementById("inputadhar").addEventListener("mouseout", () => {
    if (document.getElementById("inputadhar").value.length != 0) {
        document.getElementById("placeholderadhar").setAttribute("data-placeholder", "")
    } else {
        document.getElementById("placeholderadhar").setAttribute("data-placeholder", "Adhar Number(12 digit)")
    }
})
document.getElementById("inputadhar").addEventListener("input", () => {
    document.getElementById("placeholderadhar").setAttribute("data-placeholder", "Adhar Number(12 digit)")
})

document.getElementById("inputmobile").addEventListener("mouseout", () => {
    if (document.getElementById("inputmobile").value.length != 0) {
        document.getElementById("placeholdermobile").setAttribute("data-placeholder", "")
    } else {
        document.getElementById("placeholdermobile").setAttribute("data-placeholder", "+91 Mobile Number(10 digit)")
    }
})
document.getElementById("inputmobile").addEventListener("input", () => {
    document.getElementById("placeholdermobile").setAttribute("data-placeholder", "+91 Mobile Number(10 digit)")
})