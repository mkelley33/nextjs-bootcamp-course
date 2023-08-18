// https://stackoverflow.com/questions/40710628/how-to-convert-snake-case-to-camelcase
export default function camelCaseObject(obj: { [key: string]: string }) {
  const newObj: { [key: string]: string } = {};
  for (let d in obj) {
    if (obj.hasOwnProperty(d)) {
      newObj[
        d.replace(/(\_\w)/g, function (k) {
          return k[1].toUpperCase();
        })
      ] = obj[d];
    }
  }
  return newObj;
}
