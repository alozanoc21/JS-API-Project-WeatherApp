// Iniciamos las variables (cadenas, fecha actual y array de los elementos que sufrirán cambios)
let cadenaTiempo = "";
let cadenaTiempoActual = "";
let cadenaContaminacion = "";
let cadenaInput = "";
let fechaActual = new Date();
let aCambiar = new Array();

/** 
 * Iniciamos arrays constantes para indicar la fecha y los días, y para asignar los iconos "propios" que hemos elegido
 * a cada uno de los iconos que indica, por defecto, la API a la que llamaremos. Esto último se hará con índices
 */
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DIASACOR = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const ICONOS = {
    t01d: "wi-day-storm-showers",
    t02d: "wi-day-thunderstorm",
    t03d: "wi-day-thunderstorm",
    t04d: "wi-day-lightning",
    t04d: "wi-day-lightning",
    t04d: "wi-day-lightning",
    t05d: "wi-day-lightning",
    d01d: "wi-day-sprinkle",
    d02d: "wi-day-sprinkle",
    d03d: "wi-day-sprinkle",
    r01d: "wi-day-showers",
    r02d: "wi-day-rain",
    r03d: "wi-day-rain-wind",
    f01d: "wi-day-rain",
    r04d: "wi-day-showers",
    r05d: "wi-day-showers",
    r06d: "wi-day-rain",
    s01d: "wi-day-snow",
    s02d: "wi-day-snow",
    s03d: "wi-day-snow",
    s04d: "wi-day-snow",
    s05d: "wi-day-sleet",
    s05d: "wi-day-sleet",
    s01d: "wi-day-snow",
    s02d: "wi-day-snow",
    s06d: "wi-day-snow",
    a01d: "wi-day-fog",
    a02d: "wi-day-fog",
    a03d: "wi-day-fog",
    a04d: "wi-day-fog",
    a05d: "wi-day-fog",
    a06d: "wi-day-fog",
    c01d: "wi-day-sunny",
    c02d: "wi-day-cloudy",
    c02d: "wi-day-cloudy",
    c03d: "wi-cloudy",
    c04d: "wi-cloudy",
    u00d: "wi-day-rain-mix",
    t01n: "wi-night-alt-storm-showers",
    t02n: "wi-night-alt-thunderstorm",
    t03n: "wi-night-alt-thunderstorm",
    t04n: "wi-night-alt-lightning",
    t04n: "wi-night-alt-lightning",
    t04n: "wi-night-alt-lightning",
    t05n: "wi-night-alt-lightning",
    d01n: "wi-night-alt-sprinkle",
    d02n: "wi-night-alt-sprinkle",
    d03n: "wi-night-alt-sprinkle",
    r01n: "wi-night-alt-showers",
    r02n: "wi-night-alt-rain",
    r03n: "wi-night-alt-rain-wind",
    f01n: "wi-night-alt-rain",
    r04n: "wi-night-alt-showers",
    r05n: "wi-night-alt-showers",
    r06n: "wi-night-alt-rain",
    s01n: "wi-night-alt-snow",
    s02n: "wi-night-alt-snow",
    s03n: "wi-night-alt-snow",
    s04n: "wi-night-alt-snow",
    s05n: "wi-night-alt-sleet",
    s05n: "wi-night-alt-sleet",
    s01n: "wi-night-alt-snow",
    s02n: "wi-night-alt-snow",
    s06n: "wi-night-alt-snow",
    a01n: "wi-night-fog",
    a02n: "wi-night-fog",
    a03n: "wi-night-fog",
    a04n: "wi-night-fog",
    a05n: "wi-night-fog",
    a06n: "wi-night-fog",
    c01n: "wi-night-clear",
    c02n: "wi-night-alt-cloudy",
    c02n: "wi-night-alt-cloudy",
    c03n: "wi-cloudy",
    c04n: "wi-cloudy",
    u00n: "wi-night-alt-rain-mix",
    smoke: "wi-smoke"
};

// Variable que será la clave para la API
let tuclave = "cba3e6fd7550452e87089b3adffbbf37";

/** 
 * Función que determina las acciones para cuando esté todo el documento cargado:
 * se indica la fecha, y las instrucciones para  los eventos del input y de los botones
 */
