export type Country = {
  id: string;
  name: string;
  en_name: string;
  alpha2: string;
  alpha3: string;
  numeric: string;
  iso3166_2?: string | null;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
};
