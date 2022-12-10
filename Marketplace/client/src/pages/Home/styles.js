import { makeStyles } from '@material-ui/core/styles';
import doodle from "../../assets/bg2.jpeg";
const useStyles = makeStyles({
  homepage: {

  },
  images: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    
  },
  banner: {
    // minHeight: "50vh",
    // maxHeight: "50vh",
    // marginBottom: "3rem"
  },
  gridBanner: {
    // margin: 0,
    // width: '100%',
  },
  figure: {
    margin: 0,
    position: "relative"
  },
  main: {
    backgroundImage: `url(${doodle})`,
    // backgroundPosition: 'center', 
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 1rem",
    '& img': {
      width: "55%"
    },
    '& p': {
      margin: "3rem 8rem 4rem 8.5rem",
      fontSize: "1.2rem",
      textAlign: "center"
    },
    '& button': {
      textTransform: 'none',
      fontSize: "1.2rem",
      fontWeight: "400",
      background: '#5AF',
    },
    ".button:hover ":{
      backgroundColor:"#5AF",
      transition: "0.7s",
  }

  },
  allNfts: {
    marginTop: "2rem",
    padding: "0 2rem",
  },
  title: {
    fontFamily: "sans-serif",
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  content: {
    // textAlign: "left",
    padding: 6,
    margin: 6,
    backgroundColor: '#5AF',
    color: 'white',
    fontSize: "12rem",
    fontWeight: "800",
  }
});

export { useStyles };