$(function () {

    // Indicamos el día de la semana y la fecha en el panel principal
    $(".dia-semana").html(DIAS[fechaActual.getDay()]);
    $(".fecha").html(fechaActual.getDate() + " de " + MESES[fechaActual.getMonth()] + " de " + fechaActual.getFullYear());

    // Cuando se pone el foco en el input se limpia la cadenaInput y se muestran los dos botones (por si no se mostraban ya)
    $("input").focus(function () {
        $('#boton-contaminacion').css("display", "inline-block");
        $('#boton-tiempo').css("display", "inline-block");
        cadenaInput = "";
    });

    /** 
     * Cuando dejamos de poner el foco en el input, limpiamos cadenaTiempo, cadenaTiempoActual y cadenaContaminacion, y
     * establecemos cadenaInput con el valor actual que está escrito en el input. 
     * También llamamos al método para crear las URLs de llamadas a la API pasando por parámetro cadenaInput.
     */
    $("input").blur(function () {
        cadenaTiempo = "";
        cadenaTiempoActual = "";
        cadenaContaminacion = "";
        cadenaInput += $(".localidad").val();
        crearCadenaURL(cadenaInput);
    });

    // Cada uno de los botones llamará al método crearResultado pasando por parámetro cuál de los dos botones se ha pulsado
    $("#boton-tiempo").click(function (evt) {
        let boton = "Tiempo";
        crearResultado(boton);
        evt.preventDefault();
    });

    $("#boton-contaminacion").click(function (evt) {
        let boton = "contaminacion";
        crearResultado(boton);
        evt.preventDefault();
    });
});

/**
 * Método para crear las cadenas que serán las URLs de las llamadas a la API.
 * El parámetro que reciben será una ciudad y, opcionalmente, el código de un país.
 * Primero se divide, y se crea cada cadena añadiendo estos indicativos como parámetros de la URL
 * 
 * @param cadenaInput recibe el valor actual escrito en el input
 */
let crearCadenaURL = function (cadenaInput) {
    let arraySeparacion = cadenaInput.split(", ");

    /*cadenaTiempo += "https://api.weatherbit.io/v2.0/forecast/daily?city=";*/
    cadenaTiempo += "https://api.weatherbit.io/v2.0/history/daily?city=";
    cadenaTiempo += arraySeparacion[0].toLowerCase();
    if (arraySeparacion[1] != null) {
        cadenaTiempo += "&country=" + arraySeparacion[1].toLowerCase();
    }
    cadenaTiempo += "&lang=es&key=" + tuclave;

    cadenaTiempoActual += "https://api.weatherbit.io/v2.0/current?city=";
    cadenaTiempoActual += arraySeparacion[0].toLowerCase();
    if (arraySeparacion[1] != null) {
        cadenaTiempoActual += "&country=" + arraySeparacion[1].toLowerCase();
    }
    cadenaTiempoActual += "&lang=es&key=" + tuclave;

    cadenaContaminacion += "https://api.weatherbit.io/v2.0/current/airquality?city=";
    cadenaContaminacion += arraySeparacion[0].toLowerCase();
    if (arraySeparacion[1] != null) {
        cadenaContaminacion += "&country=" + arraySeparacion[1].toLowerCase();
    }
    cadenaContaminacion += "&lang=es&key=" + tuclave;
};

/**
 * Método que rellenará el array aCambiar con un resultado que dependerá del boótn que se haya pulsado.
 * Si la cadenaInput está vacía o alguna de las llamadas a la API falla, se muestra el error.
 * 
 * @param boton parámetro que indica qué botón se ha pulsado
 */
