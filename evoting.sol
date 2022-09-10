// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
contract EvotinG{
    address public administrator;
    uint private start_timming;                      //repesent timmimg when voting is started
    uint private end_timming;                        //repesent when voting is ended
    uint candidate_count;

    enum vote_status{before_start,vote_started,vote_end} //To check voting status
    vote_status public status;


    struct  voter{
        uint adhaar_number;
        string name;
        uint age;
        bool is_voted;
        bool not_This;
        uint voted_to;
        // code for differents state and blocks can be declare and we check whether candidate belongs to that region or not
    }
   

    mapping(address=>voter) public voters;//baad me dekhenge ki private krna hai ja nahi....and haan validate ka bhi sochna hai bhai...
    


    struct candidate{
        string party_name;
        string party_flag;
        string candidate_name;
        uint adhaar_number;
        uint count_vote;
    }
    mapping(uint=>candidate) candidates;//where first int takes unique candidate number
    uint[] private votes_of_candidate;



    constructor(){
        administrator=msg.sender;
        status=vote_status.before_start;
        }




    modifier is_admnistrator{
        require(administrator==msg.sender,"This action perform by ony administrator");
        _;
    }
    modifier before_start{
        require(status==vote_status.before_start,"bro i think voting is running, yeh kam to start se pehle krna tha na bhau");
        require(block.timestamp<start_timming,"oh ho you are late!!!");
        _;
    }


    modifier eligible_voter{
         address t=msg.sender;
         require(voters[t].is_voted ==false,"hi you are already give vote to this party");
        _;
    }

    function start_voting() public is_admnistrator before_start{//vote started
        status=vote_status.vote_started;
        start_timming=block.timestamp; //after deploy administator has 7 days of time to do any change
        end_timming=start_timming+604800;
        
    }
    function vote_end() public is_admnistrator{ //vote ended
        require(status==vote_status.vote_started && end_timming<=block.timestamp);
        status=vote_status.vote_end; //change status to vote_end
    }


    function add_candidate(uint cn,string memory pname,string memory pflag,string memory c_name,uint adhaar) is_admnistrator before_start public{
          
          candidates[cn].party_name=pname;
          candidates[cn].party_flag=pflag;
          candidates[cn].candidate_name=c_name;
          candidates[cn].adhaar_number=adhaar;
          candidates[cn].count_vote=0;
          candidate_count++;

    }









    function make_vote (uint candidate_num)public eligible_voter {
        require(status==vote_status.vote_started,"hi stop!! there is time to start a vote!!");
        voters[msg.sender].is_voted=true;
        voters[msg.sender].voted_to=candidate_num;
        candidates[candidate_num].count_vote=candidates[candidate_num].count_vote+1;//increase vote count of that candidate
         }


    function de_vote(uint candidate_num) public {
         require(voters[msg.sender].is_voted==true,"this is only for thos who already voted");
         require(status==vote_status.vote_started,"hi stop!! there is time to start a vote!!");
         voters[msg.sender].is_voted=false;
         voters[msg.sender].voted_to=0;
         candidates[candidate_num].count_vote=candidates[candidate_num].count_vote-1;//decrease vote count of that candidate
          }

    function show_vote(uint candidate_num) public view is_admnistrator returns(uint){// function to check the candidate's vote
         require(status==vote_status.vote_end);
         return votes_of_candidate[candidate_num];

    }
    function show_winner() public view is_admnistrator returns(uint){
        require(status==vote_status.vote_end);
        uint winner=0;
        uint winner_candidate;
        for(uint i=0;i<candidate_count;i++)
        {
            if(votes_of_candidate[i]>winner){
                winner=votes_of_candidate[i];
                winner_candidate=i;
            }

        }
        return winner_candidate;
    }



}