export const CANDIDATE_REGISTRY_ADDRESS = "0x25cF2FeC344852CF98c5369eE65192De1908B0b6"

export const CANDIDATE_REGISTRY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_voterContractAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "candidateId",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "candidateAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "partyName",
        type: "string",
      },
    ],
    name: "CandidateRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "candidate",
        type: "address",
      },
    ],
    name: "VoteCast",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidateAddresses",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "candidates",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "candidateId",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "partyName",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isIndependent",
            type: "bool",
          },
          {
            internalType: "string",
            name: "manifesto",
            type: "string",
          },
          {
            internalType: "string",
            name: "ambitionsAndGoals",
            type: "string",
          },
        ],
        internalType: "struct CandidateRegistry.CandidateBasicInfo",
        name: "basicInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "experience",
            type: "string",
          },
          {
            internalType: "string",
            name: "pastAchievements",
            type: "string",
          },
          {
            internalType: "string",
            name: "contactInfo",
            type: "string",
          },
          {
            internalType: "string",
            name: "socialMediaLinks",
            type: "string",
          },
          {
            internalType: "string",
            name: "candidateImageUrl",
            type: "string",
          },
          {
            internalType: "string",
            name: "partySymbolUrl",
            type: "string",
          },
        ],
        internalType: "struct CandidateRegistry.CandidateAdditionalInfo",
        name: "additionalInfo",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "registrationTimestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_candidateAddress",
        type: "address",
      },
    ],
    name: "getCandidateAdditionalInfo",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "experience",
            type: "string",
          },
          {
            internalType: "string",
            name: "pastAchievements",
            type: "string",
          },
          {
            internalType: "string",
            name: "contactInfo",
            type: "string",
          },
          {
            internalType: "string",
            name: "socialMediaLinks",
            type: "string",
          },
          {
            internalType: "string",
            name: "candidateImageUrl",
            type: "string",
          },
          {
            internalType: "string",
            name: "partySymbolUrl",
            type: "string",
          },
        ],
        internalType: "struct CandidateRegistry.CandidateAdditionalInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_candidateAddress",
        type: "address",
      },
    ],
    name: "getCandidateBasicInfo",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "candidateId",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "partyName",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isIndependent",
            type: "bool",
          },
          {
            internalType: "string",
            name: "manifesto",
            type: "string",
          },
          {
            internalType: "string",
            name: "ambitionsAndGoals",
            type: "string",
          },
        ],
        internalType: "struct CandidateRegistry.CandidateBasicInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCandidateCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_candidateAddress",
        type: "address",
      },
    ],
    name: "getCandidateMetadata",
    outputs: [
      {
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "registrationTimestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "isRegisteredCandidate",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isVoterRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "candidateId",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "partyName",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isIndependent",
            type: "bool",
          },
          {
            internalType: "string",
            name: "manifesto",
            type: "string",
          },
          {
            internalType: "string",
            name: "ambitionsAndGoals",
            type: "string",
          },
        ],
        internalType: "struct CandidateRegistry.CandidateBasicInfo",
        name: "_basicInfo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "experience",
            type: "string",
          },
          {
            internalType: "string",
            name: "pastAchievements",
            type: "string",
          },
          {
            internalType: "string",
            name: "contactInfo",
            type: "string",
          },
          {
            internalType: "string",
            name: "socialMediaLinks",
            type: "string",
          },
          {
            internalType: "string",
            name: "candidateImageUrl",
            type: "string",
          },
          {
            internalType: "string",
            name: "partySymbolUrl",
            type: "string",
          },
        ],
        internalType: "struct CandidateRegistry.CandidateAdditionalInfo",
        name: "_additionalInfo",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "registerCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voterContractAddress",
        type: "address",
      },
    ],
    name: "setVoterContractAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_candidateAddress",
        type: "address",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "voterContractAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_candidateAddress",
        type: "address",
      },
    ],
    name: "getVoteCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalVotesCast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

