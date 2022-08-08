import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TablePagination from "@mui/material/TablePagination";
import { Grid, Link } from "@mui/material";
import { fetchOrderHistory, validateToken } from "../api/utils";
import { useHistory } from "react-router";
import {
  OrderHistory,
  OrderHistoryResults,
} from "../Interfaces/Orders.interface";

const OrderHistoryPage: React.FC = () => {
  const history = useHistory();
  const [orderHistoryData, setOrderHistoryData] = useState({} as OrderHistory);
  const handleDateTime = (date: string) => new Date(date).toLocaleString();

  const Row = (props: { row: OrderHistoryResults }) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const totalItems = row.order.order_items
      .map((orderItem) => orderItem.quantity)
      .reduce((total, acc) => total + acc);
    const totalAmount = row.order.order_items
      .map((orderItem) => orderItem.total)
      .reduce((total, acc) => total + acc);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.order.transaction_id}
          </TableCell>
          <TableCell align="right">{handleDateTime(row.date_added)}</TableCell>
          <TableCell align="right">{`${row.address} ${row.city} ${row.state} ${row.zipcode}`}</TableCell>
          <TableCell align="right">{totalItems}</TableCell>
          <TableCell align="right">₱{totalAmount}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Items
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date Added</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Items</TableCell>
                      <TableCell align="right">Total price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.order.order_items.map((orderItem) => (
                      <TableRow key={orderItem.date_added}>
                        <TableCell component="th" scope="row">
                          {handleDateTime(orderItem.date_added)}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/products/${orderItem.product.id}`}
                            underline="none"
                          >
                            {orderItem.product.name}
                          </Link>
                        </TableCell>
                        <TableCell align="right">
                          {orderItem.quantity}
                        </TableCell>
                        <TableCell align="right">₱{orderItem.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  useEffect(() => {
    if (!validateToken()) history.push("/login");
    else {
      const orderHistory = async () => await fetchOrderHistory();
      orderHistory().then((orderHistory: OrderHistory) => {
        setOrderHistoryData(orderHistory);
      });
    }
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    const orderHistory = async () =>
      await fetchOrderHistory(newPage + 1, rowsPerPage);
    orderHistory().then((orderHistory: OrderHistory) => {
      setOrderHistoryData(orderHistory);
    });
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(rowsPerPage);
    setPage(0);
    const orderHistory = async () => await fetchOrderHistory(1, rowsPerPage);
    orderHistory().then((orderHistory: OrderHistory) => {
      setOrderHistoryData(orderHistory);
    });
  };

  return (
    <Grid item container justifyContent={"center"} xs={12} md={10}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <Typography variant="h6" gutterBottom component="div">
                  Tracking ID
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6" gutterBottom component="div">
                  Date Ordered
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6" gutterBottom component="div">
                  Address
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6" gutterBottom component="div">
                  Total Items
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6" gutterBottom component="div">
                  Total Amount
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(orderHistoryData.results || []).map(
              (row: OrderHistoryResults) => (
                <Row key={row.order.transaction_id} row={row} />
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orderHistoryData.count || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Grid>
  );
};

export default OrderHistoryPage;
