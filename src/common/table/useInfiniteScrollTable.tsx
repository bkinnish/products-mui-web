// This code was based on:
//   https://mui.com/material-ui/react-table/#sorting-amp-selecting
//   https://virtuoso.dev/table-fixed-headers/
import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";

import { TableVirtuoso } from "react-virtuoso";

interface idRequired {
  id: string;
}

/* Table definition */
interface InfiniteScrollTableProps<Tdata extends idRequired> {
  data: Tdata[];
  columnMetadata: ColumnMetadata<Tdata>[];
  showSelectedColumn: boolean;
  tableHeading: React.ReactNode;
}

/* Column definition */
export interface ColumnMetadata<Tdata> {
  propertyName: string & keyof Tdata;
  heading: string;
  align: CellAlignment;
  width?: number;
  padding: boolean;
  /** A custom column has like Add/Edit buttons in it (ie not data) */
  isCustomColumn?: boolean;
  customComponent?: (data: Tdata) => {};
  isSortColumn?: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Tdata>(
  order: Order,
  orderBy: keyof Tdata // data property name
) {
  return order === "desc"
    ? (a: Tdata, b: Tdata) => descendingComparator<Tdata>(a, b, orderBy)
    : (a: Tdata, b: Tdata) => -descendingComparator<Tdata>(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export enum CellAlignment {
  Left,
  Center,
  Right,
}

type align = "inherit" | "left" | "center" | "right" | "justify";

function getCellAlignment(col: CellAlignment): align {
  switch (col) {
    case CellAlignment.Left:
      return "left";
    case CellAlignment.Right:
      return "right";
    default:
      return "center";
  }
}

interface EnhancedTableHeaderProps<Tdata> {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Tdata
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  columnMetadata: ColumnMetadata<Tdata>[];
  showSelectedColumn?: boolean;
}

function EnhancedTableHeader<Tdata>(props: EnhancedTableHeaderProps<Tdata>) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Tdata) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableRow>
      {props.showSelectedColumn && (
        <TableCell
          padding="checkbox"
          style={{ width: 20, background: "white" }}
        >
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all items",
            }}
          />
        </TableCell>
      )}
      {props.columnMetadata.map((col) => (
        <TableCell
          style={{ width: col.width, background: "white" }}
          key={col.propertyName}
          align={
            col.align === CellAlignment.Left
              ? "left"
              : col.align === CellAlignment.Right
              ? "right"
              : "center"
          }
          padding={col.padding ? "normal" : "none"}
          sortDirection={orderBy === col.propertyName ? order : false}
        >
          {/* {col.isCustomColumn && <div>{col.heading}</div>}
          {!col.isCustomColumn && ( */}
          {col.isSortColumn === false && <div>{col.heading}</div>}
          {(col.isSortColumn === undefined || col.isSortColumn) && (
            <TableSortLabel
              active={orderBy === col.propertyName}
              direction={orderBy === col.propertyName ? order : "asc"}
              onClick={createSortHandler(col.propertyName)}
            >
              <div style={{ fontWeight: "bold" }}>{col.heading}</div>
              {orderBy === col.propertyName ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          )}
          {/* )} */}
        </TableCell>
      ))}
    </TableRow>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  tableHeading: React.ReactNode;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {props.tableHeading}
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

// ---------------------------------------------------------------------------------------- //
function InfiniteScrollTable<Tdata extends idRequired>(
  props: InfiniteScrollTableProps<Tdata>
): React.ReactElement {
  // const InfiniteScrollTable: <Tdata extends idRequired>(
  //   props: InfiniteScrollTableProps<Tdata>
  // ) => React.ReactElement = props => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [densePadding, setDensePadding] = React.useState(true);

  let rows = props.data;

  function handleRequestSort<Tdata>(
    event: React.MouseEvent<unknown>,
    property: keyof Tdata
  ) {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property as string);
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangeDensePadding = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDensePadding(event.target.checked);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const comparer = getComparator<Tdata>(order, orderBy as any);
  const sortedData = stableSort<Tdata>(rows, comparer);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          tableHeading={props.tableHeading}
        />
        <TableVirtuoso
          style={{ height: 500 }}
          data={sortedData ?? []}
          components={{
            Scroller: React.forwardRef((props, ref) => (
              <TableContainer component={Paper} {...props} ref={ref} />
            )),
            Table: (props) => (
              <Table
                {...props}
                style={{ borderCollapse: "separate" }}
                sx={{ minWidth: 650 }}
                size={densePadding ? "small" : "medium"}
                aria-label="infinite-scroll-table"
              />
            ),
            TableHead: TableHead,
            TableRow: TableRow,
            TableBody: React.forwardRef((props, ref) => (
              <TableBody {...props} ref={ref} />
            )),
          }}
          fixedHeaderContent={() => (
            <EnhancedTableHeader
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              columnMetadata={props.columnMetadata}
              showSelectedColumn={props.showSelectedColumn}
            />
          )}
          itemContent={(index, row) => {
            const isItemSelected = isSelected(row.id);
            const labelId = `infinite-scroll-checkbox-${index}`;

            return (
              <>
                {props.showSelectedColumn && (
                  <TableCell
                    padding="checkbox"
                    style={{ width: 20 }}
                    scope="row"
                    id={labelId}
                  >
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                      role="checkbox"
                      onClick={(event) => handleClick(event, row.id)}
                    />
                  </TableCell>
                )}
                {props.columnMetadata.map((col) => {
                  const cellValue =
                    col.isCustomColumn && col.customComponent !== null
                      ? (col.customComponent as any)(row)
                      : (row[col.propertyName] as any);
                  return (
                    <TableCell
                      padding={col.padding ? "normal" : "none"}
                      align={getCellAlignment(col.align)}
                      style={{ width: col.width }}
                    >
                      {cellValue}
                    </TableCell>
                  );
                })}
              </>
            );
          }}
        />
      </Paper>
      <FormControlLabel
        control={
          <Switch checked={densePadding} onChange={handleChangeDensePadding} />
        }
        label="Dense padding"
      />
    </Box>
  );
}

export default InfiniteScrollTable;
