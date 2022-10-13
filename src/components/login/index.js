import React from "react";
import {
  Grid,
  Container,
  Paper,
  Avatar,
  Typography,
  Button,
  CssBaseline,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {
  Nav,
  NavMenu,
  NavBtn,
  NavLink,
  NavBtnLink,
  NavDatos,
} from "../Navbar/NavbarElements";
import "./login.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const useStyles = makeStyles((theme) => ({
  incorrect: {
    textAlign: "center",
    justifyContent: "center",
    color: "red",
  },
  subtitle: {
    padding: "10px",
  },
  infoTitle: {
    paddingLeft: "20px",
  },
  root: {
    flexGrow: 1,
  },
  bold: {
    fontWeight: 800,
    color: "white",
  },
  paper1: {
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
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  root2: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  container: {
    opacity: "0.8",
    height: "90%",
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down(400 + theme.spacing(2) + 2)]: {
      marginTop: 0,
      width: "100%",
      height: "100%",
    },
  },
  div: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(3, 0, 2),
    background: "#B51476",
  },
}));

const Login = () => {
  const classes = useStyles();

  React.useEffect(() => {
    if (cookies.get("nickname")) {
      window.location.href = "./importar";
    }
  }, []);

  const [values, setValues] = React.useState({
    nickname: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [incorrect, setIncorrect] = React.useState(false);

  const onSubmit = () => {
    if (values.nickname === "admin" && values.password === "secuencias") {
      setIncorrect(false);
      cookies.set("nickname", values.nickname, { path: "/" });
      window.location.href = "./importar";
    } else {
      setIncorrect(true);
    }
  };

  const boton = () => {
    window.location.href = "./graficos";
  };

  return (
    <>
      <Nav fixed="top">
        <NavMenu>
          <Typography variant="h5" noWrap className={classes.bold}>
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
        <NavBtn onClick={boton}>
          <NavBtnLink to="/graficos">Ver gráficos</NavBtnLink>
        </NavBtn>
      </Nav>
      <section className="contenido wrapper">
        <Grid container component="main">
          <CssBaseline />
          <Container
            component={Paper}
            elevation={5}
            maxWidth="xs"
            className={classes.container}
          >
            <div className={classes.div}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Iniciar sesión
              </Typography>
              <form className={classes.form}>
                <Typography variant="subtitle1" className={classes.subtitle}>
                  Usuario
                </Typography>
                <OutlinedInput
                  fullWidth
                  autoFocus
                  color="primary"
                  variant="outlined"
                  placeholder="Ingresar Usuario"
                  name="nickname"
                  value={values.nickname}
                  onChange={handleChange("nickname")}
                />
                <Typography variant="subtitle1" className={classes.subtitle}>
                  Contraseña
                </Typography>
                <OutlinedInput
                  fullWidth
                  color="primary"
                  variant="outlined"
                  placeholder="Ingresar Contraseña"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={() => onSubmit()}
                >
                  Iniciar sesión
                </Button>
                {incorrect && (
                  <div className={classes.incorrect}>
                    Usuario y/o Contraseña incorrecta
                  </div>
                )}
              </form>
            </div>
          </Container>
        </Grid>
      </section>
    </>
  );
};

export default Login;
