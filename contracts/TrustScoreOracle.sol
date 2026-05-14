// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TrustScoreOracle
 * @dev On-chain oracle that records TrustScore updates for verification.
 */
contract TrustScoreOracle {
    address public admin;
    
    struct ScoreRecord {
        uint16 score;
        uint256 timestamp;
        bytes32 proofHash; // Hash of the ZK-Proof or explanation
    }
    
    mapping(address => ScoreRecord) public latestScores;
    mapping(address => ScoreRecord[]) public scoreHistory;
    
    event TrustScoreUpdated(address indexed worker, uint16 score, bytes32 proofHash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function updateScore(
        address _worker, 
        uint16 _score, 
        bytes32 _proofHash
    ) public onlyAdmin {
        ScoreRecord memory newRecord = ScoreRecord({
            score: _score,
            timestamp: block.timestamp,
            proofHash: _proofHash
        });
        
        latestScores[_worker] = newRecord;
        scoreHistory[_worker].push(newRecord);
        
        emit TrustScoreUpdated(_worker, _score, _proofHash);
    }

    function getLatestScore(address _worker) public view returns (uint16, uint256, bytes32) {
        ScoreRecord memory record = latestScores[_worker];
        return (record.score, record.timestamp, record.proofHash);
    }
}
