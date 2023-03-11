// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./interfaces/IMembership.sol";

contract TransferLog {
    struct Transfer {
        address from;
        address to;
        bytes32 hash1;
        bytes32 hash2;
        uint256 time;
    }

    IMembership registry;
    mapping(address => Transfer[]) public transfers; // transfer list by recipient address

    constructor(address _registryAddress) {
        registry = IMembership(_registryAddress);
    }

    // Rough Gas: 168655
    // Rough Price at 36 Gwei per Gas: 5,70€
    function announce(
        address _to,
        bytes32 _hash1,
        bytes32 _hash2
    ) public {
        require(registry.isMember(msg.sender), "Sender must be registered.");
        require(registry.isMember(_to), "Receiver must be registered.");
        Transfer memory t = Transfer(
            msg.sender,
            _to,
            _hash1,
            _hash2,
            block.timestamp
        );
        transfers[_to].push(t);
    }

    function validate(
        address _from,
        address _to,
        bytes32 _hash1,
        bytes32 _hash2
    ) public view returns (Transfer memory) {
        require(registry.isMember(_from), "Sender must be registered.");
        require(registry.isMember(_to), "Receiver must be registered.");
        Transfer[] memory transferList = transfers[_to];
        for (uint256 i = 0; i < transferList.length; i++) {
            Transfer memory t = transferList[i];
            if (t.from == _from && t.hash1 == _hash1 && t.hash2 == _hash2) {
                return t;
            }
        }
        revert("No valid transfer found.");
    }
}
