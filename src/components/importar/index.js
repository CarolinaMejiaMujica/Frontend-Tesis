import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import "./importar.css";
import InfoIcon from "@mui/icons-material/Info";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonImportar,
  ButtonSi,
  ButtonNo,
} from "./boton";
import Axios from "axios";
import Tabla from "./tabla";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import CloseIcon from "@mui/icons-material/Close";
import ModalUnstyled from "@mui/core/ModalUnstyled";
import { styled } from "@mui/system";
import Cargando from "./cargando";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import {
  Nav,
  NavMenu,
  NavBtn,
  NavLink,
  NavBtnLink,
  NavDatos,
} from "../Navbar/NavbarElements";
import Cookies from "universal-cookie";

const cookies = new Cookies();
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

const useStyles = makeStyles((theme) => ({
  boldNav: {
    fontWeight: 800,
    color: "white",
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
  agrupamiento: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "110px",
  },
  paper: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px",
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
  info: {
    color: "#FED708",
  },
  infoTitle: {
    paddingLeft: "20px",
  },
  grid: {
    marginTop: "5px",
    justifyContent: "justify-content",
    paddingLeft: "20px",
    paddingRight: "20px",
    textAlign: "justify",
  },
  upload: {
    color: "#0149B0",
  },
  subir: {
    marginTop: "20px",
  },
  upload2: {
    display: "flex",
    flexDirection: "column",
  },
  botones: {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    alignItems: "center",
  },
  p: {
    margin: "0 0 0 0",
    textAlign: "justify",
  },
}));

