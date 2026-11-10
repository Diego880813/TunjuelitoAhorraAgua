/* Lógica pura: sin DOM y sin conexión a servicios. Se puede probar con Node. */
(function(root){
  'use strict';
  function numero(valor,min,max,entero=false){
    if(valor===null || typeof valor==='boolean' || String(valor).trim()==='') throw new Error('Completa el dato solicitado.');
    const n=Number(valor);
    if(!Number.isFinite(n)||n<min||n>max||(entero&&!Number.isInteger(n))) throw new Error(`Ingresa ${entero?'un número entero':'un número'} entre ${min} y ${max}.`);
    return n;
  }
  function consumo(recibos,personas){
    numero(personas,1,30,true);
    if(!recibos.length)return null;
    const total=recibos.reduce((a,r)=>({litros:a.litros+numero(r.m3,0,10000)*1000,dias:a.dias+numero(r.dias,1,366,true)}),{litros:0,dias:0});
    return {...total,diario:total.litros/total.dias,persona:total.litros/total.dias/personas};
  }
  function plan(estado){
    const personas=numero(estado.hogar.personas,1,30,true),dias=numero(estado.horas,1,168)/24;
    const filas=root.DatosDemo.referencias.filter(r=>estado.seleccion.includes(r.id)&&(r.id!=='mascota'||estado.hogar.mascota)).map(r=>({...r,tasa:numero(estado.tasas[r.id],0.1,1000),total:estado.tasas[r.id]*(r.base==='persona'?personas:1)*dias}));
    const total=filas.reduce((a,r)=>a+r.total,0),reserva=numero(estado.reserva,0,100000);
    return {filas,total,saldo:reserva-total,cobertura:total?reserva/total*100:0,horas:total?reserva/(total/estado.horas):0};
  }
  function meta(promedio,porcentaje){return promedio===null?null:promedio*(1-numero(porcentaje,0,30)/100);}
  // El rango estima SOLO ducha y cocina. No reemplaza el total del recibo.
  function habitos(h){const ducha=numero(h.ducha,0.1,120)*numero(h.caudal,0.1,40)*numero(h.personas,1,30,true),cocina=numero(h.cocina,0.1,200);return {ducha,cocina,total:ducha+cocina,min:(ducha+cocina)*0.8,max:(ducha+cocina)*1.2};}
  function validar(s){
    if(!s||s.version!==1||!s.hogar||!Array.isArray(s.recibos)||s.recibos.length>100||!Array.isArray(s.seleccion)||!Array.isArray(s.leidos))throw new Error('Datos guardados no compatibles.');
    if(typeof s.hogar.nombre!=='string'||s.hogar.nombre.length>50||typeof s.hogar.mayor!=='boolean'||typeof s.hogar.mascota!=='boolean'||typeof s.hogar.esEstimado!=='boolean'||!Array.isArray(s.hogar.actividades))throw new Error('Perfil inválido.');
    if(!s.hogar.actividades.every(a=>['cocinar','limpieza','ropa','plantas'].includes(a)))throw new Error('Actividades inválidas.');
    if(!s.leidos.every(a=>['corte','meta','reserva'].includes(a)))throw new Error('Avisos inválidos.');
    if(!s.seleccion.every(a=>root.DatosDemo.referencias.some(r=>r.id===a))||!['beber','cocinar','higiene','sanitario'].every(a=>s.seleccion.includes(a)))throw new Error('Plan incompleto.');
    root.DatosDemo.referencias.forEach(r=>numero(s.tasas[r.id],0.1,1000));
    s.recibos.forEach(r=>{numero(r.id,0,Number.MAX_SAFE_INTEGER,true);if(r.valor!==null)numero(r.valor,0,100000000);});
    consumo(s.recibos,s.hogar.personas);habitos(s.hogar);plan(s);numero(s.meta,0,30);
    return s;
  }
  root.CalculadoraConsumo={numero,consumo,plan,meta,habitos,validar};
})(typeof window==='undefined'?globalThis:window);
