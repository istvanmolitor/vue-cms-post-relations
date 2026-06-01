import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { Link2 } from 'lucide-vue-next'

export class CmsRelationsMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName === 'admin') {
      this.addMenuItem(menu, {
        id: 'cms-post-relations',
        title: 'Cikk kapcsolatok',
        path: '/admin/cms-relations',
        icon: Link2,
        order: 41,
        permission: 'cms'
      })
    }

    return menu
  }
}

export const cmsRelationsMenuBuilder = new CmsRelationsMenuBuilder()

