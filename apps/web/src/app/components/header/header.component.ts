import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "choh-header",
  imports: [RouterLink],
  templateUrl: "./header.component.html",
  host: {
    class: "flex-shrink-0",
  },
})
export class HeaderComponent {}
