// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
contract EvotinG{
    address public Administrator;
    uint private Start_timming;                      //repesent timmimg when voting is started
    uint private End_timming;                        //repesent when voting is ended
    enum Votestatus{Beforestart,Votestarted,Voteend} //To check voting status
    struct  Voter{
        uint Adhaarnumber;
        string Name;
        uint age;
        bool isVoted;
        bool notThis;
        uint Votedto;
        // code for differents state and blocks can be declare and we check whether candidate belongs to that region or not
    }
   

    mapping(address=>Voter) public Voters;//baad me dekhenge ki private krna hai ja nahi....and haan validate ka bhi sochna hai bhai...
    


    struct candidate{
        string PartyName;
        string PartyFlag;
        string CandidateName;
        uint Candidate_num; //or candidate id or what ever you want call it my brother.....RITIK_LODDA
        uint Adhaarnumber;
        uint CountVote;
    }
    candidate[] public candidates;






    modifier eligible_voter{
         address t=msg.sender;
         require(Voters[t].isVoted ==false,"hi you are already give vote to this party");
        _;
    }









    function makevote (uint candidatenum)public eligible_voter {
        candidates[candidatenum].CountVote=candidates[candidatenum].CountVote+1;
     }





}