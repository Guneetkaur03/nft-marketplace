// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyToken.sol";

contract MyMarketplace {

  MyToken private token;

  //for tokens that are on sale
  struct tokenOnSale {
    uint256 id;
    uint256 tokenId;
    address payable seller;
    uint256 price;
    bool isSold;
  }

  tokenOnSale[] public tokensOnSale;

  mapping(uint256 => bool) public activeSale; // which tokens are still on sale

  event tokenAddedForSale(uint256 id, uint256 tokenId, uint256 price);
  event tokenSold(uint256 id, address buyer, uint256 price);

  constructor(MyToken _token) {
      token = _token;
  }

  function putTokenOnSale(uint256 tokenId, uint256 price) external returns (uint256) {

    require(token.ownerOf(tokenId) == msg.sender, "Token is not owned by the seller.");
    require(token.getApproved(tokenId) == address(this), "Token  is not approved by the contract.");
    require(!activeSale[tokenId], "Token is already up for sale");

    uint256 newTokenId = tokensOnSale.length;
    
    tokensOnSale.push(tokenOnSale({
        id: newTokenId,
        tokenId: tokenId,
        seller: payable(msg.sender),
        price: price,
        isSold: false
      }));

    activeSale[tokenId] = true;

    assert(tokensOnSale[newTokenId].id == newTokenId);
    emit tokenAddedForSale(newTokenId, tokenId, price);
    return newTokenId;
  }

  function buyToken(uint id) payable external{

    require(id < tokensOnSale.length && tokensOnSale[id].id == id, "Token not on sale");
    require(!tokensOnSale[id].isSold, "Item is already sold");
    require(token.getApproved(tokensOnSale[id].tokenId) == address(this), "Token not approved by the contract.");

    require(msg.value >= tokensOnSale[id].price, "Not enough funds paid");
    require(msg.sender != tokensOnSale[id].seller, "seller cannot be the buyer");

    tokensOnSale[id].isSold = true;

    activeSale[tokensOnSale[id].tokenId] = false;

    token.safeTransferFrom(tokensOnSale[id].seller, msg.sender, tokensOnSale[id].tokenId);
    
    tokensOnSale[id].seller.transfer(msg.value);

    emit tokenSold(id, msg.sender, tokensOnSale[id].price);
  }

  function totalItemsForSale() external view returns(uint256) {
    return tokensOnSale.length;
  }
}
