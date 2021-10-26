import React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid } from "@material-ui/core";
import "./importar.css";
//import { Typography } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { ButtonPrimary, ButtonSecundary } from "./boton";
import Axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SearchBar from "material-ui-search-bar";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 4.0),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Dessert (100g serving)",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "Calories",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "Fat (g)",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Carbs (g)",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Protein (g)",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: "between",
    alignItems: "center",
  },
  paper: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px",
  },
  paper2: {
    backgroundColor: "#FFF9C6",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px",
    display: "flex",
    flexDirection: "row",
  },
  bold: {
    fontWeight: 600,
    padding: "10px",
  },
  info: {
    color: "#FED708",
  },
  infoTitle: {
    paddingLeft: "20px",
  },
  grid: {
    marginTop: "5px",
    justifyContent: "justify-content",
    marginLeft: "10px",
  },
  upload: {
    color: "#0149B0",
  },
  subir: {
    marginTop: "20px",
  },
  p: {
    margin: "0px",
  },
  upload2: {
    display: "flex",
    flexDirection: "column",
  },
  botones: {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
  },
  table: {
    minWidth: 650,
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={classes.toolbar}
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha("#589AF6", theme.palette.action.activatedOpacity),
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
          {numSelected} seleccionados
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Datos de las secuencias genómicas SARS-CoV-2
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Eliminar">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

//const columns = ["name", "calories", "fat", "carbs", "proteing"];

const originalRows = [
  { name: "Pizza", calories: 200, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Hot Dog", calories: 300, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Burger", calories: 400, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Hamburger", calories: 500, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Fries", calories: 600, fat: 6.0, carbs: 24, protein: 4.0 },
  { name: "Ice Cream", calories: 700, fat: 6.0, carbs: 24, protein: 4.0 },
];

const Importar = () => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const classes = useStyles();
  const [rows1, setRows1] = React.useState(rows);
  const [searched, setSearched] = React.useState("");

  const inputFileRef = React.useRef(null);
  const preview = React.useRef(null);
  const fooBarRef = React.useRef(null);
  const fooBarNode = fooBarRef.current;
  const text = React.useRef(null);
  const textArrastra = text.current;
  const [archivos, setArchivos] = React.useState();
  let variable = "";

  const click = () => {
    inputFileRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    fooBarNode.classList.add("active");
    textArrastra.textContent = "suelta para subir los archivos";
    e.stopPropagation();
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    fooBarNode.classList.remove("active");
    textArrastra.textContent = "o arrastra y suelta los archivos acá";
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    variable = e.dataTransfer.files;
    setArchivos(e.dataTransfer.files);
    showFiles(variable);
    fooBarNode.classList.remove("active");
    textArrastra.textContent = "o arrastra y suelta los archivos acá";
    e.stopPropagation();
  };

  const onFileChange = (e) => {
    variable = e.target.files;
    setArchivos(e.target.files);
    showFiles(variable);
  };

  const showFiles = (arch) => {
    if (arch.length === undefined) {
      processFile(arch);
    } else {
      for (const f of arch) {
        processFile(f);
      }
    }
  };
  const [ids, setIds] = React.useState([]);
  const ids1 = [];

  const processFile = (file) => {
    const name = file.name;
    if (name.includes(".tsv") || name.includes(".fasta")) {
      const fileReader = new FileReader();
      const id = `file-${Math.random().toString(32).substring(7)}`;
      ids1.push(id);
      fileReader.addEventListener("load", (e) => {
        const image = `
        <div id="${id}" className="file-container" style="padding-top: 10px; padding-left: 15px; padding-right: 10px">
          <div className="status">
            <img src="https://img.icons8.com/office/40/000000/document--v1.png" width="30" height="30">
            <span>${file.name}</span>
          </div>
        </div>
        `;
        const html = preview.current.innerHTML;
        preview.current.innerHTML = image + html;
      });
      fileReader.readAsDataURL(file);
    } else {
      alert("no es un archivo válido");
    }
  };

  const deleteFile = () => {
    setIds(ids1);
    console.log(ids);
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        console.log(element);
        element.removeChild(element.firstChild);
      }
    });
    setArchivos(0);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    for (let index = 0; index < archivos.length; index++) {
      formData.append("archivos", archivos[index]);
    }
    await Axios.post("http://127.0.0.1:8000/online/", formData, {
      headers: { "Content-type": "multipart/form-data" },
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = originalRows.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows1(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={12}>
        <Box className={classes.paper} boxShadow={0}>
          <Typography variant="h5" align="center" className={classes.bold}>
            Importar datos de las secuencias genómicas SARS-CoV-2
          </Typography>
          <Box className="Box" boxShadow={0}>
            <InfoIcon className={classes.info} sx={{ fontSize: 30 }}></InfoIcon>
            <Typography
              variant="subtitle1"
              align="center"
              className={classes.infoTitle}
            >
              Los datos importados serán almacenados en una base de datos y se
              realizará un procesamiento de estos datos para el respectivo
              análisis de secuencias genómicas SARS-CoV-2.
            </Typography>
          </Box>
          <Grid container className={classes.subir}>
            <Grid item xs={5}>
              <Typography variant="h6" className={classes.bold}>
                Subir archivo .FASTA y .TSV
              </Typography>
              <Typography variant="subtitle1" className={classes.grid}>
                Subir el archivo .FASTA y el archivo .TSV que contiene todas las
                secuencias genómicas SARS-CoV-2 del Perú a procesar
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <div className="body">
                <div
                  className="drag-area"
                  ref={fooBarRef}
                  onDrop={(e) => handleDrop(e)}
                  onDragLeave={(e) => handleDragLeave(e)}
                  onDragOver={(e) => handleDragOver(e)}
                >
                  <FileUploadIcon
                    className={classes.upload}
                    sx={{ fontSize: 45 }}
                  />
                  <ButtonSecundary onClick={click}>
                    Selecciona tus archivos
                  </ButtonSecundary>
                  <p ref={text}>o arrastra y suelta los archivos acá</p>
                  <input
                    type="file"
                    ref={inputFileRef}
                    onChange={onFileChange}
                    hidden
                    multiple
                    accept=".FASTA, .tsv"
                  />
                </div>
                <div>
                  <div className="preview" ref={preview}></div>
                  <ButtonSecundary onClick={deleteFile}>
                    Eliminar archivos
                  </ButtonSecundary>
                </div>
              </div>
            </Grid>
          </Grid>

          <Paper>
            <SearchBar
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
            <Box sx={{ width: "100%" }}>
              <Paper sx={{ width: "100%", mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                    />
                    <TableBody>
                      {stableSort(rows, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          const isItemSelected = isSelected(row.name);
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              onClick={(event) => handleClick(event, row.name)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.name}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                  inputProps={{
                                    "aria-labelledby": labelId,
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                              >
                                {row.name}
                              </TableCell>
                              <TableCell align="right">
                                {row.calories}
                              </TableCell>
                              <TableCell align="right">{row.fat}</TableCell>
                              <TableCell align="right">{row.carbs}</TableCell>
                              <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: 53 * emptyRows,
                          }}
                        >
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Box>
          </Paper>

          <div className={classes.botones}>
            <ButtonPrimary onClick={uploadFile}>Importar datos</ButtonPrimary>
            <ButtonSecundary>Cancelar</ButtonSecundary>
          </div>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Importar;
