import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import "./importar.css";
import InfoIcon from "@mui/icons-material/Info";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { ButtonPrimary, ButtonSecundary } from "./boton";
import Axios from "axios";
import Tabla from "./tabla";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  agrupamiento: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedTableRow: {
    "&$selected, &$selected:hover": {
      backgroundColor: "#2477EA",
    },
  },
  paper: {
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "5px",
    margin: "10px",
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
  table: {
    minWidth: 650,
  },
  p: {
    margin: "0 0 0 0",
  },
}));

const Importar = () => {
  const classes = useStyles();
  const [agrupamiento, setAgrupamiento] = React.useState(false);
  const [sinAgrupamiento, setSinAgrupamiento] = React.useState(false);

  const handleChangeAgrupamiento = (event) => {
    setAgrupamiento(event.target.checked);
  };
  const handleChangeSinAgrupamiento = (event) => {
    setSinAgrupamiento(event.target.checked);
  };

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

  return (
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
              secuencias genómicas SARS-CoV-2 del Perú a procesar, estos
              archivos deben ser los obtenidos en la base de datos GISAID.
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
                <ButtonPrimary onClick={click}>
                  Selecciona tus archivos
                </ButtonPrimary>
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
        <Typography variant="h6" className={classes.bold}>
          Seleccionar una opción:
        </Typography>
        <Grid container className={classes.agrupamiento}>
          <Grid item xs={6} className={classes.checkbox}>
            <FormControlLabel
              className={classes.p}
              control={
                <Checkbox
                  checked={agrupamiento}
                  onChange={handleChangeAgrupamiento}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Realizar el agrupamiento de todas las secuencias genómicas
              SARS-CoV-2 nuevamente, esto quiero decir, agrupar las nuevas
              secuencias agregadas con las anteriores registradas en el sistema.
            "
            />
          </Grid>
          <Grid item xs={6} className={classes.checkbox}>
            <FormControlLabel
              className={classes.p}
              control={
                <Checkbox
                  checked={sinAgrupamiento}
                  onChange={handleChangeSinAgrupamiento}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="No realizar el agrupamiento con las nuevas secuencias agregadas,
              solo ubicarlas en los gráficos para una mayor comprensión. Esto
              quiere decir que estas nuevas secuencias no pertenecerán a ningún
              cluster en específico."
            />
          </Grid>
        </Grid>
        <div className={classes.botones}>
          <ButtonPrimary onClick={uploadFile}>Importar datos</ButtonPrimary>
          <ButtonSecundary>Cancelar</ButtonSecundary>
        </div>
        <Tabla />
      </Box>
    </Grid>
  );
};

export default Importar;
