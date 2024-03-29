import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';

import getWeb3 from "../../utils/getWeb3";
import { api } from "../../services/api";

import MyMarketplace from "../../contracts/MyMarketplace.json";
import MyToken from "../../contracts/MyToken.json";

import {
  setNft,
  setAccount,
  setTokenContract,
  setMarketContract,
} from "../../redux/actions/nftActions";
import Card from "../../components/Card";

import { useStyles } from "./styles.js";

import doodle from "../../assets/bg.jpeg";


const Home = () => {
  const classes = useStyles();
  const account = useSelector((state) => state.allNft.account);
  const nft = useSelector((state) => state.allNft.nft);
  console.log("nft:", nft);
  const dispatch = useDispatch();

  useEffect(() => {
    let itemsList = [];
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();

        if (typeof accounts === undefined) {
          alert("Please login with Metamask!");
          console.log("login to metamask");
        }

        const networkId = await web3.eth.net.getId();
        try {
          const myTokenContract = new web3.eth.Contract(
            MyToken.abi,
            MyToken.networks[networkId].address
          );
          // console.log("Contract: ", artTokenContract);
          const marketplaceContract = new web3.eth.Contract(
            MyMarketplace.abi,
            MyMarketplace.networks[networkId].address
          );
          const totalSupply = await myTokenContract.methods
            .totalSupply()
            .call();
          const totalItemsForSale = await marketplaceContract.methods
            .totalItemsForSale()
            .call();

          for (var tokenId = 1; tokenId <= totalSupply; tokenId++) {
            let item = await myTokenContract.methods.mapping_of_tokens(tokenId).call();
            let owner = await myTokenContract.methods.ownerOf(tokenId).call();

            const response = await api
              .get(`/tokens/${tokenId}`)
              .catch((err) => {
                console.log("Err: ", err);
              });
            console.log("response: ", response);

            itemsList.push({
              name: response.data.name,
              description: response.data.description,
              image: response.data.image,
              tokenId: item.id,
              creator: item.creator,
              owner: owner,
              uri: item.uri,
              isForSale: false,
              saleId: null,
              price: 0,
              isSold: null,
            });
          }
          if (totalItemsForSale > 0) {
            for (var saleId = 0; saleId < totalItemsForSale; saleId++) {
              let item = await marketplaceContract.methods
                .tokensOnSale(saleId)
                .call();
              let active = await marketplaceContract.methods
                .activeSale(item.tokenId)
                .call();

              let itemListIndex = itemsList.findIndex(
                (i) => i.tokenId === item.tokenId
              );

              itemsList[itemListIndex] = {
                ...itemsList[itemListIndex],
                isForSale: active,
                saleId: item.id,
                price: item.price,
                isSold: item.isSold,
              };
            }
          }

          dispatch(setAccount(accounts[0]));
          dispatch(setTokenContract(myTokenContract));
          dispatch(setMarketContract(marketplaceContract));
          dispatch(setNft(itemsList));
        } catch (error) {
          console.error("Error", error);
          alert(
            "Contracts not deployed to the current network " +
              networkId.toString()
          );
        }
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.` +
            error
        );
        console.error(error);
      }
    };
    init();
  }, [dispatch]);

  console.log("Nft :", nft);

  const nftItem = useSelector((state) => state.allNft.nft);

    return (
    <div className={classes.homepage}>
        <section className={classes.banner}>
        <Grid container spacing={0} xs={12} className={classes.gridBanner}>
            <Grid container spacing={0}>
                <Grid item xs={2}>
                    <img src={doodle} alt="bg-1" className={classes.images} />
                </Grid>
                <Grid item xs={2}>
                    <img src={doodle} alt="bg-2" className={classes.images} />
                </Grid>
                <Grid item xs={4} className={classes.main}>
                    <Typography className={classes.content}>A college notes NFT marketplace, where you can trade your work.</Typography>
                    <Link to="/create-nft">
                        <Button variant="contained" color="primary" disableElevation>
                            Start Minting
                        </Button>
                    </Link>
                </Grid>
                <Grid item xs={2}>
                    <img src={doodle} alt="bg-3" className={classes.images} />
                </Grid>
                <Grid item xs={2}>
                    <img src={doodle} alt="bg-4" className={classes.images} />
                </Grid>
            </Grid>
        </Grid>
        
        </section>

        {/* To display the tokens that are owned by me */}
        <section className={classes.allNfts}>
            <Typography className={classes.title}>Bought by Me</Typography>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                {nftItem.filter(nft => nft.owner === account && nft.owner !== nft.creator).map((nft) => (
                <Grid item key={nft.tokenId}>
                    <Card {...nft} />
                </Grid>
                ))}
            </Grid>
        </section>
        
        {/* To display the tokens that are created by me*/}
        <section className={classes.allNfts}>
            <Typography className={classes.title}>Created by me</Typography>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                {nftItem.filter(nft => nft.creator === account).map((nft) => (
                <Grid item key={nft.tokenId}>
                    <Card {...nft} />
                </Grid>
                ))}
            </Grid>
        </section>

        {/* To display the tokens that are up for sale */}
        <section className={classes.allNfts}>
            <Typography className={classes.title}>Up for Sale</Typography>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                {nftItem.filter(nft => nft.creator !== account && nft.isForSale).map((nft) => (
                <Grid item key={nft.tokenId}>
                    <Card {...nft} />
                </Grid>
                ))}
            </Grid>
        </section>

        {/* To display the tokens that are sold by me
        <section className={classes.allNfts}>
            <Typography className={classes.title}>Sold by me</Typography>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                {nftItem.filter(nft => nft.creator === account && nft.isSold).map((nft) => (
                  <Grid item key={nft.tokenId}>
                    <Card {...nft} />
                  </Grid>
                ))}
            </Grid>
        </section> */}
    </div>
    );
};

export default Home;
