/* ReferenciaConsumo: todos los valores numéricos son supuestos pedagógicos,
   NO recomendaciones EAAB, mínimos de salud ni datos medidos. */
(function (root) {
  'use strict';
  const referencias = [
    { id:'beber', nombre:'Agua para beber', unidad:'L / persona / día', base:'persona', litros:3, esencial:true, icono:'gota' },
    { id:'cocinar', nombre:'Preparar alimentos', unidad:'L / hogar / día', base:'hogar', litros:8, esencial:true, icono:'cocina' },
    { id:'higiene', nombre:'Higiene básica', unidad:'L / persona / día', base:'persona', litros:10, esencial:true, icono:'gota' },
    { id:'sanitario', nombre:'Uso del sanitario', unidad:'L / persona / día', base:'persona', litros:18, esencial:true, icono:'hogar' },
    { id:'limpieza', nombre:'Limpieza doméstica', unidad:'L / hogar / día', base:'hogar', litros:10, esencial:false, icono:'brillo' },
    { id:'ropa', nombre:'Lavado de ropa', unidad:'L / hogar / día', base:'hogar', litros:50, esencial:false, icono:'ropa' },
    { id:'mascota', nombre:'Cuidado de mascotas', unidad:'L / hogar / día', base:'hogar', litros:2, esencial:true, icono:'huella' }
  ];
  const crear = (id) => {
    const base = { version:1, escenario:id, hogar:{nombre:'Mi hogar', personas:1, mayor:false, mascota:false, actividades:['cocinar','limpieza'], ducha:5, caudal:8, cocina:8, esEstimado:true}, recibos:[], meta:10, reserva:0, horas:24, tasas:Object.fromEntries(referencias.map(r=>[r.id,r.litros])), seleccion:['beber','cocinar','higiene','sanitario','limpieza'], leidos:[] };
    if (id==='familia') Object.assign(base,{hogar:{...base.hogar,nombre:'Familia de cuatro',personas:4,ducha:8,actividades:['cocinar','limpieza','ropa']},reserva:120,recibos:[{id:1,m3:24,dias:60,valor:156000,demo:true},{id:2,m3:21,dias:60,valor:148000,demo:true}]});
    if (id==='mayor') Object.assign(base,{hogar:{...base.hogar,nombre:'Hogar con adulto mayor',personas:3,mayor:true,ducha:6},reserva:120,recibos:[{id:1,m3:18,dias:60,valor:null,demo:true}]});
    if (id==='mascota') Object.assign(base,{hogar:{...base.hogar,nombre:'Hogar con mascota',personas:2,mascota:true,ducha:7},reserva:100,seleccion:[...base.seleccion,'mascota'],recibos:[{id:1,m3:13.2,dias:60,valor:null,demo:true}]});
    return base;
  };
  root.DatosDemo={referencias,crear};
})(typeof window==='undefined'?globalThis:window);
