// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
contract EvotinG{
    address public Administrator;
    uint private Start_timming;                      //repesent timmimg when voting is started
    uint private End_timming;                         //repesent when voting is ended


    enum Votestatus{Before_start,Votestarted,Voteend} //To check voting status
    Votestatus public status;


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



    constructor(){
        Administrator=msg.sender;
        Start_timming=block.timestamp+604800; //after deploy administator has 7 days of time to do any change
        End_timming=Start_timming+604800;
        status=Votestatus.Before_start;
        }




    modifier isadmnistrator{
        require(Administrator==msg.sender,"This action perform by ony administrator");
        _;
    }
    modifier beforestart{
        require(status==Votestatus.Before_start,"bro i think voting is running, yeh kam to start se pehle krna tha na bhau");
        require(block.timestamp<Start_timming,"oh ho you are late!!!");
        _;
    }


    modifier eligible_voter{
         address t=msg.sender;
         require(Voters[t].isVoted ==false,"hi you are already give vote to this party");
        _;
    }


    function add_candidate(string memory panme,string memory pflag,string memory c_name,uint cnum,uint adhaar) isadmnistrator beforestart public{
          
          candidate.PartyName=panme;
          candidate.PartyFlag=pflag;
          candidate.CandidateName=c_name;
          candidate.Candidate_num=cnum;
          candidate.Adhaarnumber=adhaar;
          candidate.CountVote=0;

    }









    function makevote (uint candidatenum)public eligible_voter {
        
        candidates[candidatenum].CountVote=candidates[candidatenum].CountVote+1;
     }





}