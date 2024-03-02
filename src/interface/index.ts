export function FieldResize(): void {
  var Field = document.querySelector('.route_field');
  const FieldRect = Field.getBoundingClientRect();
  const FieldWidth = FieldRect.width;
  const FieldHeight = FieldRect.height;
  document.querySelector('#field_size').innerHTML = `
 :root {
 --b-fw:${FieldWidth}px;
 --b-fh:${FieldHeight}px;
 }
 `;
}
