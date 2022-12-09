// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyToken is ERC721Enumerable{

  using Counters for Counters.Counter; //using counter to store the token id

  Counters.Counter private _tokenIds; //token id as a counter

  address public contract_owner;

  //token 
  struct Token {
    uint256 id;
    address creator;
    string url;
  }

  mapping(uint256 => Token) public mapping_of_tokens; //id => Item mapping

  constructor () ERC721("MyToken", "Notes") {}

  function mint(string memory url) public returns (uint256){

    _tokenIds.increment(); //new token getting added, increment the count

    uint256 newTokenId = _tokenIds.current(); 

    _safeMint(msg.sender, newTokenId); //safely minting the token

    approve(contract_owner, newTokenId); //smart contract owner approves the token

    //it gets added to the mapping
    mapping_of_tokens[newTokenId] = Token({
      id: newTokenId, 
      creator: msg.sender,
      url: url
    });

    //return the newly created token id
    return newTokenId;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "Token doesnot exist: ERC721URIStorage");
    return mapping_of_tokens[tokenId].url;
  }
  
  function setMarketplace(address market) public {
    contract_owner = market;
  }

}