// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CredentialRegistry
 * @dev Issues and anchors Verifiable Credentials on-chain for NAMASTE workers.
 */
contract CredentialRegistry {
    struct Credential {
        string vcId;
        address worker;
        string ipfsHash;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(string => Credential) public credentials;
    mapping(address => string[]) public workerCredentials;
    
    address public admin;

    event CredentialIssued(string indexed vcId, address indexed worker, string ipfsHash);
    event CredentialRevoked(string indexed vcId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueCredential(
        string memory _vcId,
        address _worker,
        string memory _ipfsHash
    ) public onlyAdmin {
        require(bytes(credentials[_vcId].vcId).length == 0, "Credential already exists");
        
        credentials[_vcId] = Credential({
            vcId: _vcId,
            worker: _worker,
            ipfsHash: _ipfsHash,
            issuedAt: block.timestamp,
            revoked: false
        });
        
        workerCredentials[_worker].push(_vcId);
        
        emit CredentialIssued(_vcId, _worker, _ipfsHash);
    }

    function revokeCredential(string memory _vcId) public onlyAdmin {
        require(bytes(credentials[_vcId].vcId).length != 0, "Credential does not exist");
        credentials[_vcId].revoked = true;
        emit CredentialRevoked(_vcId);
    }

    function getWorkerCredentials(address _worker) public view returns (string[] memory) {
        return workerCredentials[_worker];
    }
}
