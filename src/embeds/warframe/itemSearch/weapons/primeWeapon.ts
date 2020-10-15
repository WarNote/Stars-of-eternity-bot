import type { Item } from 'warframe-items';

import { bestDrops, dropsString } from '../utils';
import BaseWeapon from './baseWeapon';


class WeaponEmbed extends BaseWeapon {
  constructor(public weapon: Item) {
    super(weapon);
  }

  get mainInfoPage() {
    const { weapon, baseEmbed: embed } = this;
    const { components = [] } = weapon;
    const primeComponentsString = components
      .filter(({ drops = [] }) => drops[0]?.type === 'Relics')
      .sort(({ name }) => (name === 'Blueprint' ? -1 : 0))
      .reduce((strings, component) => `${strings}${component.name} **${component.itemCount}**\n`, '');
    embed.addField('Componentes', primeComponentsString, false);
    const resourcesString = components
      .filter(({ uniqueName }) => uniqueName.split('/')[3] === 'Items')
      .reduce((string, resource) => `${string}${resource.name} **${resource.itemCount}**\n`, '');
    if (resourcesString) embed.addField('Recursos', resourcesString, false);
    return embed;
  }

  get componentsPage() {
    const { weapon, baseEmbed: embed } = this;
    const { components = [] } = weapon;
    const componentsFields = components
      .filter(({ drops = [] }) => drops[0]?.type === 'Relics')
      .sort(({ name }) => (name === 'Blueprint' ? -1 : 1))
      .map((component) => {
        const { name, drops } = component;
        const bestDropsString = dropsString(bestDrops(drops));
        return { name, value: bestDropsString, inline: false };
      });
    embed.addFields(...componentsFields);
    return embed;
  }
}

export function primeWeapon(item: Item) {
  const weaponEmbed = new WeaponEmbed(item);
  const { mainInfoPage, componentsPage, baseStatusEmbed } = weaponEmbed;
  const embedMap = new Map();
  embedMap.set('📋', mainInfoPage);
  if (componentsPage) embedMap.set('♻', componentsPage);
  embedMap.set('🃏', baseStatusEmbed);
  return embedMap;
};