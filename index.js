const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: '525',
    user: 'root',   

    
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// depósito de datos temporal
let usuarios = []; // <- se inicia vacío con la aplicación

//rutas o endpoints
app.post('/api/registro/add', (req, res, next) => {
    const usuario = req.body;
    if (!usuario) {
        return res.status(400).json({ error: 'No hay datos' });
    } else {
        connection.query("INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `fec_nacimiento`, `sexo`, `pais`, `departamento`, `ciudad`, `direccion`, `casa_apto`)" +
            "VALUES (NULL, '" + usuario.nombre + "', '" + usuario.apellido + "', '" + usuario.email + "', '" + usuario.fec_nacimiento + "', '" + usuario.sexo + "', '" + usuario.pais + "', '" + usuario.departamento + "', '" + usuario.ciudad + "', '" + usuario.direccion + "', '" + usuario.casa + "');", function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    return res.status(200).json("Registro Correctamente");
                }
            });
    }
});

app.post('/api/editar/upd', (req, res, next) => {
    const usuario = req.body;
    if (!usuario) {
        return res.status(400).json({ error: 'No hay datos' });
    } else {
        connection.query("UPDATE `usuarios` SET `nombre` = '" + usuario.nombre + "', `apellido` = '" + usuario.apellido + "', `email` = '" + usuario.email + "' " +
            ", `fec_nacimiento` = '" + usuario.fec_nacimiento + "', `sexo` = '" + usuario.sexo + "', `pais` = '" + usuario.pais + "', `departamento` = '" + usuario.departamento + "'" +
            ", `ciudad` ='" + usuario.ciudad + "', `direccion` = '" + usuario.direccion + "', `casa_apto` = '" + usuario.casa + "' where `usuarios`.`email` = '" + usuario.email + "';", function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    return res.status(200).json("Actulizacion Correctamente");
                }
            });
    }
});

app.post('/api/eliminar/del', (req, res, next) => {
    const usuario = req.body;
    if (!usuario) {
        return res.status(400).json({ error: 'No hay datos' });
    } else {
        connection.query("DELETE FROM `usuarios` WHERE `usuarios`.`email` = '" + usuario.email + "' ", function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                return res.status(200).json("Elimino Correctamente");
            }
        });
    }
});

app.get('/api/listar/get', (req, res, next) => {
    connection.query("SELECT * FROM usuarios", function (error, results, fields) {
        if (error)
            throw error;

        results.forEach(result => {
            console.log(result);
            result.no = usuarios.length + 1;
            usuarios.push(result);
            
        });
        console.log(usuarios)
        return res.status(200).json(usuarios);
    });

});

app.get('/api/listar/ciudad/:ciudad', (req, res, next) => {
    connection.query("SELECT * FROM usuarios WHERE ciudad ='"+req.params.ciudad+"'" , function (error, results, fields) {
        if (error)
            throw error;


        return res.status(200).json(results);
    });

});

app.all('/login', (req, res) => {
    const fileName = path.join(__dirname, './views/formulario.html');
    return res.sendFile(fileName);
});

app.all('/editar', (req, res) => {
    const fileName = path.join(__dirname, './views/editar.html');
    return res.sendFile(fileName);
});

app.all('/eliminar', (req, res) => {
    const fileName = path.join(__dirname, './views/eliminar.html');
    return res.sendFile(fileName);
});

app.all('/', (req, res) => {
    const fileName = path.join(__dirname, './views/index.html');
    return res.sendFile(fileName);
});


app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto: ${port}.`);
});
