
interface sidebarSubItem {
  titulo: string;
  icono: string;
  url: string;
}


export interface sidebarItem {
  titulo: string;
  icono: string;
  sub: boolean; // si tiene o no submenu
  url?: string;
  subMenu?: sidebarSubItem[];
}
