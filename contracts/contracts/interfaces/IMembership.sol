// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;



interface IMembership {
    function isMember(address account) external view returns (bool);
}