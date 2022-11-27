import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  header: {
    background: '#5AF'
  },
  logo: {
    width: "10rem"
  },
  account: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
  },
  walletIcon: {
    marginRight: "0.5rem",
  }
});

export { useStyles };