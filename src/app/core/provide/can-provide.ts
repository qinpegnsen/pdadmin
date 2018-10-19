import {Injectable, OnInit} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Injectable()
export class CanProvide implements CanActivate, OnInit {

  constructor(public router: Router) {
  }

  ngOnInit(): void {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    let me = this;
    return new Observable((observer) => {
      observer.next(true);
      observer.complete();
      return;
    });
  }

}
