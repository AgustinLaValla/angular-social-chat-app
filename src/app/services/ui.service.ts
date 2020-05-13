import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as M from 'materialize-css';

@Injectable({providedIn: 'root'})
export class UiService {

    public loadingSubjet = new Subject<boolean>();

    public toast: string;

    constructor() { }
    
    errorHandler(error: any) {
        if (Object.keys(error.error.message).length > 0 &&
          error.error.message.details &&
          error.error.message.details[0]?.path[0] !== 'password'
        ) {
          this.toast = `<span style="bottom:0px">${error.error.message.details[0].message}</span><button class="btn-flat toast-action">OK</button>`;
          new M.Toast({ html: this.toast, classes: 'toast-style' });
        } else if (error.error.message.details && error.error.message.details[0].path[0] === 'password') {
          this.toast = `<span style="bottom:0px">Password too weak!</span><button class="btn-flat toast-action">OK</button>`;
          new M.Toast({ html: this.toast, classes: 'toast-style' });
        } else {
          this.toast = `<span style="bottom:0px">${error.error.message}</span><button class="btn-flat toast-action">OK</button>`;
          new M.Toast({ html: this.toast, classes: 'toast-style' });
        };
    
      };

}