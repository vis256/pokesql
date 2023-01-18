import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';

const constraint_map : any = {
  "attacks_pkey": "Atak o takiej nazwie już istnieje",
  "attacks_hit_chance_check": "Szansa trafienia ataku musi być między 0 a 1"
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor() { }

  displayError(err : {
    column? : string | null,
    constraint? : string | null,
    message? : string | null
  }) {
    let msg = '';

    if (err.constraint) msg = constraint_map[err.constraint]
    else if (err.message) msg = err.message;
    else msg = 'Unknown error'
    notify(msg, "error", 2000);
  }
}
