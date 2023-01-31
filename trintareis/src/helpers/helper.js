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


export const formatDate = (dateString) => {
    const dateOptions = {year: "numeric", month: "long", day: "numeric"}
    const timeOptions = {hour12: false, hour:"numeric", minute:"numeric"}
    return ( new Date(dateString).toLocaleDateString("pt-BR", dateOptions) + " - " +  new Date(dateString).toLocaleTimeString("pt-BR", timeOptions))
}

export function enterHandler(event, perform){
    if (event.keyCode === 13) {
        perform()
    }
    // usar em
    // onKeyDown={(e) => enterHandler(e, função)}
}

export function focusChangeOnEnter(event, ref){
    if (event.keyCode === 13) {
        ref.current.focus();
    }
    // usar em
    // onKeyDown={(e) => enterHandler(e, função)}
}