let crearResultado = function (boton) {
    // Lo primero es comprobar si cadenaInput tiene algún valor o está vacía
    if (cadenaInput == "") {
        mostrarError();;
    } else {
        // Si cadena input no está vacía empieza el proceso de llamada a la API y para ello establece el GIF 
        // de carga AJAX, lo primero. Utilizamos para ello el div de "error"
        $("#error").html("<img src='ajax-loader.gif'>");

        /**
         * Distinguimos si se ha pulsado el botón de tiempo.
         * En cuyo caso haremos doble llamada a la API (vamos a utilizar datos de tiempo actual y semanal) y
         * tenemos que comprobar si las llamadas a la API han sido satisfactorias en cada caso.
         * Y en cuyo caso, nuevamente, llamamos al método cambiarCSS, cambiamos adicionalmente el css de los botones 
         * (ocultando el que se acaba de pulsar) y creamos el resultado de 18 secciones de la aplicación que variarán
         * en función del botón que se pulse.
         * Por último, llamamos al método para mostrar ese resultado. 
         */
        if (boton == "Tiempo") {
            /*$.getJSON(cadenaTiempoActual, function (datos_devueltos_actual, estado) {
                if (estado == "success") {
                    $.getJSON(cadenaTiempo, function (datos_devueltos_tiempo, estado) {
                        if (estado == "success") {
                            cambiarCSS();                
                            $('#boton-tiempo').css("display","none");                    
                            $('#boton-contaminacion').css("display","inline-block");
                                
                            // Datos para el panel principal
                            aCambiar[0] = datos_devueltos_actual.data[0].weather.icon;
                            aCambiar[1] = datos_devueltos_actual.data[0].temp + "ºC";
                            aCambiar[2] = datos_devueltos_actual.data[0].weather.description;

                            // Datos para el panel de info
                            aCambiar[3] = "PRECIPITACIONES";
                            aCambiar[4] = datos_devueltos_actual.data[0].precip + " mm";
                            aCambiar[5] = "NUBOSIDAD";
                            aCambiar[6] = datos_devueltos_actual.data[0].clouds + " %";
                            aCambiar[7] = "VIENTO";
                            aCambiar[8] = datos_devueltos_actual.data[0].wind_spd + " m/s - " + datos_devueltos_actual.data[0].wind_cdir;
                            aCambiar[9] = "PRESIÓN ATM.";

                            // Datos para lista-semana
                            aCambiar[10] = datos_devueltos_tiempo.data[0].pres + " mb";
                            aCambiar[11] = datos_devueltos_tiempo.data[1].weather.icon;
                            aCambiar[12] = datos_devueltos_tiempo.data[1].temp + "ºC";
                            aCambiar[13] = datos_devueltos_tiempo.data[2].weather.icon;
                            aCambiar[14] = datos_devueltos_tiempo.data[2].temp + "ºC";
                            aCambiar[15] = datos_devueltos_tiempo.data[3].weather.icon;
                            aCambiar[16] = datos_devueltos_tiempo.data[3].temp + "ºC";
                            aCambiar[17] = datos_devueltos_tiempo.data[0].weather.icon;
                            aCambiar[18] = datos_devueltos_tiempo.data[0].temp + "ºC";
            
                            mostrarResultado();                             
                        ;}
        
                        // Se muestra error si la carga no ha sido satisfactoria
                        else 
                        {       
                            mostrarError();
                        ;}
                    });                     
                ;}

                // Se muestra error si la carga no ha sido satisfactoria
                else 
                {       
                    mostrarError();
                ;}
            });*/
            mostrarMensajeAPI();;
        }

        /**
         * Distinguimos si se ha pulsado el botón de contaminación.
         * En cuyo caso haremos doble llamada a la API (vamos a utilizar datos de tiempo semanal y contaminación) y
         * tenemos que comprobar si las llamadas a la API han sido satisfactorias en cada caso.
         * Y en cuyo caso, nuevamente, llamamos al método cambiarCSS, cambiamos adicionalmente el css de los botones 
         * (ocultando el que se acaba de pulsar) y creamos el resultado de 18 secciones de la aplicación que variarán
         * en función del botón que se pulse.
         * Por último, llamamos al método para mostrar ese resultado. 
         */
        if (boton == "contaminacion") {
            /*$.getJSON(cadenaContaminacion, function (datos_devueltos_contaminacion, estado) {
                if (estado == "success") {
                    $.getJSON(cadenaTiempo, function (datos_devueltos_tiempo, estado) {
                        if (estado == "success") {
                            cambiarCSS();
                            $('#boton-contaminacion').css("display", "none");
                            $('#boton-tiempo').css("display", "inline-block");

                            // aCambiar[0] y aCambiar[2] se coreesponderán con icono-principal y estado-indicativo en el 
                            // método mostrarResultado. En el caso de "contaminación" no serán variables como se puede ver,
                            // al contrario que con "tiempo". Se mostrará un icono de humo y el indicativo será "Índice de calidad del aire"
                            aCambiar[0] = "smoke";
                            aCambiar[1] = datos_devueltos_contaminacion.data[0].aqi;
                            aCambiar[2] = "Índice de calidad del aire";

                            // Datos para el panel de info
                            aCambiar[3] = "OZONO";
                            aCambiar[4] = datos_devueltos_contaminacion.data[0].o3 + " µg/m³";
                            aCambiar[5] = "SO2";
                            aCambiar[6] = datos_devueltos_contaminacion.data[0].so2 + " µg/m³";
                            aCambiar[7] = "NO2";
                            aCambiar[8] = datos_devueltos_contaminacion.data[0].no2 + " µg/m³";
                            aCambiar[9] = "PARTÍCULAS < 10µm";
                            aCambiar[10] = datos_devueltos_contaminacion.data[0].pm10 + " µg/m³";

                            // En lista-semana se mostrarán, igualmente, datos de tiempo meteorológico
                            aCambiar[11] = datos_devueltos_tiempo.data[1].weather.icon;
                            aCambiar[12] = datos_devueltos_tiempo.data[1].temp + "ºC";
                            aCambiar[13] = datos_devueltos_tiempo.data[2].weather.icon;
                            aCambiar[14] = datos_devueltos_tiempo.data[2].temp + "ºC";
                            aCambiar[15] = datos_devueltos_tiempo.data[3].weather.icon;
                            aCambiar[16] = datos_devueltos_tiempo.data[3].temp + "ºC";
                            aCambiar[17] = datos_devueltos_tiempo.data[0].weather.icon;
                            aCambiar[18] = datos_devueltos_tiempo.data[0].temp + "ºC";

                            mostrarResultado();;
                        }

                        // Se muestra error si la carga no ha sido satisfactoria
                        else {
                            mostrarError();;
                        }
                    });;
                }

                // Se muestra error si la carga no ha sido satisfactoria
                else {
                    mostrarError();;
                }
            });;*/
            mostrarMensajeAPI();;
        };
    }
};

