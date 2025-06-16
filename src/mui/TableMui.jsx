import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { LoadingOverlaySmall } from "./LoadingOverlay";
export default function TableMui({
  th,
  td,
  styleTableTh,
  styleTableContainer,
  styleTableThead,
  second,
  headerRounded,
  rowRounded,
  customFields,
  loading,
  minWidth = "900px",
}) {
  const found = (key) => customFields?.find((obj) => obj.name === key);
  return (
    <>
      <TableContainer style={styleTableContainer}>
        <Table
          aria-label="simple table"
          style={{
            borderCollapse: "separate",
            borderSpacing: "0px 0px",
            // minWidth: "900px",
          }}
        >
          <Header
            headerRounded
            values={{
              styleTableThead,
              th,
              loading,
              styleTableTh,
            }}
          />
          {!loading && (
            <TableBody>
              {td?.map((row, index) => (
                <MuiTableRow
                  key={index}
                  rowRounded
                  second={second}
                  values={{ row, th, index, found, customFields }}
                />
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {loading && <LoadingOverlaySmall open={loading} />}
    </>
  );
}
const MuiTableRow = ({ values, rowRounded, second }) => {
  const { row, th, index, found, customFields } = values;
  const rowStyle = {
    backgroundColor: "white",
    "& td:first-child": {
      borderRadius: rowRounded ? "0 0 0 0" : 0,
    },
    "& td:last-child": {
      borderRadius: rowRounded ? "0 0 0 0" : 0,
    },
  };
  return (
    <TableRow
      key={index}
      sx={{
        ...rowStyle,
        // backgroundColor: second === true ? "white" : "rgb(244,244,244)",
      }}
    >
      {Object.keys(th).map((key, ind) => (
        <TableCell
          key={ind}
          className="p-3 "
          style={{ whiteSpace: "nowrap" }}
          align="center"
        >
          {customFields && found(key)
            ? found(key).data(row[key], row)
            : getNestedValue(row, key)}
          {key === "sr" && index + 1}
        </TableCell>
      ))}
    </TableRow>
  );
};
const Header = ({ values, headerRounded }) => {
  const { styleTableThead, th, loading, styleTableTh } = values;
  const headerStyle = {
    backgroundColor: "#F57303",
    "& th:first-child": {
      borderRadius: headerRounded ? "0 0 0 0" : 0,
    },
    "& th:last-child": {
      borderRadius: headerRounded ? "0 0 0 0" : 0,
    },
  };
  return (
    <TableHead sx={{ ...headerStyle, ...styleTableThead }}>
      <TableRow>
        {Object.entries(th).map(([key, value], index) => (
          <TableCell key={index} align="center" sx={styleTableTh}>
            {/* {value === 'Select' || value === 'select' ? (
            <input type="checkbox" className="form-check-input me-2" />
          ) : null} */}
            {value}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
const getNestedValue = (obj, key) => {
  const keys = key.split(".");
  return keys.reduce(function (acc, currentKey) {
    return acc && acc[currentKey] !== undefined ? acc[currentKey] : "";
  }, obj);
};
