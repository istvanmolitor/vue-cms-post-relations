import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { Link2, Tags } from 'lucide-vue-next'

export class CmsRelationsMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName === 'admin') {
      this.addMenuItem(menu, {
        id: 'cms-post-relations',
        title: 'Cikk kapcsolatok',
        icon: Link2,
        order: 41,
        permission: 'cms_post_relations',
        children: [
          {
            id: 'cms-post-relations-list',
            title: 'Kapcsolatok',
            path: '/admin/cms-relations',
            icon: Link2,
            order: 10,
            permission: 'cms_post_relations'
          },
          {
            id: 'cms-post-relation-types',
            title: 'Kapcsolat típusok',
            path: '/admin/cms-relation-types',
            icon: Tags,
            order: 20,
            permission: 'cms_post_relations'
          }
        ]
      })
    }

    return menu
  }
}

export const cmsRelationsMenuBuilder = new CmsRelationsMenuBuilder()

