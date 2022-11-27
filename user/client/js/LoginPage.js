var ins;
var accounts;
window.onload = async() => {
    document.getElementById('otp').style.display = 'none'
    await connect3()
    ins = getContractInstance(contractAbi, contractAddress)
    const isValidUser = await ins.methods.voters(accounts[0]).call({ from: accounts[0] })
    if (isValidUser.isPresent == false) {

        document.body.style.pointerEvents = "none";
        document.body.innerHTML = "You are Not registered User with this account"
        document.body.style.fontSize = "100px"
        document.body.style.color = 'Black'
        document.body.style.background = "grey"
        document.body.style.textAlign = 'Center'
    }
}

async function connect3() {
    if (typeof web3 === 'undefined')
        alert("Install meta Mask to use")
    else {
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (Array(accounts).length > 0) {
            console.log(`connected to metamask with ${accounts[0]}`)
        } else
            alert("Account not connected")
    }
}

function getContractInstance(abi, address) {
    const contract = new web_3.eth.Contract(JSON.parse(abi), address, {
        from: accounts[0],
        gas: 2000000,
    });
    return contract;
}

document.getElementById('form').addEventListener('submit', async(e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const jsonFormData = {}
    for (var pair of formData.entries()) {
        jsonFormData[pair[0]] = pair[1]
    }

    if (document.getElementById('otp').style.display == 'block') {
        await fetch("http://localhost:2500/signInOtp", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonFormData)
        })
        window.location.href = "/"
    } else {
        const rawRes = await fetch("http://localhost:2500/signIn", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonFormData)
        })
        if (rawRes.ok) {
            document.getElementById('otp').style.display = 'block'
            document.getElementById('button').innerText = "Send OTP"


        } else {
            const e = await rawRes.json()
            console.log(e)
        }
    }
})



document.getElementById("inputadhar").addEventListener("mouseout", () => {
    if (document.getElementById("inputadhar").value.length != 0) {
        document.getElementById("placeholderadhar").setAttribute("data-placeholder", "")
    } else {
        document.getElementById("placeholderadhar").setAttribute("data-placeholder", "Aadhaar Number(12 digit)")
    }
})
document.getElementById("inputadhar").addEventListener("input", () => {
    document.getElementById("placeholderadhar").setAttribute("data-placeholder", "Aadhaar Number(12 digit)")
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