# <h1 style="font-size: 3rem; line-height: 1.1; font-weight: 100">Social Networks Admin</h1>
### <h3 style="font-size: 1.5rem; line-height: 1.1; font-weight: 200">Plugins de gestion de redes sociales</h3>

* Autor: Robert Pérez
* Email: delfinmundo@gmail.com
* Licencia: [MIT](LICENCE)

## Tabla de Contenido

* [Introducci&oacute;n](#intro)
* [Instalaci&oacute;n](#instal)
* [Dependencias](#depn)
* [Uso](#use)

<a id="intro"></a>
<p style="font-size: 1.1rem line-height: 1.1; font-weight: 200">
	SNA. es un pequeño pero poderoso plugins que permite gestionar de manera sencilla y practica todas nuestras redes sociales.
</p>

Este cuenta con 3 Modalidades o SubPlugins para los 3 usos mas populares de las redes sociales.<br/>
Las modalidades son:

* Sígueme (SNA_followme) : Permite colocar nuestras redes sociales donde deseemos dentro de nuestra web una o mas veces como por ejemplo esta página que tiene 3 veces colocados.
* Compartir (SNA_share) : Permite colocar iconos o botones de compartir con todas las redes sociales que deseemos incluso con Whatsapp.
* Boton Flotante (SNA_button) : Permite agregar botones flotantes a nuestra web para el chat de nuestra red social favorita.

<a id="instal"></a>
## Instalaci&oacute;n
Para usarlo copie la carpeta dist y lib y el archivo config.json a su proyecto luego incluya las siguientes lineas

```
<link rel="stylesheet" type="text/css" href="dist/css/sna.css"><!-- En el Head -->
<script src="dist/js/sna.js"></script> <!-- Antes del cierre del Body -->
```

<a id="depn"></a>
## Dependencias

* jQuery >= 3
* phpmailer >= 6

## Uso  ##

Su uso es muy sencillo ya que SNA aprobecha al maximo el uso de los atributos data ( DataSet ) por ejemplo si deseamos colocar un grupo de botones flotanto a la derecha de nuestra web
solo basta con colocar lo siguiente en cualquier parte del código de nuestro sitio web.

```
<div data-role="snafollowme"
     data-inline="true"
     data-pos="right-center"
	 data-links='{"facebook":"rep190","twitter":"Robert_saer","instagram":"robertperez757", "mailto":"delfinmundo@gmail.com"}'>
</div>
```

En caso de que sea un grupo de botones de compartir podemos usar la siguiente sintaxis:

```
<div data-role="snashare"
     data-only="icon"
     data-target="dialog"
     data-size="small"
     data-social="facebook,twitter,mailto"
     data-title="Titulo"
     data-description="Descripción">
</div>
```
 Ahora si lo que deseamos es un boton flotante solo usemos la siguiente linea esto es JAVASCRIPT:

```
SNA.btnfloat.create({
	data:{
		phone:'+584241922546',
		text:'Me gusta Tu sistio'
	}
});
```

Para ver mas ejemplos y una documentación mas detallata descargela y carge el archivo index desde cualquier navegador web.
