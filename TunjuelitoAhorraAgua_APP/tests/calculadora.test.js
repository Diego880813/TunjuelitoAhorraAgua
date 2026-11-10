/* Opcional: node tests/calculadora.test.js. No se necesita Node para la app. */
'use strict';
const assert=require('node:assert/strict');
require('../js/datos-demo.js');require('../js/calculadora.js');
const C=globalThis.CalculadoraConsumo,D=globalThis.DatosDemo;let count=0;
function test(name,fn){fn();count++;console.log('OK '+name);}
for(const [id,diario,total,saldo] of [['familia',375,142,-22],['mayor',300,111,9],['mascota',220,82,18]])test('Escenario '+id,()=>{const s=C.validar(D.crear(id));assert.equal(C.consumo(s.recibos,s.hogar.personas).diario,diario);assert.equal(C.plan(s).total,total);assert.equal(C.plan(s).saldo,saldo);});
test('Promedio ponderado, periodos de diferente duración',()=>assert.equal(C.consumo([{m3:12,dias:30},{m3:30,dias:60}],3).diario,42000/90));
test('Conversión m³, per cápita y meta',()=>{const c=C.consumo([{m3:24,dias:60}],4);assert.equal(c.diario,400);assert.equal(c.persona,100);assert.equal(C.meta(c.diario,10),360);});
test('Sin recibos y sin división por cero',()=>{assert.equal(C.consumo([],2),null);assert.equal(C.meta(null,10),null);assert.throws(()=>C.consumo([],0));assert.throws(()=>C.consumo([{m3:2,dias:0}],2));});
test('Rechaza vacíos, negativos, infinito y fracciones de personas',()=>{for(const n of ['',null,false,NaN,Infinity,-1])assert.throws(()=>C.numero(n,0,100));assert.throws(()=>C.numero(2.5,1,30,true));});
test('Cero consumo y cero reserva son válidos',()=>{const s=D.crear('nuevo');assert.equal(C.plan(s).cobertura,0);assert.equal(C.consumo([{m3:0,dias:30}],1).diario,0);});
test('48 horas duplican necesidades',()=>{const s=D.crear('familia');s.horas=48;assert.equal(C.plan(s).total,284);});
test('Actividad opcional cambia el total',()=>{const s=D.crear('familia');s.seleccion.push('ropa');assert.equal(C.plan(s).total,192);s.seleccion=s.seleccion.filter(x=>x!=='limpieza');assert.equal(C.plan(s).total,182);});
test('Tasas editables y escala por personas',()=>{const s=D.crear('familia');s.tasas.beber=4;assert.equal(C.plan(s).total,146);});
test('Meta no altera plan ni usos esenciales',()=>{const s=D.crear('familia');s.meta=30;assert.equal(C.plan(s).total,142);assert.equal(C.meta(375,s.meta),262.5);});
test('Hábitos y rango parcial',()=>{const h=C.habitos(D.crear('familia').hogar);assert.equal(h.total,264);assert.equal(h.min,211.20000000000002);assert.equal(h.max,316.8);});
test('Datos persistidos inválidos y esenciales ausentes',()=>{assert.throws(()=>C.validar({version:2}));const s=D.crear('familia');s.seleccion=[];assert.throws(()=>C.validar(s));});
console.log('\n'+count+' pruebas completadas.');
