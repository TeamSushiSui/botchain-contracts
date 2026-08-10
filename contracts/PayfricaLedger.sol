// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PayfricaLedger is Ownable {

    enum TransactionType { RAMP, UTILITY, VOUCHER }
    enum TransactionStatus { COMPLETED, FAILED, REFUNDED }

    struct AuditRecord {
        address user;
        TransactionType txType;
        TransactionStatus status;
        address cryptoAsset;
        uint256 cryptoAmount;
        uint256 fiatAmount;
        uint256 exchangeRate; // rate * 1e18
        string fiatReference;
        uint256 timestamp;
    }

    // Global transaction history list
    AuditRecord[] public auditTrail;

    // User address -> transaction indexes mapping
    mapping(address => uint256[]) private userTxIndexes;

    // User address -> total USD volume processed (in 6 decimals USD value)
    mapping(address => uint256) public userVolumeUsd;

    event TransactionLogged(
        uint256 indexed index,
        address indexed user,
        TransactionType txType,
        TransactionStatus status,
        uint256 fiatAmount,
        string fiatReference
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Logs a completed transaction from the Payfrica backend
     */
    function logTransaction(
        address _user,
        TransactionType _txType,
        TransactionStatus _status,
        address _cryptoAsset,
        uint256 _cryptoAmount,
        uint256 _fiatAmount,
        uint256 _exchangeRate,
        uint256 _usdValBasis, // 6 decimals equivalent USD value for volume tracking
        string calldata _fiatReference
    ) external onlyOwner {
        require(_user != address(0), "Invalid user address");

        AuditRecord memory record = AuditRecord({
            user: _user,
            txType: _txType,
            status: _status,
            cryptoAsset: _cryptoAsset,
            cryptoAmount: _cryptoAmount,
            fiatAmount: _fiatAmount,
            exchangeRate: _exchangeRate,
            fiatReference: _fiatReference,
            timestamp: block.timestamp
        });

        auditTrail.push(record);
        uint256 index = auditTrail.length - 1;
        userTxIndexes[_user].push(index);
        userVolumeUsd[_user] += _usdValBasis;

        emit TransactionLogged(index, _user, _txType, _status, _fiatAmount, _fiatReference);
    }

    function getGlobalCount() external view returns (uint256) {
        return auditTrail.length;
    }

    function getUserTxCount(address _user) external view returns (uint256) {
        return userTxIndexes[_user].length;
    }

    function getUserTxByIndex(address _user, uint256 _index) external view returns (AuditRecord memory) {
        uint256 globalIndex = userTxIndexes[_user][_index];
        return auditTrail[globalIndex];
    }
}
