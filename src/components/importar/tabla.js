import React from "react";
import Table from "@material-ui/core/Table";
import { alpha } from "@mui/material/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import PropTypes from "prop-types";
import SearchBar from "material-ui-search-bar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@mui/material/Toolbar";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { Box, Grid, Typography } from "@material-ui/core";
import Axios from "axios";
import Cargando from "../espacio-temporal/cargando";
import { visuallyHidden } from "@mui/utils";
import TableSortLabel from "@mui/material/TableSortLabel";
import { ButtonDelete, ButtonNo, ButtonSi } from "./boton";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import FadeLoader from "react-spinners/FadeLoader";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 500,
  bgcolor: "background.paper",
  border: "0px solid #000",
  paddingTop: "0px",
  marginTop: "0px",
  paddingBottom: "20px",
  paddingLeft: "20px",
  paddingRight: "20px",
};

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

const columns = [
  { id: "nombre", label: "Departamento", minWidth: 170 },
  {
    id: "codigo",
    label: "ID de acceso de la secuencia genómica \u00a0(*)",
    minWidth: 100,
  },
  {
    id: "fecha",
    label: "Fecha de recolección",
    minWidth: 170,
    align: "center",
    fontWeight: 500,
    background: "#FFFFFF",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "nomenclatura",
    label: "Nomenclatura según la OMS de la variante identificada",
    minWidth: 170,
    align: "center",
    background: "#FFFFFF",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "variante",
    label: "Nombre de la variante identificada",
    minWidth: 170,
    align: "center",
    background: "#FFFFFF",
    format: (value) => value.toFixed(2),
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
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align="center"
            background={column.background}
            style={{
              minWidth: column.minWidth,
              fontWeight: column.fontWeight,
            }}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : "asc"}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
              {orderBy === column.id ? (
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
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
  spinner: {
    padding: "10px",
    marginTop: "50px",
    marginBottom: "50px",
    align: "center",
    textAlign: "center",
    left: "0px",
  },
  grid1: {
    marginTop: "5px",
    align: "center",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
  toolbar: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  paper2: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px",
  },
  bold: {
    fontWeight: 600,
    padding: "10px",
  },
  bold1: {
    fontWeight: 600,
    paddingTop: "40px",
  },
  imagen: {
    marginLeft: "10px",
    color: "#0000",
  },
  pagination: {
    paddingLeft: "800px",
  },
  close: {
    cursor: "pointer",
  },
  decision: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  decision2: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="Primera página"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Siguiente página"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Última página"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Tabla = () => {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filas, setFilas] = React.useState([]);
  const [rows1, setRows1] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [bandera, setBandera] = React.useState(false);

  React.useEffect(() => {
    Axios.post(`http://3.86.154.241/tabla/`)
      .then((response) => {
        const val1 = response.data;
        if (val1 === "No hay datos") {
          setBandera(true);
        } else {
          setBandera(false);
          setFilas(response.data);
          setRows1(response.data);
          setCargando(false);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filas.map((n) => n.codigo);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, codigo) => {
    const selectedIndex = selected.indexOf(codigo);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, codigo);
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

  const isSelected = (codigo) => selected.indexOf(codigo) !== -1;

  const [searched, setSearched] = React.useState("");

  const requestSearch = (searchedVal) => {
    const filteredRows = filas.filter((row) => {
      return row.codigo.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows1(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const [openModal, setOpenModal] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openModalCargando, setOpenModalCargando] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModalCargando = () => {
    setOpenModalCargando(true);
  };
  const handleCloseModalCargando = () => {
    setOpenModalCargando(false);
  };

  const eliminar = () => {
    handleOpen();
  };

  const deleteSecuencias = () => {
    handleClose();
    handleOpenModalCargando();
    Axios.post(`http://3.86.154.241/eliminar/`, selected)
      .then((response) => {
        const val1 = response.data;
        if (val1[0] === true) {
          setDescription("Se elimino correctamente las secuencias");
          handleCloseModalCargando();
          handleOpenModal();
          setBandera(false);
          setFilas(val1[1]);
          setRows1(val1[1]);
          setSelected([]);
        } else {
          setDescription("Hubo un problema al eliminar las secuencias");
          handleOpenModal();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Grid item xs={12} sm={12}>
      <Typography variant="h5" align="center" className={classes.bold1}>
        Eliminar secuencias genómicas SARS-CoV-2
      </Typography>
      {!bandera && (
        <Box className={classes.paper2} boxShadow={0} height={620}>
          <SearchBar
            value={searched}
            placeholder="Buscar por ID de acceso de la secuencia genómica SARS-CoV-2"
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          />
          <Toolbar
            className={classes.toolbar}
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              ...(selected.length > 0 && {
                bgcolor: (theme) =>
                  alpha("#589AF6", theme.palette.action.activatedOpacity),
              }),
            }}
          >
            {selected.length > 0 ? (
              <Typography
                sx={{ flex: "1 1 100%" }}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {selected.length} seleccionados
              </Typography>
            ) : (
              <Typography variant="h6" align="center" className={classes.bold}>
                Datos de las secuencias genómicas SARS-CoV-2
              </Typography>
            )}
            {selected.length > 0 && (
              <Tooltip title="Eliminar">
                <ButtonDelete onClick={eliminar}>
                  <DeleteIcon />
                </ButtonDelete>
              </Tooltip>
            )}
          </Toolbar>
          {cargando && <Cargando />}
          {!cargando && (
            <TableContainer className={classes.container}>
              <Table stickyHeader>
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows1.length}
                />
                <TableBody>
                  {stableSort(rows1, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.codigo);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.codigo)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.codigo}
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
                            align="center"
                          >
                            {row.nombre}
                          </TableCell>
                          <TableCell align="center">{row.codigo}</TableCell>
                          <TableCell align="center">{row.fecha}</TableCell>
                          <TableCell align="center">
                            {row.nomenclatura}
                          </TableCell>
                          <TableCell align="center">{row.variante}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {!cargando && (
            <Grid container justifyContent="space-between">
              <div style={{ paddingTop: "15px" }}>
                (*) Identificador en la base de datos GISAID.
              </div>
              <TablePagination
                className="mx-auto"
                labelRowsPerPage={"Filas por página"}
                rowsPerPageOptions={[10, 15, 20]}
                component="div"
                count={filas.length}
                labelDisplayedRows={({ from, to, count }) => {
                  return "" + from + "-" + to + " de " + count;
                }}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              ></TablePagination>
            </Grid>
          )}
        </Box>
      )}
      {bandera && <Box></Box>}
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <Box sx={{ ...style }}>
          <Grid container className={classes.decision}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className={classes.bold}
            >
              Confirmación
            </Typography>
            <CloseIcon onClick={handleClose} className={classes.close} />
          </Grid>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            className={classes.grid}
          >
            ¿Está seguro que desea eliminar las secuencias genómicas SARS-CoV-2
            seleccionadas?
          </Typography>
          <Grid container className={classes.decision2}>
            <ButtonSi onClick={deleteSecuencias}>Sí</ButtonSi>
            <ButtonNo onClick={handleClose}>No</ButtonNo>
          </Grid>
        </Box>
      </StyledModal>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={openModal}
        BackdropComponent={Backdrop}
      >
        <Box sx={{ ...style }}>
          <Grid container className={classes.decision2}>
            <CheckCircleOutlineRoundedIcon color="success" fontSize="large" />
            <Typography variant="h6" className={classes.bold}>
              {description}
            </Typography>
            <ButtonNo onClick={handleCloseModal}>Cerrar</ButtonNo>
          </Grid>
        </Box>
      </StyledModal>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={openModalCargando}
        BackdropComponent={Backdrop}
      >
        <Box sx={{ ...style }}>
          <div className={classes.grid1}>
            <div className={classes.spinner}>
              <FadeLoader
                className={classes.spinner}
                color="#003E97"
                radius={20}
                height={15}
                width={5}
                heightUnit={0}
                margin="2px"
              />
            </div>
            <Typography variant="h6" className={classes.bold}>
              Eliminando las secuencias genómicas SARS-CoV-2
            </Typography>
          </div>
        </Box>
      </StyledModal>
    </Grid>
  );
};

export default Tabla;
