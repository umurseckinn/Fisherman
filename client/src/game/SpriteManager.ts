
export class SpriteManager {
  private images: Record<string, HTMLImageElement> = {};
  private loadedCount = 0;
  private totalCount = 0;
  private onAllLoaded: () => void;

  constructor(onAllLoaded: () => void) {
    this.onAllLoaded = onAllLoaded;
  }

  loadImages(assets: Record<string, string>) {
    const keys = Object.keys(assets);
    this.totalCount = keys.length;

    if (this.totalCount === 0) {
      this.onAllLoaded();
      return;
    }

    keys.forEach(key => {
      const img = new Image();
      img.src = assets[key];
      img.onload = () => {
        this.loadedCount++;
        if (this.loadedCount === this.totalCount) {
          this.onAllLoaded();
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${assets[key]}`);
        this.loadedCount++; // Still count as processed
        if (this.loadedCount === this.totalCount) {
          this.onAllLoaded();
        }
      };
      this.images[key] = img;
    });
  }

  getImage(key: string): HTMLImageElement | undefined {
    return this.images[key];
  }
}

export const ASSETS = {
  // Fish types
  'fish_bubble': '/assets/fish/bubble_fish.png',
  'fish_sakura': '/assets/fish/sakura_fish.png',
  'fish_zap': '/assets/fish/zap_fish.png',
  'fish_candy': '/assets/fish/candy_fish.png',
  'fish_moon': '/assets/fish/moon_fish.png',
  'fish_lava': '/assets/fish/lava_fish.png',
  'fish_crystal': '/assets/fish/crystal_fish.png',
  'fish_leaf': '/assets/fish/leaf_fish.png',
  'fish_tide': '/assets/fish/tide_fish.png',
  'fish_mushroom': '/assets/fish/mushroom_fish.png',
  'fish_king': '/assets/fish/king_fish.png',
  'fish_galaxy': '/assets/fish/galaxy_fish.png',
  'fish_coral': '/assets/environment/coral.png',
  'fish_sea_kelp': '/assets/environment/sea_kelp.png',
  'fish_sea_kelp_horizontal': '/assets/environment/sea_kelp.png',
  'fish_sea_rock': '/assets/environment/sea_rock.png',
  'fish_sea_rock_large': '/assets/environment/sea_rock.png',
  'fish_gold_doubloon': '/assets/environment/gold_doubloon.png',
  'fish_whirlpool': '/assets/environment/whirlpool.png',
  'fish_sunken_boat': '/assets/environment/sunken_boat.png',
  'fish_shark_skeleton': '/assets/environment/shark_skeleton.png',
  'fish_env_bubbles': '/assets/environment/bubbles.png',
  'fish_anchor': '/assets/environment/anchor.png',
  'fish_shell': '/assets/environment/shell.png',

  // Environment
  'boat': '/assets/environment/boat.svg',
  'fisherman': '/assets/environment/fisherman.svg',
  'hook': '/assets/environment/hook.svg',
  'background_sky': '/assets/environment/sky.svg', // Optional
  'background_sea': '/assets/environment/sea.svg', // Optional

  // Fisherman + Boat sprite (kullanıcı görseli)
  'fisherman_boat': '/assets/fisherman_and_boat/fisherman1.png',
};
