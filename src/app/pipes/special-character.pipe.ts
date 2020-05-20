import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'specialChar'
})

export class SpecialCharacterPipe implements PipeTransform {
    transform(value: string): any {

        const specialChar:string = 'Ã' || 'ã';

        if(value.indexOf(specialChar) >= 0 ) { 

            return value.replace(specialChar, 'í' );
        };
    };
};