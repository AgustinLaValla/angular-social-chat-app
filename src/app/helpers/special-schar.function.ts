export function specialCharConvertion(value:string) { 
    
    const specialChar:string = 'Ã' || 'ã';

    if(value.indexOf(specialChar) >= 0 ) { 

        return value.replace(specialChar, 'í' ).trim();
    };
}