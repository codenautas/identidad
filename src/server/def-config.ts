export const staticConfigYaml=`
server:
  port: 3021
  keep-alive: true
  session-store: memory
db:
  motor: postgresql
  host: localhost
  database: identidad_db
  schema: identidad
  user: identidad_admin
login:
  table: usuarios
  userFieldName: usuario
  passFieldName: md5clave
  rolFieldName: rol
  infoFieldList: [usuario, rol]
  activeClausule: activo
  plus:
    allowHttpLogin: true
    fileStore: true
    loginForm:
      formTitle: entrada
      formImg: unlogged/tables-lock.png
client-setup:
  menu: true
  lang: es
  user-scalable: no
  title: identidad
  react: true
install:
  dump:
    db:
      owner: identidad_owner
    enances: inline
    scripts:
      post-adapt: 
      - is_json_text.sql
      - normalizar_calle_fun.sql
      - ../node_modules/pg-triggers/lib/recreate-his.sql
      - ../node_modules/pg-triggers/lib/table-changes.sql
      - ../node_modules/pg-triggers/lib/function-changes-trg.sql
      - ../node_modules/pg-triggers/lib/enance.sql
logo: 
  path: client/img
`;