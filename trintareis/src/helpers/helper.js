export function isEmpty(value) {
    return (value == null || value.length === 0 || value === "string");
}

/*
chamada para 1 segundo
await delay(1000);
*/
export function delay(miliseconds) {
    return new Promise( res => setTimeout(res, miliseconds) );
}