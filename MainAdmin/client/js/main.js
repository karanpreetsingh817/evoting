//0x797BDdcb0DA7e8222D53A163184Ad8C7957769a2
var ins;
const voteStatus = { 0: "Voting Not Started", 1: "Voting Started", 2: "Voting Finished" }
window.onload = async() => {
    await connect3()
    ins = getContractInstance(contractAbi, contractAddress)
    const st = await ins.methods.vote_status_int().call({ from: accounts[0] })
    if (st == 0) {
        document.getElementById('votingStart').style.display = 'block'
    } else if (st == 1) { document.getElementById('votingEnd').style.display = 'block' }

    console.log(voteStatus[st])

    await fetchAndDisplayCandidates()

}
document.getElementById('votingStart').addEventListener('click', async() => {
    try {
        ins = getContractInstance(contractAbi, contractAddress)
        const res = await ins.methods.start_voting().send({ from: accounts[0] })
        window.location.href = '/'
    } catch (error) {
        alert(error)
    }


})
document.getElementById('votingEnd').addEventListener('click', async() => {
    try {
        ins = getContractInstance(contractAbi, contractAddress)
        const res = await ins.methods.vote_end().send({ from: accounts[0] })
        window.location.href = '/'
    } catch (error) {
        alert(error)
    }


})


async function fetchAndDisplayCandidates() {
    const count = await ins.methods.candidate_count().call({ from: accounts[0] })
    document.getElementById('candidatesCount').innerText = count
    for (let i = 0; i < count; i++) {
        const candidateData = await ins.methods.candidates(i).call({ from: accounts[0] })
        let div = document.createElement('div');
        div.innerHTML = `<div class="card" style="width: 18rem; margin-bottom: 15px;">
                    <div class="card-body">
                        <h5 class="card-title">Candidate Party : ${candidateData.party_name}</h5>
                    </div>
                    <ul class="list-group list-group-light list-group-small">
                        <li class="list-group-item px-4">Candidate Party Flag: ${candidateData.party_flag}</li>
                        <li class="list-group-item px-4">Candidate Name: ${candidateData.candidate_name}</li>

                    </ul>

                </div>
               `
        document.getElementById('candidateview').appendChild(div)
    }


}
document.getElementById('pooladmin-submit').addEventListener('click', async() => {
    await addPoolAdmin();
})
document.getElementById("candidate-submit").addEventListener('click', async() => {
    await addCandidate()
})
async function addCandidate() {
    let name = ''
    let aadhaar = ''
    let partyName = ''
    let partyFlag = ''
    name = document.getElementById('candidate-name').value;
    aadhaar = parseInt(document.getElementById('candidate-aadhaar').value)
    partyName = document.getElementById('candidate-party').value
    partyFlag = document.getElementById('candidate-flag').value
    ins = getContractInstance(contractAbi, contractAddress)
    const st = await ins.methods.add_candidate(partyName, partyFlag, name, aadhaar).send({ from: accounts[0] })
    console.log(st)
    window.location.href = "/"
}
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
        const rawResponse = await fetch("http://localhost:1000/addPoolAdmin", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, username, booth, poolAdminAddress })
        })

        if (rawResponse.ok) {
            const result = await rawResponse.json()
            console.log(result)
            const res = await ins.methods.add_pool_admin(poolAdminAddress).send({ from: accounts[0] });
            console.log(res)
            window.location.href = "/"
        } else {
            const error = await rawResponse.json()
            throw "Error :" + error.message

        }
    } catch (e) {
        alert(e)
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