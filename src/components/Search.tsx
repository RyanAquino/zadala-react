import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import React, { ChangeEvent, Dispatch } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      padding: 3,
    },
  })
);

const Search = ({
  setPageNumber,
  setQuery,
}: {
  setPageNumber: Dispatch<number>;
  setQuery: Dispatch<string>;
}): JSX.Element => {
  const classes = useStyles();
  const handleSearch = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search products"
        startAdornment={<SearchIcon />}
        onChange={(e) => handleSearch(e)}
      />
    </Paper>
  );
};

export default Search;
