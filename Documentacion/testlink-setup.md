# Configuración de TestLink 1.9.0

Esta guía explica cómo instalar y configurar TestLink 1.9.0 en macOS usando XAMPP.

## Requisitos Previos

- XAMPP instalado en `/Applications/XAMPP/`
- TestLink 1.9.0 descargado

## Pasos de Instalación

### 1. Extraer TestLink

```bash
# Si tienes el archivo .zip en Downloads
cd ~/Downloads
unzip testlink-1.9.0.zip
```

### 2. Copiar TestLink al directorio web

```bash
# Copiar TestLink a htdocs
cp -R ~/Downloads/testlink-1.9.0/ /Applications/XAMPP/xamppfiles/htdocs/testlink
```

### 3. Configurar permisos

```bash
# Permisos básicos para TestLink
chmod -R 755 /Applications/XAMPP/xamppfiles/htdocs/testlink

# Permisos de escritura para directorios específicos
chmod -R 777 /Applications/XAMPP/xamppfiles/htdocs/testlink/logs
chmod -R 777 /Applications/XAMPP/xamppfiles/htdocs/testlink/upload_area
```

### 4. Iniciar los servicios

#### Opción A: Usando XAMPP Control Panel
1. Abrir `/Applications/XAMPP/XAMPP Control Panel.app`
2. Hacer clic en "Start" para Apache y MySQL

#### Opción B: Desde terminal
```bash
# Iniciar XAMPP completo
sudo /Applications/XAMPP/xamppfiles/xampp start

# O iniciar servicios individualmente
sudo /Applications/XAMPP/xamppfiles/bin/apachectl start
sudo /Applications/XAMPP/xamppfiles/bin/mysqld_safe --datadir='/Applications/XAMPP/xamppfiles/var/mysql' &
```

#### Opción C: Servidor PHP integrado (alternativa)
```bash
# Si Apache no funciona, usar servidor PHP
cd /Applications/XAMPP/xamppfiles/htdocs/testlink
/Applications/XAMPP/xamppfiles/bin/php -S localhost:8080 -t . &
```

### 5. Verificar que los servicios estén corriendo

```bash
# Verificar puertos en uso
lsof -i -P -n | grep LISTEN

# Probar conectividad
curl -I http://localhost        # Puerto 80 (Apache)
curl -I http://localhost:8080   # Puerto 8080 (PHP server)
```

### 6. Acceder al instalador web

1. Abrir navegador y ir a:
   - **http://localhost/testlink** (si Apache está en puerto 80)
   - **http://localhost:8080** (si usas servidor PHP)

2. Seguir el asistente de instalación

## Configuración de Base de Datos

Durante la instalación, usar estos valores:

- **Tipo de BD**: MySQL
- **Host**: localhost
- **Puerto**: 3306
- **Usuario**: root
- **Contraseña**: (dejar vacío por defecto)
- **Nombre de BD**: testlink

## Solución de Problemas

### Apache no inicia
```bash
# Verificar logs de error
cat /Applications/XAMPP/xamppfiles/logs/error_log | tail -10

# Usar servidor PHP como alternativa
cd /Applications/XAMPP/xamppfiles/htdocs/testlink
/Applications/XAMPP/xamppfiles/bin/php -S localhost:8080 -t . &
```

### Problemas de permisos
```bash
# Arreglar permisos de XAMPP
sudo chown -R $(whoami) /Applications/XAMPP/xamppfiles/htdocs/testlink
```

### MySQL no conecta
```bash
# Verificar estado de MySQL
/Applications/XAMPP/xamppfiles/bin/mysql -u root -p

# Reiniciar MySQL si es necesario
sudo /Applications/XAMPP/xamppfiles/bin/mysqladmin shutdown
sudo /Applications/XAMPP/xamppfiles/bin/mysqld_safe --datadir='/Applications/XAMPP/xamppfiles/var/mysql' &
```

## Comandos Útiles

```bash
# Verificar servicios XAMPP
/Applications/XAMPP/xamppfiles/xampp status

# Detener servicios
sudo /Applications/XAMPP/xamppfiles/xampp stop

# Reiniciar servicios
sudo /Applications/XAMPP/xamppfiles/xampp restart

# Ver procesos de Apache
ps aux | grep httpd

# Ver procesos de MySQL
ps aux | grep mysql
```

## Acceso Final

Una vez completada la instalación:

- **URL**: http://localhost/testlink o http://localhost:8080
- **Usuario por defecto**: admin
- **Contraseña**: admin (cambiar después del primer login)

## Notas Adicionales

- TestLink 1.9.0 requiere PHP 5.2+ y MySQL 5.x
- Los directorios `logs` y `upload_area` necesitan permisos de escritura
- Se recomienda cambiar las credenciales por defecto después de la instalación
- Para uso en producción, configurar Apache con SSL y medidas de seguridad adicionales