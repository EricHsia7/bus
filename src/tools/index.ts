var md5 = require('md5');

export function compareThings(a: string, b: string): boolean{
var hash_a = md5(a);
var hash_b = md5(b);
const length = 32
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
return equal
}
}