const Importar = () => {
  const classes = useStyles();

  React.useEffect(() => {
    if (!cookies.get("nickname")) {
      window.location.href = "./login";
    }
  }, []);

  const [value, setValue] = React.useState("sinagrupamiento");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const inputFileRef = React.useRef(null);
  const preview = React.useRef(null);
  const [archivos, setArchivos] = React.useState([]);
  let variable = "";

  const click = () => {
    inputFileRef.current.click();
  };

  const onFileChange = (e) => {
    variable = e.target.files;
    let newList;
    if (variable.length === 1) {
      newList = archivos.concat(variable[0]);
      setArchivos(newList);
    } else {
      for (const f of variable) {
        newList = archivos.concat(f);
        setArchivos(newList);
      }
    }
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

  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalCargando, setOpenModalCargando] = React.useState(false);
  const [openModalListo, setOpenModalListo] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [textButton, setTextButton] = React.useState("");

  const processFile = (file) => {
    const name = file.name;
    if (name.includes(".tsv") || name.includes(".fasta")) {
      const fileReader = new FileReader();
      const id = `file-${Math.random().toString(32).substring(7)}`;
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
      archivos.pop();
      setDescription("El archivo no es válido");
      setTextButton("Subir archivos");
      handleOpenModal();
    }
  };

  const deleteFile = () => {
    const nuevoHtml = `
        <div>
        </div>
        `;
    preview.current.innerHTML = nuevoHtml;
    setArchivos([]);
  };
  const uploadFile = async () => {
    if (archivos === undefined) {
      setDescription("Debe subir un archivo .FASTA y .TSV");
      setTextButton("Subir archivos");
      handleClose();
      handleOpenModal();
    } else {
      if (archivos.length === 2) {
        handleClose();
        handleOpenModalCargando();
        const formData = new FormData();
        for (let index = 0; index < archivos.length; index++) {
          formData.append("archivos", archivos[index]);
        }
        const params = value === "sinagrupamiento" ? 0 : 1;
        await Axios.post(
          `http://localhost:8000/online/?parametro=${params}`,
          formData,
          {
            headers: { "Content-type": "multipart/form-data" },
          }
        )
          .then((response) => {
            handleCloseModalCargando();
            handleOpenModalListo();
          })
          .catch((error) => {
            console.log(error);
            handleCloseModalCargando();
          });
      } else if (archivos.length === 1) {
        setDescription("Falta subir un archivo");
        setTextButton("Subir archivos");
        handleClose();
        handleOpenModal();
      } else if (archivos.length === 0) {
        setDescription("Debe subir un archivo .FASTA y .TSV");
        setTextButton("Subir archivos");
        handleClose();
        handleOpenModal();
      } else if (archivos.length > 2) {
        setDescription("Solo debe subir dos archivos, uno .FASTA y otro .TSV");
        setTextButton("Subir archivos");
        handleClose();
        handleOpenModal();
      }
    }
  };
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

  const handleOpenModalListo = () => {
    setOpenModalListo(true);
  };
  const handleCloseModalListo = () => {
    setOpenModalListo(false);
    window.location.href = "./graficos";
  };

  const cerrarSesion = () => {
    cookies.remove("nickname", { path: "/" });
    window.location.href = "./graficos";
  };

  return (
    <div>
      <Nav fixed="top">
        <NavMenu>
          <Typography variant="h5" noWrap className={classes.boldNav}>
            Análisis de Secuencias Genómicas SARS-CoV-2 Perú
          </Typography>
          <NavLink>Actualizado el 15/10/2021</NavLink>
          <NavDatos>
            {" "}
            Facilitado por datos de
            <a
              rel="noopener noreferrer"
              href="https://www.gisaid.org"
              target="_blank"
            >
              <img
                src="https://www.gisaid.org/fileadmin/gisaid/img/schild.png"
                alt="gisaid-logo"
                width="60"
              ></img>
            </a>
            .
          </NavDatos>
        </NavMenu>
        <NavBtn onClick={cerrarSesion}>
          <NavBtnLink to="/graficos">Cerrar sesión</NavBtnLink>
        </NavBtn>
      </Nav>
      <section className="contenido wrapper">
        <Grid item xs={12} sm={12}>
          <Box className={classes.paper} boxShadow={0}>
            <Typography variant="h5" align="center" className={classes.bold}>
              Importar datos de las secuencias genómicas SARS-CoV-2
            </Typography>
            <Box className="Box" boxShadow={0}>
              <InfoIcon
                className={classes.info}
                sx={{ fontSize: 30 }}
              ></InfoIcon>
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
                  Subir el archivo .FASTA y el archivo .TSV que contiene todas
                  las secuencias genómicas SARS-CoV-2 del Perú a procesar, estos
                  archivos deben ser los obtenidos en la base de datos GISAID.
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <div className="body">
                  <div className="drag-area">
                    <FileUploadIcon
                      className={classes.upload}
                      sx={{ fontSize: 45 }}
                    />
                    <ButtonPrimary onClick={click}>
                      Selecciona tus archivos
                    </ButtonPrimary>
                    <input
                      type="file"
                      ref={inputFileRef}
                      onChange={onFileChange}
                      hidden
                      accept=".FASTA, .tsv"
                    />
                  </div>
                  <div>
                    <div id="hola">
                      <div className="preview" ref={preview}></div>
                    </div>
                    <ButtonSecondary onClick={deleteFile}>
                      Eliminar archivos
                    </ButtonSecondary>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Typography variant="h6" className={classes.bold}>
              Seleccionar una opción para el agrupamiento:
            </Typography>
            <RadioGroup
              aria-label="gender"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <Grid container className={classes.agrupamiento}>
                <Grid item xs={6} className={classes.checkbox}>
                  <FormControlLabel
                    className={classes.p}
                    value="agrupamiento"
                    control={<Radio />}
                    label="Realizar el agrupamiento de todas las secuencias genómicas
              SARS-CoV-2 nuevamente, es decir, agrupar las nuevas
              secuencias agregadas con las anteriores registradas en el sistema.
            "
                  />
                </Grid>
                <Grid item xs={6} className={classes.checkbox}>
                  <FormControlLabel
                    className={classes.p}
                    value="sinagrupamiento"
                    control={<Radio />}
                    label="No realizar el agrupamiento con las nuevas secuencias agregadas,
              solo ubicarlas visualmente en los gráficos para una mayor comprensión, es decir, 
              que estas nuevas secuencias no pertenecerán a ningún cluster en específico."
                  />
                </Grid>
              </Grid>
            </RadioGroup>
            <div className={classes.botones}>
              <ButtonImportar onClick={handleOpen}>
                Importar datos
              </ButtonImportar>
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
                    <CloseIcon
                      onClick={handleClose}
                      className={classes.close}
                    />
                  </Grid>
                  <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                    className={classes.grid}
                  >
                    ¿Está seguro que desea importar nuevos datos de secuencias
                    genómicas SARS-CoV-2?
                  </Typography>
                  <Grid container className={classes.decision2}>
                    <ButtonSi onClick={uploadFile}>Sí</ButtonSi>
                    <ButtonNo onClick={handleClose}>No</ButtonNo>
                  </Grid>
                </Box>
              </StyledModal>
            </div>
            <StyledModal
              aria-labelledby="unstyled-modal-title"
              aria-describedby="unstyled-modal-description"
              open={openModal}
              onClose={handleCloseModal}
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
                    Mensaje
                  </Typography>
                  <CloseIcon
                    onClick={handleCloseModal}
                    className={classes.close}
                  />
                </Grid>
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2 }}
                  className={classes.grid}
                >
                  {description}
                </Typography>
                <Grid container className={classes.decision2}>
                  <ButtonNo onClick={handleCloseModal}>{textButton}</ButtonNo>
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
                <Cargando />
              </Box>
            </StyledModal>
            <StyledModal
              aria-labelledby="unstyled-modal-title"
              aria-describedby="unstyled-modal-description"
              open={openModalListo}
              BackdropComponent={Backdrop}
            >
              <Box sx={{ ...style }}>
                <Grid container className={classes.decision2}>
                  <CheckCircleOutlineRoundedIcon
                    color="success"
                    fontSize="large"
                  />
                  <Typography variant="h6" className={classes.bold}>
                    Preprocesamiento listo
                  </Typography>
                  <ButtonNo onClick={handleCloseModalListo}>
                    Ver gráficos
                  </ButtonNo>
                </Grid>
              </Box>
            </StyledModal>
            <Tabla />
          </Box>
        </Grid>
      </section>
    </div>
  );
};

export default Importar;
