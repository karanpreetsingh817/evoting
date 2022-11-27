var ins;
var accounts;
window.onload = async() => {
    await connect3()
    ins = getContractInstance(contractAbi, contractAddress)
    const voteStatus = await ins.methods.vote_status_int().call({ form: accounts[0] })
    if (voteStatus == 2) {
        blockDisplay("Voting has been ended you can't Vote Now")
    }
    const user = await ins.methods.voters(accounts[0]).call({ from: accounts[0] })
    if (user.isPresent == false) {
        blockDisplay("You are Not registered User with this account")
    }
    document.getElementById("name").innerHTML = `<b>${user.name}</b> Voting Area`
    document.getElementById("aadhaarNumber").innerText = `Aaadhaar :${user.adhaar_number}`
    document.getElementById('blockchainaddress').innerText = accounts[0]
    const candidatesCount = await ins.methods.candidate_count().call({ from: accounts[0] })
    for (let i = 0; i < candidatesCount; i++) {
        if (i == user.voted_to) {
            const candidateData = await ins.methods.candidates(i).call({ from: accounts[0] })
            const div = document.createElement('div')
            div.innerHTML = ` <div class="card bg-success" style="width: 18rem; margin-bottom: 15px;">
            <div class="card-body">
                <h5 class="card-title">Candidate Party : ${candidateData.party_name}</h5>
            </div>
            <ul class="list-group list-group-light list-group-small">
                <li class="list-group-item px-4">Candidate Party Flag: ${candidateData.party_flag}</li>
                <li class="list-group-item px-4">Candidate Name: ${candidateData.candidate_name}</li>
            </ul>
            <button type="button" data-type="vote" data-id="${i}" style="pointer-events: none" class="btn-block ">Voted</button>
            <li style="height: 7px;visibility: hidden;"></li>
            <button type="button" data-type="devote" data-id="${i}" class="btn-block btn-dark">De Vote</button>

        </div>`
            document.getElementById('section').appendChild(div)
        } else {
            const candidateData = await ins.methods.candidates(i).call({ from: accounts[0] })
            const div = document.createElement('div')
            div.innerHTML = ` <div class="card" style="width: 18rem; margin-bottom: 15px;">
            <div class="card-body">
                <h5 class="card-title">Candidate Party : ${candidateData.party_name}</h5>
            </div>
            <ul class="list-group list-group-light list-group-small">
                <li class="list-group-item px-4">Candidate Party Flag: ${candidateData.party_flag}</li>
                <li class="list-group-item px-4">Candidate Name: ${candidateData.candidate_name}</li>
            </ul>
            <button type="button" data-type="vote" data-id="${i}" class="btn-block btn-info">Vote</button>
            <li style="height: 7px;visibility: hidden;"></li>
            <button type="button" data-type="devote" data-id="${i}" style="pointer-events: none" class="btn-block ">De Vote</button>

        </div>`
            document.getElementById('section').appendChild(div)
        }
    }

}
document.getElementById('section').addEventListener('click', async(e) => {
    try {
        const element = e.target
        if (element.getAttribute('data-type') == undefined) {} else if (element.getAttribute('data-type') == 'vote') {
            await ins.methods.make_vote(parseInt(element.getAttribute('data-id'))).send({ from: accounts[0] })
            alert(`Voted to${element.getAttribute('data-id')} Successfullly`)
            window.location.href = '/'
        } else if (element.getAttribute('data-type') == 'devote') {
            await ins.methods.de_vote(parseInt(element.getAttribute('data-id'))).send({ from: accounts[0] })
            alert(`Devoted to${element.getAttribute('data-id')} Successfullly`)
            window.location.href = '/'
        }
    } catch (e) {
        alert(e)
    }
})


function blockDisplay(mess) {
    document.body.style.pointerEvents = "none";
    document.body.innerHTML = mess
    document.body.style.fontSize = "100px"
    document.body.style.color = 'Black'
    document.body.style.background = "grey"
    document.body.style.textAlign = 'Center'

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