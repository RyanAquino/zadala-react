import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
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
