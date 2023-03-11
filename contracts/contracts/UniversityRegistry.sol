// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./interfaces/IMembership.sol";

contract UniversityRegistry is IMembership {
    event ApplicantAdded(
        address indexed sender,
        string indexed university,
        string indexed department,
        string server
    );

    event MemberAdded(
        address indexed sender,
        string indexed university,
        string indexed department,
        string server
    );

    struct Applicant {
        string university; // name of institution
        string department; // name of department
        string server; // address of transfer server
        uint256 votingEndTime; // last block where it is possible to vote
        uint256 requiredQuorum;
        mapping(address => int256) votes; // 1 against, 2 in favor, >=3 abstain
        uint256 votesInFavor;
        uint256 votesAgainst;
        uint256 abstentions;
    }

    struct Member {
        string university; // name of institution
        string department; // name of department
        string server; // address of transfer server
    }

    mapping(address => Applicant) public applicantInfos;

    mapping(address => Member) public memberInfos;
    address[] public memberAddresses;

    modifier onlyMember() {
        require(this.isMember(msg.sender));
        _;
    }

    constructor(
        string memory _ownUniversity,
        string memory _ownDepartment,
        string memory _ownServer,
        address _otherAddress,
        string memory _otherUniversity,
        string memory _otherDepartment,
        string memory _otherServer
    ) {
        Member memory p1 = Member(_ownUniversity, _ownDepartment, _ownServer);
        memberInfos[msg.sender] = p1;
        memberAddresses.push(msg.sender);
        emit MemberAdded(
            msg.sender,
            _ownUniversity,
            _ownDepartment,
            _ownServer
        );

        Member memory p2 = Member(
            _otherUniversity,
            _otherDepartment,
            _otherServer
        );
        memberInfos[_otherAddress] = p2;
        memberAddresses.push(_otherAddress);
        emit MemberAdded(
            _otherAddress,
            _otherUniversity,
            _otherDepartment,
            _otherServer
        );
    }

    function applyForMembership(
        string memory _university,
        string memory _department,
        string memory _server
    ) public {
        require(
            bytes(_university).length != 0,
            "Must provide university name."
        );
        require(
            bytes(_department).length != 0,
            "Must provide department name."
        );
        require(bytes(_server).length != 0, "Must provide server address.");
        require(
            bytes(memberInfos[msg.sender].department).length == 0,
            "Member already exists."
        );
        require(
            bytes(applicantInfos[msg.sender].department).length == 0,
            "Applicant already exists."
        );
        uint256 votingEnd = block.timestamp + 40320; // roughly one week
        Applicant storage a = applicantInfos[msg.sender];
        a.university = _university;
        a.department = _department;
        a.server = _server;
        a.requiredQuorum = memberAddresses.length / 2;
        a.votingEndTime = votingEnd;
        emit ApplicantAdded(msg.sender, _university, _department, _server);
    }

    function castMembershipVote(address _applicantAddress, int256 vote)
        public
        onlyMember
    {
        require(
            this.isApplicant(_applicantAddress),
            "No applicant with provided address."
        );
        Applicant storage a = applicantInfos[_applicantAddress];
        require(
            a.votingEndTime > block.timestamp,
            "Voting period has expired."
        );
        require(a.votes[msg.sender] == 0, "Already voted.");
        a.votes[msg.sender] = vote;
        if (vote == 1) {
            a.votesAgainst++;
        } else if (vote == 2) {
            a.votesInFavor++;
        } else {
            a.abstentions++;
        }
    }

    // needs to be called to become member or remove old vote before starting a new application
    function resolveVoteResult() public {
        require(this.isApplicant(msg.sender), "Not an applicant.");
        Applicant storage a = applicantInfos[msg.sender];
        require(
            a.votingEndTime < block.timestamp ||
                a.votesInFavor + a.votesAgainst + a.abstentions >=
                a.requiredQuorum,
            "Quorum not reached and time still running."
        );
        if (a.votesInFavor > a.votesAgainst + a.abstentions) {
            Member memory m = Member(a.university, a.department, a.server);
            memberInfos[msg.sender] = m;
            memberAddresses.push(msg.sender);
            emit MemberAdded(msg.sender, a.university, a.department, a.server);
        }
        delete applicantInfos[msg.sender];
    }

    function updateServer(string memory _server) public onlyMember {
        memberInfos[msg.sender].server = _server;
    }

    function getMemberCount() public view returns (uint256) {
        return memberAddresses.length;
    }

    function isMember(address account) external view returns (bool) {
        return bytes(memberInfos[account].department).length > 0;
    }

    function isApplicant(address account) external view returns (bool) {
        return bytes(applicantInfos[account].department).length > 0;
    }
}
