// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
contract EvotinG{
    address public Administrate;
    uint private Start_timming; //repesent timmimg when voting is started
    uint private End_timming;  //repesent when voting is ended
    struct Voter{
        uint Adhaarnumber;
        string Name;
        uint age;
        bool isVoted;
        uint Votedto;
        // code for differents state and blocks can be declare and we check whether candidate belongs to that region or not
    }

    struct candidate{
        string PartyName;
        string PartyFlag;
        string CandidateName;
        uint Candidate_num; //or candidate id or what ever you want call it my brother.....RITIK_LODDA
        uint Adhaarnumber;
        uint CountVote;
    }



}