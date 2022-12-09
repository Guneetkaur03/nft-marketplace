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

  // modifier OnlyItemOwner(uint256 tokenId){
  //   require(token.ownerOf(tokenId) == msg.sender, "Sender does not own the item");
  //   _;
  // }

  // modifier HasTransferApproval(uint256 tokenId){
  //   require(token.getApproved(tokenId) == address(this), "Market is not approved");
  //   _;
  // }

  // modifier ItemExists(uint256 id){
  //   require(id < itemsForSale.length && itemsForSale[id].id == id, "Could not find item");
  //   _;
  // }

  // modifier IsForSale(uint256 id){
  //   require(!itemsForSale[id].isSold, "Item is already sold");
  //   _;
  // }

  function putTokenOnSale(uint256 tokenId, uint256 price) external returns (uint256) {

    require(token.ownerOf(tokenId) == msg.sender, "Token is not owned by the seller.");
    require(token.getApproved(tokenId) == address(this), "Token not approved by us.");
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
  //   OnlyItemOwner(tokenId) 
  //   HasTransferApproval(tokenId) 
  //   external 
  //   returns (uint256){
  //     require(!activeItems[tokenId], "Item is already up for sale");

  //     uint256 newItemId = itemsForSale.length;
  //     itemsForSale.push(ItemForSale({
  //       id: newItemId,
  //       tokenId: tokenId,
  //       seller: payable(msg.sender),
  //       price: price,
  //       isSold: false
  //     }));
  //     activeItems[tokenId] = true;

  //     assert(itemsForSale[newItemId].id == newItemId);
  //     emit itemAddedForSale(newItemId, tokenId, price);
  //     return newItemId;
  // }

  function buyToken(uint id) payable external{

    require(id < tokensOnSale.length && tokensOnSale[id].id == id, "Token not on sale");
    require(!tokensOnSale[id].isSold, "Item is already sold");
    require(token.getApproved(tokensOnSale[id].tokenId) == address(this), "Token not approved by us.");

    require(msg.value >= tokensOnSale[id].price, "Not enough funds paid");
    require(msg.sender != tokensOnSale[id].seller, "seller cannot be the buyer");

    tokensOnSale[id].isSold = true;

    activeSale[tokensOnSale[id].tokenId] = false;

    token.safeTransferFrom(tokensOnSale[id].seller, msg.sender, tokensOnSale[id].tokenId);
    
    tokensOnSale[id].seller.transfer(msg.value);

    emit tokenSold(id, msg.sender, tokensOnSale[id].price);
  }
  // function buyItem(uint256 id) 
  //   ItemExists(id)
  //   IsForSale(id)
  //   HasTransferApproval(itemsForSale[id].tokenId)
  //   payable 
  //   external {
  //     require(msg.value >= itemsForSale[id].price, "Not enough funds sent");
  //     require(msg.sender != itemsForSale[id].seller);

  //     itemsForSale[id].isSold = true;
  //     activeItems[itemsForSale[id].tokenId] = false;
  //     token.safeTransferFrom(itemsForSale[id].seller, msg.sender, itemsForSale[id].tokenId);
  //     itemsForSale[id].seller.transfer(msg.value);

  //     emit itemSold(id, msg.sender, itemsForSale[id].price);
  //   }

  function totalItemsForSale() external view returns(uint256) {
    return tokensOnSale.length;
  }
}
