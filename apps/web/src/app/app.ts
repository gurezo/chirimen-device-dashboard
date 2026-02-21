import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { HeaderComponent } from "./components/header/header.component";

@Component({
  imports: [RouterModule, MatButtonModule, HeaderComponent],
  selector: "choh-root",
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  protected title = "web";
}
