/**
 * @fileOverview menu
 * @author yiminghe@gmail.com
 */
KISSY.add("menu", function (S, Menu, Render, Item, ItemRender, SubMenu, SubMenuRender, Separator, SeparatorRender, PopupMenu, FilterMenu) {
    Menu.Render = Render;
    Menu.Item = Item;
    Menu.Item.Render = ItemRender;
    Menu.SubMenu = SubMenu;
    SubMenu.Render = SubMenuRender;
    Menu.Separator = Separator;
    Menu.PopupMenu = PopupMenu;
    Menu.FilterMenu = FilterMenu;
    return Menu;
}, {
    requires:[
        'menu/base',
        'menu/menurender',
        'menu/menuitem',
        'menu/menuitemrender',
        'menu/submenu',
        'menu/submenurender',
        'menu/separator',
        'menu/separatorrender',
        'menu/popupmenu',
        'menu/filtermenu'
    ]
});