// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QBVotingSystem is ERC721, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  
  address constant TEST_ADDRESS = 0x603fbF99674B8ed3305Eb6EA5f3491F634A402A6;
  
  struct Voter {
      string userId;
      string name;
      string dateOfBirth;
      string addressDetails;
      string aadhaarNumber;
      string email;
      string phoneNumber;
      string profilePictureUrl;
      string ipfsHash;
      bool hasVoted;
      uint256 registrationTimestamp;
  }
  
  struct Candidate {
      string name;
      string ipfsHash;
      uint256 voteCount;
  }
  
  mapping(uint256 => Voter) public voters;
  mapping(address => uint256[]) public voterTokens;
  Candidate[] public candidates;
  
  event VoterRegistered(uint256 tokenId, address voter);
  event CandidateRegistered(uint256 candidateId, string name);
  event Voted(uint256 tokenId, uint256 candidateId);
  event VoterDetailsUpdated(uint256 tokenId);
  
  constructor() ERC721("QB Voting Token", "QBV") Ownable(msg.sender) {}
  
  function registerVoter(
      string memory _userId,
      string memory _name,
      string memory _dateOfBirth,
      string memory _addressDetails,
      string memory _aadhaarNumber,
      string memory _email,
      string memory _phoneNumber,
      string memory _profilePictureUrl,
      string memory _ipfsHash
  ) public {
      require(msg.sender == TEST_ADDRESS || voterTokens[msg.sender].length == 0, "Voter already registered");
      
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();
      _safeMint(msg.sender, newTokenId);
      
      voters[newTokenId] = Voter(
          _userId,
          _name,
          _dateOfBirth,
          _addressDetails,
          _aadhaarNumber,
          _email,
          _phoneNumber,
          _profilePictureUrl,
          _ipfsHash,
          false,
          block.timestamp
      );
      voterTokens[msg.sender].push(newTokenId);
      
      emit VoterRegistered(newTokenId, msg.sender);
  }
  
  function updateVoterDetails(
      string memory _name,
      string memory _dateOfBirth,
      string memory _addressDetails,
      string memory _email,
      string memory _phoneNumber,
      string memory _profilePictureUrl
  ) public {
      require(voterTokens[msg.sender].length > 0, "Voter not registered");
      uint256 tokenId = voterTokens[msg.sender][0];
      Voter storage voter = voters[tokenId];
      
      voter.name = _name;
      voter.dateOfBirth = _dateOfBirth;
      voter.addressDetails = _addressDetails;
      voter.email = _email;
      voter.phoneNumber = _phoneNumber;
      voter.profilePictureUrl = _profilePictureUrl;
      
      emit VoterDetailsUpdated(tokenId);
  }
  
  function registerCandidate(string memory _name, string memory _ipfsHash) public onlyOwner {
        candidates.push(Candidate(_name, _ipfsHash, 0));
        emit CandidateRegistered(candidates.length - 1, _name);
    }
    
    function vote(uint256 _candidateId) public {
        require(voterTokens[msg.sender].length > 0, "Voter not registered");
        require(_candidateId < candidates.length, "Invalid candidate");
        
        uint256 tokenId = voterTokens[msg.sender][0];
        require(!voters[tokenId].hasVoted, "Voter has already voted");
        
        voters[tokenId].hasVoted = true;
        candidates[_candidateId].voteCount++;
        
        emit Voted(tokenId, _candidateId);
    }
    
    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }
    
    function getVoterDetails(uint256 _tokenId) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        bool,
        uint256
    ) {
        Voter memory voter = voters[_tokenId];
        return (
            voter.userId,
            voter.name,
            voter.dateOfBirth,
            voter.addressDetails,
            voter.aadhaarNumber,
            voter.email,
            voter.phoneNumber,
            voter.profilePictureUrl,
            voter.ipfsHash,
            voter.hasVoted,
            voter.registrationTimestamp
        );
    }

    function isVoterRegistered(address _voter) public view returns (bool) {
        return voterTokens[_voter].length > 0;
    }

    function getVoterTokenCount(address _voter) public view returns (uint256) {
        return voterTokens[_voter].length;
    }
}

