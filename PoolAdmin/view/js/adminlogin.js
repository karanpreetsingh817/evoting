function show() {
    var password = document.getElementById("password");
    var icon = document.querySelector(".fas")

    // ========== Checking type of password ===========
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
};
var ins;
var accounts;
window.onload = async() => {
    await connect3()
    ins = getContractInstance(contractAbi, contractAddress)
    const isPoolAdmin = await ins.methods.poolAdmin(accounts[0]).call({ from: accounts[0] })
    if (isPoolAdmin == 0) {
        document.body.style.pointerEvents = "none";
        document.body.innerHTML = "Danger:You Are Spammer if you are not connect pool admin account then relod page"
        document.body.style.fontSize = "100px"
        document.body.style.color = 'white'
        document.body.style.background = "#e05858"
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