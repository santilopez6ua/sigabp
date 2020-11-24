import { Component, OnInit } from '@angular/core';
import { sidebarItem } from 'src/app/interfaces/sidebar.interface';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menu: sidebarItem[] = [];

  constructor( private sidebar: SidebarService) { }

  ngOnInit(): void {
    this.menu = this.sidebar.getmenu();
    console.log(this.menu);
  }

}
