import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import deLocale from "date-fns/locale/es";
import { Box,Container,Grid,MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import { NavBtn, Button} from './botones';
import PropTypes from 'prop-types';
import { Typography,FormControl,InputLabel } from '@material-ui/core';
import Axios from 'axios';
import {Mapa, Tiempo} from './graficos';
import Cargando from './cargando';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  bold: {
    fontWeight: 600,
  },
  paper1: {
    backgroundColor: '#ffffff',
    padding: '10px',
    borderRadius: '5px',
    margin: '10px',
  },
  paper2: {
    backgroundColor: '#ffffff',
    padding: '10px',
    borderRadius: '5px',
    margin: '10px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    textAlign: 'center'
  },
}));

const EspacioTiempo = (props) => {

    const options = [
      {"id_algoritmo": 1, "nombre": "K-means"},
      {"id_algoritmo": 2, "nombre": "Jerárquico"},
      {"id_algoritmo": 3, "nombre": "DBSCAN"}
    ];

    const [inicioDate, setInicioDate] = React.useState('Wed Apr 08 2020 20:51:01 GMT-0500');
    const [finDate, setFinDate] = React.useState('Wed Sep 01 2021 20:00:01 GMT-0500');
    const [algoritmo, setAlgoritmo] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const [state,setState] = React.useState({
      fechaIni: inicioDate,
      fechaFin: finDate,
      algoritmo: algoritmo
    })

    const {pasarDatos} = props;

    const handleInicioDateChange = (date) => {
      setInicioDate(date);
      setState({fechaIni: date,fechaFin: state.fechaFin, algoritmo: state.algoritmo});
    };
    const handleFinDateChange = (date) => {
      setFinDate(date);
      setState({fechaIni: state.fechaIni,fechaFin: date, algoritmo: state.algoritmo});
    };

    const handleChange = (event) => {
      setAlgoritmo(event.target.value);
      setState({fechaIni: state.fechaIni,fechaFin: state.fechaFin,algoritmo: event.target.value});
    };  
    const handleClose = () => {
      setOpen(false);
    };  
    const handleOpen = () => {
      setOpen(true);
    };

    function convert(str) {
      var date= new Date(str);
      var mnth = ("0" + (date.getMonth() + 1)).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }
    const fechaIni=convert(state.fechaIni)
    const fechaFin=convert(state.fechaFin)
    const params=`fechaIni=${fechaIni}&fechaFin=${fechaFin}`

    const classes = useStyles();
    const [cargandoMapa, setCargandoMapa] = React.useState(true);
    const [cargandoLineal, setCargandoLineal] = React.useState(true);
    const [cargandoCircular, setCargandoCircular] = React.useState(true);
    
    React.useEffect(() => {
      Axios.post(`http://54.91.170.71/graficolineal/?${params}`).then((response) => {
        const val1 = response.data
        const item1= JSON.parse(val1)
        window.Bokeh.embed.embed_item(item1, 'graficolineal')
        setCargandoLineal(false);
      });
      // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
      Axios.post(`http://54.91.170.71/mapa/?${params}`).then((response) => {
        const val = response.data
        const item= JSON.parse(val)
        window.Bokeh.embed.embed_item(item, 'mapa')
        setCargandoMapa(false);
      });
      // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
      Axios.post(`http://54.91.170.71/graficocircular/?${params}`).then((response) => {
        const val1 = response.data
        const item1= JSON.parse(val1)
        window.Bokeh.embed.embed_item(item1, 'graficocircular')
        setCargandoCircular(false);
      });
      // eslint-disable-next-line
    }, []);

    function click() {
      pasarDatos(state);
      const fechaIni=convert(state.fechaIni);
      const fechaFin=convert(state.fechaFin);
      const params=`fechaIni=${fechaIni}&fechaFin=${fechaFin}`

      setCargandoLineal(true);
      Axios.post(`http://54.91.170.71/graficolineal/?${params}`).then((response) => {
        const val1 = response.data
        const item1= JSON.parse(val1)
        window.Bokeh.embed.embed_item(item1, 'graficolineal')
        setCargandoLineal(false);
      });

      setCargandoMapa(true);
      Axios.post(`http://54.91.170.71/mapa/?${params}`).then((response) => {
        const val = response.data
        const item= JSON.parse(val)
        window.Bokeh.embed.embed_item(item, 'mapa')
        setCargandoMapa(false);
      });

      setCargandoCircular(true);
      Axios.post(`http://54.91.170.71/graficocircular/?${params}`).then((response) => {
        const val1 = response.data
        const item1= JSON.parse(val1)
        window.Bokeh.embed.embed_item(item1, 'graficocircular')
        setCargandoCircular(false);
      });
    }

    return (
      <Grid container>
      <Grid item xs={12} sm={12}>
        <Box className={classes.paper2} boxShadow={0}>
        <Container maxWidth={false}>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
          <Grid container justifyContent="space-around" alignItems="stretch">
            <KeyboardDatePicker
              disableToolbar
              label="Fecha Inicio"
              inputProps={{min: 0, style: { textAlign: 'center' }}}
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="fecha-inicio"
              width= "100%"
              value={inicioDate}
              onChange={handleInicioDateChange}
              KeyboardButtonProps={{'roboto-label': 'change date',}}/>
            <KeyboardDatePicker
              disableToolbar
              label="Fecha Fin"
              variant="inline"
              format="dd/MM/yyyy"
              inputProps={{min: 0, style: { textAlign: 'center' }}}
              margin="normal"
              id="fecha-fin"
              value={finDate}
              onChange={handleFinDateChange}
              KeyboardButtonProps={{'roboto-label': 'change date',}}/>
            <FormControl 
              className={classes.formControl}>
            <InputLabel htmlFor="name">
              Algoritmo de agrupamiento
            </InputLabel>
            <Select
              id="algoritmo-select"
              name="name"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={algoritmo}
              onChange={handleChange}>
                {options.map((item, i)=>(<MenuItem key={"algoritmo"+i} value={i}>{item.nombre}</MenuItem >))}
            </Select>
            </FormControl>
            <NavBtn>
                <Button onClick={click}>Generar</Button>
            </NavBtn>
          </Grid>        
        </MuiPickersUtilsProvider>
        </Container>
        </Box>
        </Grid>
          <Grid item xs={12} sm={6}>
            <Box className={classes.paper1}  boxShadow={0} height={650}>
              <Typography 
                variant= "h6"
                align= "center"
                className={classes.bold}>
                Variantes identificadas en el espacio
              </Typography>
              {cargandoMapa && (
                <Cargando />
              )}
              {!cargandoMapa && (
                <Mapa id='mapa' className="bk-root" ></Mapa>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className={classes.paper1} boxShadow={0} height={650}>
              <Typography 
                variant= "h6"
                align= "center"
                className={classes.bold}>
                Porcentaje de variantes identificadas en el tiempo
              </Typography>
              {cargandoCircular && (
                <Cargando />
              )}
              {!cargandoCircular && (
                <Tiempo id='graficocircular' className="bk-root"></Tiempo>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box className={classes.paper1} boxShadow={0} height={550}>
              <Typography 
                variant= "h6"
                align= "center"
                className={classes.bold}>
                Variantes identificadas en el tiempo
              </Typography>
              {cargandoLineal && (
                <Cargando />
              )}
              {!cargandoLineal && (
                <Tiempo id='graficolineal' className="bk-root"></Tiempo>
              )}
            </Box>
          </Grid>
        </Grid>
    );
};

EspacioTiempo.propTypes = {
  pasarDatos: PropTypes.func.isRequired
}

export default EspacioTiempo;