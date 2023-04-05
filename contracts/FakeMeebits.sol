// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Metadata.sol";

contract FakeMeebits is IERC721Metadata, ERC721 {
    mapping(address => bool) public whitelist;

    constructor() public ERC721("Fake Meebits", "FMB") {
        _mint(msg.sender, 1);
        whitelist[msg.sender] = true;
        _setBaseURI("https://meebits.larvalabs.com/meebit/");
    }

    function mintAToken(uint256 _token) public onlyMinter {
        _mint(msg.sender, _token);
    }

    function manageMinter(address newMinter, bool permission)
        public
        onlyMinter
    {
        whitelist[newMinter] = permission;
    }

    modifier onlyMinter() {
        require(whitelist[msg.sender], "Account Not Whitelisted");
        _;
    }
}
