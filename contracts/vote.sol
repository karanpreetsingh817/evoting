//SPDX-License-Identifier: GPL-3.0
//
pragma solidity >=0.4.22 <0.9.0;
contract Vote{
    address public administrator;
    uint private after_deploy;                       // in bw after deploy and start_timming  administrator can update voters as well as candidates information
    uint private start_timming;                      //repesent timmimg when voting is started
    uint private end_timming;                        //repesent when voting is ended
    uint public candidate_count;
    enum vote_status{before_start,vote_started,vote_end} //To check voting status
    vote_status public status;
    uint public vote_status_int;
    struct  voter{
        uint adhaar_number;
        string name;
        uint age;
        uint voted_to;
        bool is_voted;
        bool isPresent;
    }
    mapping(address=>voter) public voters;//baad me dekhenge ki private krna hai ja nahi....and haan validate ka bhi sochna hai bhai...
    mapping(uint=>bool) public voter_status;
    struct candidate{
        string party_name;
        string party_flag;
        string candidate_name;
        uint adhaar_number;
    }
    mapping(uint=>candidate)public candidates;//where first int takes unique candidate number
    uint[] public votes_of_candidate;// array to stor total votes of each candidate
    mapping(address=>uint) public poolAdmin;
    //Constructor and modifier define here
    constructor(){
        administrator=msg.sender;
        status=vote_status.before_start;
         //means we have 12 hours to update data to our database of voters and candidate
         vote_status_int=0;
         candidate_count=0;
        }

    modifier is_admnistrator{
        require(administrator==msg.sender,"This action perform by ony administrator");
        _;
    }
    modifier is_pool_admnistrator{
        require(poolAdmin[msg.sender]==1,"This action perform by only pool administrator");
        _;
    }
    modifier before_start{
        require(status==vote_status.before_start,"bro i think voting is running, yeh kam to start se pehle krna tha na bhau");
        require( block.timestamp<start_timming,"oh ho you are late!!!");
        _;
    }
    modifier eligible_voter{
         address t=msg.sender;
         require(voters[t].isPresent==true,"You are Not registered for Voting");
         require(voters[t].is_voted ==false,"hi you are already give vote to this party");
        _;
    }

    //All function define here
    function is_present(uint adhaar)  is_admnistrator before_start  view  public returns(bool){
        return voter_status[adhaar];
    }
    function addVoter(address v,string memory voter_name,uint age,uint adhaar_number ) is_pool_admnistrator   public
    {
    // require(voter_status[adhaar_number]==false,"voter already present in our server");
     voters[v].name=voter_name;
     voters[v].age=age;
     voters[v].adhaar_number=adhaar_number;
     voters[v].voted_to=1000;
     voters[v].isPresent=true;
     voter_status[adhaar_number]=true;

    }
    function add_candidate(string memory pname,string memory pflag,string memory c_name,uint adhaar) is_admnistrator  public
    {
          candidates[candidate_count].party_name=pname;
          candidates[candidate_count].party_flag=pflag;
          candidates[candidate_count].candidate_name=c_name;
          candidates[candidate_count].adhaar_number=adhaar;
          votes_of_candidate.push(0);
          candidate_count++;
    }
     function add_pool_admin(address v) is_admnistrator  public
    {
          require(poolAdmin[v]==0,"Pool Admin already exists with given address");
          poolAdmin[v]=1;
    }

    function start_voting() public is_admnistrator  //vote started
    {
        require(status==vote_status.before_start);
        after_deploy=block.timestamp;
        start_timming=after_deploy+0;
        end_timming=start_timming+604800;//means we have total 7 days after voting started to voting end{voting duration}
        status=vote_status.vote_started;
        vote_status_int=1;

    }

    function make_vote (uint candidate_num)public eligible_voter
    {
        require(status==vote_status.vote_started,"hi stop!! there is time to start a vote!!");
        require( block.timestamp<end_timming);
        voters[msg.sender].is_voted=true;
        voters[msg.sender].voted_to=candidate_num;
        votes_of_candidate[candidate_num]++;
    }

    function de_vote(uint candidate_num) public
    {
         require(voters[msg.sender].is_voted==true,"this is only for thos who already voted");
         require(status==vote_status.vote_started,"hi stop!! there is time to start a vote!!");
         require(block.timestamp<end_timming);
         voters[msg.sender].is_voted=false;
         voters[msg.sender].voted_to=1000;
         votes_of_candidate[candidate_num]--;
    }

    function vote_end() public is_admnistrator  //vote ended
    {
        require(status==vote_status.vote_started);// && end_timming<=block.timestamp);
        status=vote_status.vote_end; //change status to vote_end
        vote_status_int=2;
    }

    function show_vote(uint candidate_num) public view is_admnistrator returns(uint) // function to check the candidate's vote
    {
         require(status==vote_status.vote_end);
         return votes_of_candidate[candidate_num];

    }

    function show_winner() public view  returns(uint,uint,string memory)
    {
        require(status==vote_status.vote_end);
        uint winner=votes_of_candidate[0];
        uint winner_candidate=0;
        for(uint i=2;i<=candidate_count;i++)
        {
            if(votes_of_candidate[i-1]>winner)
            {
                winner=votes_of_candidate[i-1];
                winner_candidate=i-1;
            }

        }
        uint winner_ct=0;
        for(uint i=0;i<candidate_count;i++)
        {
            if(winner==votes_of_candidate[i])
            winner_ct=winner_ct+1;

        }
        string memory tmp="success";
        if(winner_ct>1)
        tmp="winner not decided yet there is tie";
        return (winner_candidate,winner_ct,tmp);
    }
}