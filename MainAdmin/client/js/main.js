console.log(web_3)
var ins;
window.onload = async() => {
    await connect3()
    ins = getContractInstance(contractAbi, contractAddress)
    const st = await ins.methods.vote_status_int().call({ from: accounts[0] })
    console.log(st)

}
document.getElementById('pooladmin-submit').addEventListener('click', async() => {
    await addPoolAdmin();
})
async function addPoolAdmin() {
    let name = '';
    let username = '';
    let booth = 0;
    let poolAdminAddress = ''
    name = document.getElementById('pooladmin-name').value;
    username = document.getElementById('pooladmin-username').value;
    booth = document.getElementById('pooladmin-booth').value;
    poolAdminAddress = document.getElementById('pooladmin-blockchainaddress').value;
    try {
        const res = await ins.methods.add_pool_admin(poolAdminAddress).send({ from: accounts[0] });

        console.log(res)
    } catch (e) {
        console.log(e)
    }

}

function addAddressToTitle() {
    document.getElementById("admin-address").innerText = `${accounts[0]} (hex address)`
}
async function connect3() {
    if (typeof web3 === 'undefined')
        alert("Install meta Mask to use")
    else {
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (Array(accounts).length > 0) {
            console.log(`connected to metamask with ${accounts[0]}`)
            addAddressToTitle()
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