// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DividendDistributor
 * @dev Tracks data usage events and distributes micro-dividends to worker wallets.
 */
contract DividendDistributor {
    address public admin;
    
    struct DividendRecord {
        uint256 amount;
        string source;
        uint256 timestamp;
    }
    
    mapping(address => uint256) public balances;
    mapping(address => DividendRecord[]) public dividendHistory;
    
    event DividendDistributed(address indexed worker, uint256 amount, string source);
    event Withdrawal(address indexed worker, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function distributeDividend(
        address _worker, 
        uint256 _amount, 
        string memory _source
    ) public onlyAdmin {
        balances[_worker] += _amount;
        dividendHistory[_worker].push(DividendRecord({
            amount: _amount,
            source: _source,
            timestamp: block.timestamp
        }));
        
        emit DividendDistributed(_worker, _amount, _source);
    }

    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        
        emit Withdrawal(msg.sender, amount);
    }

    // Receive function to fund the contract
    receive() external payable {}
}
