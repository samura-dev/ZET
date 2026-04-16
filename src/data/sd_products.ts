import sd_productsJson from "./sd_products.json";

export type sd_ProductCategory = "bloggers" | "new" | "best";

export type sd_Product = {
  id: string;
  slug: string;
  title: string;
  price: number;
  oldPrice?: number;
  badge: string;
  category: sd_ProductCategory;
  shortDescription: string;
  description: string;
  specs: string[];
  images: string[];
  stock: number;
  isNew: boolean;
  isBest: boolean;
};

const sd_slugify = (sd_value: string): string => sd_value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const sd_normalizeImagePath = (sd_path: string): string => {
  if (!sd_path.startsWith("/bags/")) {
    return sd_path;
  }
  const sd_file = sd_path.replace("/bags/", "");
  return sd_file.includes(" ") ? `/bags/${encodeURIComponent(sd_file)}` : sd_path;
};

const sd_rawProducts = sd_productsJson as sd_Product[];

export const sd_products: sd_Product[] = sd_rawProducts.map((sd_item) => ({ ...sd_item, slug: sd_item.slug || sd_slugify(sd_item.title), images: sd_item.images.map(sd_normalizeImagePath) }));

export const sd_formatPrice = (sd_price: number): string => `${new Intl.NumberFormat("ru-RU").format(sd_price)} ₽`;

export const sd_getProductBySlug = (sd_slug: string): sd_Product | undefined => sd_products.find((sd_product) => sd_product.slug === sd_slug);
export const sd_getProductsByCategory = (sd_category: sd_ProductCategory): sd_Product[] => sd_products.filter((sd_product) => sd_product.category === sd_category);

export const sd_getRelatedProducts = (sd_slug: string, sd_limit = 3): sd_Product[] => {
  const sd_current = sd_getProductBySlug(sd_slug);
  if (!sd_current) {
    return sd_products.slice(0, sd_limit);
  }
  return sd_products.filter((sd_product) => sd_product.slug !== sd_slug).sort((sd_a, sd_b) => {
    const sd_aScore = Number(sd_a.category === sd_current.category) + Number(sd_a.isBest === sd_current.isBest) + Number(sd_a.isNew === sd_current.isNew);
    const sd_bScore = Number(sd_b.category === sd_current.category) + Number(sd_b.isBest === sd_current.isBest) + Number(sd_b.isNew === sd_current.isNew);
    return sd_bScore - sd_aScore;
  }).slice(0, sd_limit);
};