/**
 * Método para mostrar el error (y añadir de nuevo el texto, en caso de que tuviera el GIF)
 */
let mostrarError = function () {
    $("#error").html("No has introducido una localidad válida");
    $('#error').css("display", "block");
};

/**
 * Método para mostrar el mensaje sobre la API
 */
let mostrarMensajeAPI = function () {
    $("#error").html("En estos momentos existe un problema con la API que se está solucionando. Perdone las molestias");
    $('#error').css("display", "block");
};

/**
 * Cambios de CSS que ocurren con cada clic en un botón.
 * Se vuelve a poner el input en su sitio, se oculta "error", los botones tendrán nuevo tamaño y márgenes
 * y se muestra lista-semana
 */
let cambiarCSS = function () {
    $('.localidad').css('margin-top', '12px');
    $('#error').css("display", "none");
    $('.boton').css('margin', '0 9px');
    $('.boton').css('width', '140px');
    $('.lista-semana').css("display", "block");
};

/**
 * Método para mostrar el resultado después del clic en cada botón.
 * Para ello se cambia el css, las clases o el contenido html de varios elementos
 */
let mostrarResultado = function () {
    // Cambiamos icono-prinicipal, el estado-actual y el estado-indicativo
    $('#icono-principal').removeClass();
    $('#icono-principal').addClass("wi wi-60 " + ICONOS[aCambiar[0]]);
    $(".estado-actual").html(aCambiar[1]);
    $(".estado-indicativo").html(aCambiar[2]);

    // Empezamos a cambiar, en el panel de información, cada par de "dato:valor"
    $(".dato1 > .titulo").html(aCambiar[3]);
    $(".dato1 > .valor").html(aCambiar[4]);
    $(".dato2 > .titulo").html(aCambiar[5]);
    $(".dato2 > .valor").html(aCambiar[6]);

    // En el caso del viento, si no existe no se muestra este par "dato:valor"
    if (aCambiar[7] == "VIENTO" && aCambiar[8].includes("0 m/s")) {
        $('.dato3').css("display", "none");;
    } else {
        $('.dato3').css("display", "block");
        $(".dato3 > .titulo").html(aCambiar[7]);
        $(".dato3 > .valor").html(aCambiar[8]);;
    }

    $(".dato4 > .titulo").html(aCambiar[9]);
    $(".dato4 > .valor").html(aCambiar[10]);

    // Por último, se cambiarán los elementos de lista-semana: icono, nombre del día (Hoy y Mañ para los primeros
    // y, según el día actual, 3º y 4º día tendrán sus propios nombres) y el dato de temperatura en cuestión
    $("#icono-diario1").removeClass();
    $("#icono-diario1").addClass("wi wi-30 " + ICONOS[aCambiar[17]]);
    $("li:nth-child(1) > .nombre-dia").html("Hoy");
    $("li:nth-child(1) > .dato-diario").html(aCambiar[18]);

    $("#icono-diario2").removeClass();
    $("#icono-diario2").addClass("wi wi-30 " + ICONOS[aCambiar[11]]);
    $("li:nth-child(2) > .nombre-dia").html("Mañ");
    $("li:nth-child(2) > .dato-diario").html(aCambiar[12]);

    $("#icono-diario3").removeClass();
    $("#icono-diario3").addClass("wi wi-30 " + ICONOS[aCambiar[13]]);
    $("li:nth-child(3) > .nombre-dia").html(DIASACOR[new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + 2).getDay()]);
    $("li:nth-child(3) > .dato-diario").html(aCambiar[14]);

    $("#icono-diario4").removeClass();
    $("#icono-diario4").addClass("wi wi-30 " + ICONOS[aCambiar[15]]);
    $("li:nth-child(4) > .nombre-dia").html(DIASACOR[new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + 3).getDay()]);
    $("li:nth-child(4) > .dato-diario").html(aCambiar[16]);
};