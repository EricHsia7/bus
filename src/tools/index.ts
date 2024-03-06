var md5 = require('md5');

export function compareThings(a: any, b: any): boolean{
const length = 32
if(typeof a === 'object') {
var ax = JSON.stringify(a)
}
if(typeof b === 'object') {
var bx = JSON.stringify(b)
}

if(typeof a === 'number') {
var ax = String(a)
}
if(typeof b === 'number') {
var bx = String(b)
}

if(typeof a === 'boolean') {
var ax = String(a)
}
if(typeof b === 'boolean') {
var bx = String(b)
}
if(ax.length > length || bx.length > length) {
var hash_a = md5(ax);
var hash_b = md5(bx);

for(var i = 0; i < length; i++) {
var a_i = a.charAt(i)
var b_i = b.charAt(i)
var equal = true
if(a_i===b_i) {
continue;
}
else {
equal = false
break;
}
}
return equal
}
else {
if (ax === bx) {
return true
}
else {
return false
}
}
}