import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  header: {
    background: '#5AF',
    height: "9%",
    margin: "0",
  },
  logo: {
    width: "30px",
    height: "30px"
  },
  account: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
  },
  walletIcon: {
    marginRight: "0.5rem",
  },
  title: {
    fontFamily: "Luminari, fantasy",
    fontSize: "1.8rem",
    fontWeight: "600",
  },
  content: {
    position: 'absolute',
    alignItems: "center",
  },
  body: {
    backgroundColor: '#f0fdf0',
  }
});

export { useStyles };